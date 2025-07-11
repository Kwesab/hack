import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../db/database";
import { smsService } from "../services/sms";

// Validation schemas
const createRequestSchema = z.object({
  type: z.enum(["transcript", "certificate", "attestation"]),
  subType: z.string().optional(),
  deliveryMethod: z.enum(["digital", "courier", "cash_on_delivery"]),
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
    console.log("📝 CREATE REQUEST - Headers:", req.headers);
    console.log("📝 CREATE REQUEST - Body:", req.body);

    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      console.log("❌ No userId provided");
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    console.log("🔍 Looking for user with ID:", userId);
    const user = await db.getUserById(userId);
    if (!user) {
      console.log("❌ User not found for ID:", userId);
      console.log(
        "💡 This usually means the user session is stale. User should log in again.",
      );
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        code: "SESSION_EXPIRED",
      });
    }

    console.log("✅ User found:", user.id, user.name);
    console.log("🔍 Validating request data:", req.body);

    try {
      const requestData = createRequestSchema.parse(req.body);
      console.log("✅ Validation successful:", requestData);
    } catch (validationError) {
      console.error("❌ Validation failed:", validationError);
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: validationError.message,
      });
    }

    const requestData = createRequestSchema.parse(req.body);

    // Calculate amount based on document type
    const amounts = {
      transcript: 50,
      certificate: 30,
      attestation: 20,
    };

    const request = await db.createRequest({
      userId,
      userDepartment: user.department,
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
    console.error("❌ CREATE REQUEST ERROR:", error);
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
    const user = await db.getUserById(userId);
    if (!user) {
      console.log(`User not found for id: ${userId}`);
      // Return empty requests array instead of error for missing user
      return res.json({
        success: true,
        requests: [],
        message: "No requests found for this user",
      });
    }

    const requests = await db.getRequestsByUserId(userId);
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

// Get requests by department (for HODs)
export const getDepartmentRequests: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    // Check if user is HOD
    if (user.role !== "hod") {
      return res.status(403).json({
        success: false,
        message: "Access denied. HOD role required.",
      });
    }

    if (!user.department) {
      return res.status(400).json({
        success: false,
        message: "Department not assigned to HOD",
      });
    }

    // Get all requests for the HOD's department
    const departmentRequests = await db.getRequestsByDepartment(
      user.department,
    );

    // Enrich requests with user information
    const enrichedRequests = await Promise.all(
      departmentRequests.map(async (request) => {
        const requestUser = await db.getUserById(request.userId);
        return {
          ...request,
          userName: requestUser?.name,
          userEmail: requestUser?.email,
          userPhone: requestUser?.phone,
        };
      }),
    );

    res.json({
      success: true,
      requests: enrichedRequests,
      department: user.department,
    });
  } catch (error) {
    console.error("❌ GET DEPARTMENT REQUESTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all requests (admin only)
export const getAllRequests: RequestHandler = async (req, res) => {
  try {
    const requests = await db.getAllRequests();

    // Include user information with each request
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const user = await db.getUserById(request.userId);
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
      }),
    );

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

// Confirm request (HOD only)
export const confirmRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { signature, hodId } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await db.getUserById(userId);
    if (!user || user.role !== "hod") {
      return res.status(403).json({
        success: false,
        message: "Access denied. HOD role required.",
      });
    }

    const request = await db.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Verify request belongs to HOD's department
    if (request.userDepartment !== user.department) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Request not from your department.",
      });
    }

    // Update request with HOD confirmation
    const updatedRequest = await db.updateRequest(requestId, {
      status: "confirmed",
      hodSignature: signature,
      hodId: hodId,
      reviewedAt: new Date(),
    });

    if (!updatedRequest) {
      return res.status(500).json({
        success: false,
        message: "Failed to update request",
      });
    }

    // Get student info for notification
    const student = await db.getUserById(request.userId);

    // Send email notification to student
    if (student) {
      // TODO: Implement email service for confirmed requests
      console.log(
        `✉️ Confirmed request ${requestId} for student ${student.email}`,
      );
    }

    res.json({
      success: true,
      message: "Request confirmed successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("❌ CONFIRM REQUEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reject request (HOD only)
export const rejectRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason, hodId } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await db.getUserById(userId);
    if (!user || user.role !== "hod") {
      return res.status(403).json({
        success: false,
        message: "Access denied. HOD role required.",
      });
    }

    const request = await db.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Verify request belongs to HOD's department
    if (request.userDepartment !== user.department) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Request not from your department.",
      });
    }

    // Update request with rejection
    const updatedRequest = await db.updateRequest(requestId, {
      status: "rejected",
      rejectionReason: rejectionReason,
      hodId: hodId,
      reviewedAt: new Date(),
    });

    if (!updatedRequest) {
      return res.status(500).json({
        success: false,
        message: "Failed to update request",
      });
    }

    // Get student info for notification
    const student = await db.getUserById(request.userId);

    // Send email notification to student about rejection
    if (student) {
      // TODO: Implement email service for rejected requests
      console.log(
        `✉️ Rejected request ${requestId} for student ${student.email} with reason: ${rejectionReason}`,
      );
    }

    res.json({
      success: true,
      message: "Request rejected successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("❌ REJECT REQUEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
