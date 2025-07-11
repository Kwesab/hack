import { RequestHandler } from "express";
import { z } from "zod";
import { paystackService } from "../services/paystack";
import { db } from "../db/database";

// Validation schemas
const initializePaymentSchema = z.object({
  requestId: z.string().min(1, "Request ID is required").optional(),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum([
    "paystack",
    "card",
    "mobile_money",
    "bank_transfer",
    "cash_on_delivery",
  ]),
  email: z.string().email("Valid email is required").optional(),
  callback_url: z.string().url("Valid callback URL is required").optional(),
  metadata: z.object({}).optional(),
});

const verifyPaymentSchema = z.object({
  reference: z.string().min(1, "Payment reference is required"),
  requestId: z.string().min(1, "Request ID is required").optional(),
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

    const { requestId, paymentMethod, amount, email, callback_url, metadata } =
      validation.data;

    // Get user details
    const user = await db.getUserById(userId);
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.id, user.name);

    // If requestId is provided, this is the old flow - get existing request
    let requestAmount = amount;
    if (requestId) {
      const requests = await db.getRequestsByUserId(userId);
      const request = requests.find((req) => req.id === requestId);

      if (!request) {
        console.log("❌ Request not found:", requestId);
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }

      console.log(
        "✅ Request found:",
        request.id,
        request.type,
        request.amount,
      );
      requestAmount = request.amount;
    }

    if (paymentMethod === "cash_on_delivery") {
      return res.json({
        success: true,
        message: "Cash on delivery option selected",
        paymentMethod: "cash_on_delivery",
        requiresPayment: false,
        nextStep:
          "Document will be prepared for delivery. Payment due on delivery.",
      });
    }

    // All other payment methods use Paystack
    if (
      ["paystack", "card", "mobile_money", "bank_transfer"].includes(
        paymentMethod,
      )
    ) {
      const reference = paystackService.generatePaymentReference("TTU");

      // Use provided email or user's email
      const paymentEmail = email || user.email;

      // Use provided callback URL or default
      const callbackUrl =
        callback_url ||
        `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/callback`;

      try {
        console.log("🔄 Initializing Paystack payment...");
        console.log("📧 Email:", paymentEmail);
        console.log("💰 Amount:", requestAmount);
        console.log("🔗 Callback:", callbackUrl);

        const paymentData = await paystackService.initializePayment(
          paymentEmail,
          requestAmount,
          reference,
          callbackUrl,
          metadata,
        );

        console.log("✅ Paystack payment initialized:", paymentData);

        return res.json({
          success: true,
          message: "Payment initialized successfully",
          authorization_url: paymentData.data.authorization_url,
          reference: paymentData.data.reference,
          data: {
            authorization_url: paymentData.data.authorization_url,
            access_code: paymentData.data.access_code,
            reference: paymentData.data.reference,
            amount: requestAmount,
          },
        });
      } catch (error) {
        console.error("Paystack initialization error:", error);

        // Fallback to mock payment for development
        if (process.env.NODE_ENV === "development") {
          return res.json({
            success: true,
            message: "Mock payment initialized for development",
            authorization_url: `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/success?reference=${reference}`,
            reference: reference,
            data: {
              authorization_url: `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/success?reference=${reference}`,
              access_code: "mock_access_code",
              reference: reference,
              amount: requestAmount,
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
    console.error("❌ INITIALIZE PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Verify payment
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    console.log("🔍 VERIFY PAYMENT - Headers:", req.headers);
    console.log("🔍 VERIFY PAYMENT - Body:", req.body);

    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      console.log("❌ No userId provided");
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const validation = verifyPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validation.error.errors,
      });
    }

    const { reference, requestId } = validation.data;

    console.log("🔄 Verifying payment with Paystack...");

    try {
      const verificationResult = await paystackService.verifyPayment(reference);

      console.log("✅ Payment verification result:", verificationResult);

      if (verificationResult.data.status === "success") {
        // Payment successful
        if (requestId) {
          // Update existing request if requestId provided
          await db.updateRequest(requestId, {
            isPaid: true,
            paymentReference: reference,
            paymentMethod: "paystack",
            status: "processing",
          });
        }

        return res.json({
          success: true,
          message: "Payment verified successfully",
          payment_verified: true,
          amount: verificationResult.data.amount,
          reference: verificationResult.data.reference,
          status: verificationResult.data.status,
          customer: verificationResult.data.customer,
          metadata: verificationResult.data.metadata,
        });
      } else {
        return res.json({
          success: false,
          message: "Payment verification failed",
          payment_verified: false,
          status: verificationResult.data.status,
        });
      }
    } catch (error) {
      console.error("Paystack verification error:", error);

      // Mock verification for development
      if (process.env.NODE_ENV === "development") {
        console.log("🔧 Using mock verification for development");

        if (requestId) {
          await db.updateRequest(requestId, {
            isPaid: true,
            paymentReference: reference,
            paymentMethod: "paystack",
            status: "processing",
          });
        }

        return res.json({
          success: true,
          message: "Mock payment verification successful",
          payment_verified: true,
          amount: 5000, // Mock amount in kobo
          reference: reference,
          status: "success",
          customer: { email: "mock@example.com" },
          metadata: {},
        });
      }

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("❌ VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
      const verificationResult = await paystackService.verifyPayment(reference);

      return res.json({
        success: true,
        data: verificationResult.data,
      });
    } catch (error) {
      console.error("Payment status check error:", error);

      return res.status(400).json({
        success: false,
        message: "Failed to check payment status",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("❌ GET PAYMENT STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Refund payment
export const refundPayment: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    // Implementation for refunds would go here
    // This would typically involve calling Paystack's refund API

    return res.json({
      success: false,
      message: "Refund functionality not yet implemented",
    });
  } catch (error) {
    console.error("❌ REFUND PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
