import { RequestHandler } from "express";
import { z } from "zod";
import { paystackService } from "../services/paystack";
import { db } from "../db/database";

// Validation schemas
const initializePaymentSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  amount: z.number().positive("Amount must be positive").optional(),
  paymentMethod: z.enum(["paystack", "cash_on_delivery"]),
});

const verifyPaymentSchema = z.object({
  reference: z.string().min(1, "Payment reference is required"),
  requestId: z.string().min(1, "Request ID is required"),
});

// Initialize payment
export const initializePayment: RequestHandler = async (req, res) => {
  try {
    console.log("💳 INITIALIZE PAYMENT - Headers:", req.headers);
    console.log("💳 INITIALIZE PAYMENT - Body:", req.body);

    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      console.log("❌ No userId provided");
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    console.log("🔍 Validating payment request:", req.body);
    const validation = initializePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validation.error.errors,
      });
    }

    console.log("✅ Validation successful:", validation.data);

    const { requestId, paymentMethod } = validation.data;

    // Get user and request details
    const user = await db.getUserById(userId);
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.id, user.name);

    // Get the actual request from database
    const requests = await db.getRequestsByUserId(userId);
    const request = requests.find((req) => req.id === requestId);

    if (!request) {
      console.log("❌ Request not found:", requestId);
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    console.log("✅ Request found:", request.id, request.type, request.amount);

    if (paymentMethod === "cash_on_delivery") {
      // For cash on delivery, mark as pending payment
      return res.json({
        success: true,
        message: "Cash on delivery option selected",
        paymentMethod: "cash_on_delivery",
        requiresPayment: false,
        nextStep:
          "Document will be prepared for delivery. Payment due on delivery.",
      });
    }

    if (paymentMethod === "paystack") {
      // Generate payment reference
      const reference = paystackService.generatePaymentReference("TTU");

      try {
        console.log("🔄 Initializing Paystack payment...");
        // Initialize Paystack payment
        const paymentData = await paystackService.initializePayment(
          user.email,
          request.amount,
          reference,
          `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/callback`,
        );

        console.log("✅ Paystack payment initialized:", paymentData);

        return res.json({
          success: true,
          message: "Payment initialized successfully",
          authorization_url: paymentData.data.authorization_url,
          data: {
            authorization_url: paymentData.data.authorization_url,
            access_code: paymentData.data.access_code,
            reference: paymentData.data.reference,
            amount: request.amount,
          },
        });
      } catch (error) {
        console.error("Paystack initialization error:", error);

        // Fallback to mock payment for development
        if (process.env.NODE_ENV === "development") {
          return res.json({
            success: true,
            message: "Mock payment initialized for development",
            data: {
              authorization_url: `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/mock?reference=${reference}`,
              access_code: "mock_access_code",
              reference: reference,
              amount: mockRequest.amount,
            },
          });
        }

        return res.status(400).json({
          success: false,
          message: "Payment initialization failed",
          error: error.message,
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
    });
  } catch (error) {
    console.error("Initialize Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify payment
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    console.log("💳 VERIFY PAYMENT - Headers:", req.headers);
    console.log("💳 VERIFY PAYMENT - Body:", req.body);

    // For Paystack callback, we might only have reference, not requestId
    const referenceOnly = z.object({
      reference: z.string().min(1, "Payment reference is required"),
    });

    const validation = referenceOnly.safeParse(req.body);
    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validation.error.errors,
      });
    }

    const { reference } = validation.data;
    console.log("🔍 Verifying payment reference:", reference);

    try {
      // Verify payment with Paystack
      console.log("🔄 Calling Paystack verification...");
      const verificationResult = await paystackService.verifyPayment(reference);

      console.log("📊 Paystack verification result:", verificationResult);

      if (
        verificationResult.status &&
        verificationResult.data.status === "success"
      ) {
        console.log("✅ Payment verified successfully");

        // Find the request associated with this payment reference
        // The reference should contain the request info or we can find it by amount/customer
        const userId = req.headers["x-user-id"] as string;
        let requestToUpdate = null;

        if (userId) {
          console.log("🔍 Looking for user requests to update payment status");
          const userRequests = await db.getRequestsByUserId(userId);

          // Find unpaid request with matching amount
          const amountInGHS = verificationResult.data.amount / 100;
          requestToUpdate = userRequests.find(
            (req) => !req.isPaid && req.amount === amountInGHS,
          );

          if (requestToUpdate) {
            console.log("📝 Found request to update:", requestToUpdate.id);

            // Update request as paid
            await db.updateRequest(requestToUpdate.id, {
              isPaid: true,
              paymentMethod: "paystack",
              paymentReference: reference,
              status: "processing", // Move to processing after payment
            });

            console.log("✅ Request updated successfully");
          } else {
            console.log("⚠️ No matching request found for payment");
          }
        }

        return res.json({
          success: true,
          message: "Payment verified successfully",
          reference: reference,
          amount: verificationResult.data.amount / 100, // Convert from pesewas to GHS
          status: "success",
          paidAt: verificationResult.data.paid_at,
          customerEmail: verificationResult.data.customer.email,
          requestId: requestToUpdate?.id,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
          data: verificationResult.data,
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get payment status
export const getPaymentStatus: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    try {
      let verificationResult;

      if (
        process.env.NODE_ENV === "development" ||
        reference.includes("mock")
      ) {
        verificationResult = await paystackService.mockPaymentForDevelopment(
          reference,
          50,
        );
      } else {
        verificationResult = await paystackService.verifyPayment(reference);
      }

      return res.json({
        success: true,
        data: {
          reference,
          status: verificationResult.data.status,
          amount: verificationResult.data.amount / 100,
          gateway_response: verificationResult.data.gateway_response,
          paid_at: verificationResult.data.paid_at,
        },
      });
    } catch (error) {
      console.error("Get payment status error:", error);
      return res.status(404).json({
        success: false,
        message: "Payment not found or verification failed",
      });
    }
  } catch (error) {
    console.error("Get Payment Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Refund payment (admin only)
export const refundPayment: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;
    const { reason } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    try {
      const refundResult = await paystackService.refundPayment(reference);

      return res.json({
        success: true,
        message: "Refund processed successfully",
        data: refundResult.data,
      });
    } catch (error) {
      console.error("Refund error:", error);
      return res.status(400).json({
        success: false,
        message: "Refund failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Refund Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
