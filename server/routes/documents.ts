import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../db/database";
import { smsService } from "../services/sms";

// Validation schemas
const createRequestSchema = z.object({
  type: z.enum(["transcript", "certificate", "attestation"]),
  subType: z.string().optional(),
  deliveryMethod: z.enum(["digital", "physical", "both"]),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

const updateRequestSchema = z.object({
  status: z
    .enum(["pending", "processing", "ready", "completed", "rejected"])
    .optional(),
  adminNotes: z.string().optional(),
});

// Create new document request
export const createRequest: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const requestData = createRequestSchema.parse(req.body);

    // Calculate amount based on document type
    const amounts = {
      transcript: 50,
      certificate: 30,
      attestation: 20,
    };

    const request = db.createRequest({
      userId,
      type: requestData.type,
      subType: requestData.subType || "",
      deliveryMethod: requestData.deliveryMethod,
      deliveryAddress: requestData.deliveryAddress,
      notes: requestData.notes,
      status: "pending",
      amount: amounts[requestData.type],
      isPaid: false,
      documents: [],
    });

    // Send SMS notification
    await smsService.sendDocumentStatusUpdate(
      user.phone,
      requestData.type,
      "pending",
      request.id,
    );

    res.json({
      success: true,
      message: "Document request created successfully",
      request,
    });
  } catch (error) {
    console.error("Create Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's requests
export const getUserRequests: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    console.log("Getting requests for userId:", userId);

    if (!userId) {
      console.log("No userId provided");
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Check if user exists
    const user = db.getUserById(userId);
    if (!user) {
      console.log(`User not found for id: ${userId}`);
      // Return empty requests array instead of error for missing user
      return res.json({
        success: true,
        requests: [],
        message: "No requests found for this user",
      });
    }

    const requests = db.getRequestsByUserId(userId);
    console.log(`Found ${requests.length} requests for user ${userId}`);

    res.json({
      success: true,
      requests: requests || [],
    });
  } catch (error) {
    console.error("Get User Requests Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get specific request
export const getRequest: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const requestId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const request = db.getRequestById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if user owns this request or is admin
    if (request.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update request status (admin only)
export const updateRequestStatus: RequestHandler = async (req, res) => {
  try {
    const requestId = req.params.id;
    const updates = updateRequestSchema.parse(req.body);

    const request = db.updateRequest(requestId, updates);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Get user to send SMS notification
    const user = db.getUserById(request.userId);
    if (user && updates.status) {
      await smsService.sendDocumentStatusUpdate(
        user.phone,
        request.type,
        updates.status,
        request.id,
      );
    }

    res.json({
      success: true,
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    console.error("Update Request Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Simulate payment
export const processPayment: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const requestId = req.params.id;
    const { paymentMethod } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const request = db.getRequestById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (request.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Request already paid",
      });
    }

    // Simulate payment processing
    const updatedRequest = db.updateRequest(requestId, {
      isPaid: true,
      paymentMethod,
      status: "processing",
    });

    // Get user and send payment confirmation SMS
    const user = db.getUserById(userId);
    if (user) {
      await smsService.sendPaymentConfirmation(
        user.phone,
        request.amount,
        request.type,
        request.id,
      );
    }

    res.json({
      success: true,
      message: "Payment processed successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Process Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all requests (admin only)
export const getAllRequests: RequestHandler = async (req, res) => {
  try {
    const requests = db.getAllRequests();

    // Include user information with each request
    const requestsWithUsers = requests.map((request) => {
      const user = db.getUserById(request.userId);
      return {
        ...request,
        user: user
          ? {
              name: user.name,
              phone: user.phone,
              email: user.email,
              studentId: user.studentId,
            }
          : null,
      };
    });

    res.json({
      success: true,
      requests: requestsWithUsers,
    });
  } catch (error) {
    console.error("Get All Requests Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
