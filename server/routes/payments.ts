import { RequestHandler } from "express";
import { z } from "zod";
import { paystackService } from "../services/paystack";
import { db } from "../db/database";

// Validation schemas
const initializePaymentSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  paymentMethod: z.enum(["paystack", "cash_on_delivery"]),
});

const verifyPaymentSchema = z.object({
  reference: z.string().min(1, "Payment reference is required"),
  requestId: z.string().min(1, "Request ID is required"),
});

// Initialize payment
export const initializePayment: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const validation = initializePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validation.error.errors,
      });
    }

    const { requestId, paymentMethod } = validation.data;

    // Get user and request details
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // For now, we'll simulate getting the request from our system
    // In the real implementation, you'd fetch from your database
    const mockRequest = {
      id: requestId,
      userId,
      type: "transcript",
      amount: 50,
      status: "pending",
    };

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
        // Initialize Paystack payment
        const paymentData = await paystackService.initializePayment(
          user.email,
          mockRequest.amount,
          reference,
          `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/callback`,
        );

        return res.json({
          success: true,
          message: "Payment initialized successfully",
          data: {
            authorization_url: paymentData.data.authorization_url,
            access_code: paymentData.data.access_code,
            reference: paymentData.data.reference,
            amount: mockRequest.amount,
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
    const validation = verifyPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: validation.error.errors,
      });
    }

    const { reference, requestId } = validation.data;

    try {
      // Verify payment with Paystack
      let verificationResult;

      if (
        process.env.NODE_ENV === "development" ||
        reference.includes("mock")
      ) {
        // Use mock verification for development
        verificationResult = await paystackService.mockPaymentForDevelopment(
          reference,
          50,
        );
      } else {
        verificationResult = await paystackService.verifyPayment(reference);
      }

      if (
        verificationResult.status &&
        verificationResult.data.status === "success"
      ) {
        // Payment successful - update request status
        // In real implementation, update your database here

        return res.json({
          success: true,
          message: "Payment verified successfully",
          data: {
            reference,
            amount: verificationResult.data.amount / 100, // Convert from kobo/pesewas
            status: "success",
            paidAt: verificationResult.data.paid_at,
            gateway_response: verificationResult.data.gateway_response,
          },
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
