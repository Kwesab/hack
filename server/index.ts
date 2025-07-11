import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  sendOTP,
  verifyOTP,
  completeRegistration,
  login,
  getCurrentUser,
  verifyCredentials,
} from "./routes/auth";
import {
  emailLogin,
  verifyLoginOTP,
  getCurrentAuthUser,
} from "./routes/newAuth";
import {
  getPendingGhanaCardVerifications,
  getAllUsers,
  getAdminStats,
} from "./routes/admin";
import {
  initializePayment,
  verifyPayment,
  getPaymentStatus,
  refundPayment,
} from "./routes/payments";
import {
  generateAndDownloadDocument,
  previewDocument,
  getDocumentInfo,
  adminGenerateDocument,
  getDocumentTypes,
} from "./routes/documentGeneration";
import { debugUsers, debugUser } from "./routes/debug";
import {
  createRequest,
  getUserRequests,
  getRequest,
  updateRequestStatus,
  processPayment,
  getAllRequests,
  getDepartmentRequests,
  confirmRequest,
  rejectRequest,
} from "./routes/documents";
import {
  uploadGhanaCard,
  uploadDocuments,
  getFile,
  verifyGhanaCard,
} from "./routes/upload";
import {
  generateDocument,
  generatePDF,
  previewDocument,
  getDocumentInfo,
} from "./routes/generate";
import { testPhoneValidation, testOTPGeneration } from "./routes/test";

import { db } from "./db/database";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increase limit for file uploads
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request debugging middleware
  app.use((req, res, next) => {
    console.log(
      `📊 ${req.method} ${req.path} - Headers:`,
      req.headers["x-user-id"]
        ? "userId: " + req.headers["x-user-id"]
        : "no userId",
    );
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "TTU DocPortal API v1.0" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/verify-credentials", verifyCredentials);
  app.post("/api/auth/send-otp", sendOTP);
  app.post("/api/auth/verify-otp", verifyOTP);
  app.post("/api/auth/complete-registration", completeRegistration);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", getCurrentUser);

  // New email/password + OTP auth routes
  app.post("/api/auth/email-login", emailLogin);
  app.post("/api/auth/verify-login-otp", verifyLoginOTP);
  app.get("/api/auth/current-user", getCurrentAuthUser);

  // Document request routes
  app.post("/api/requests", createRequest);
  app.get("/api/requests", getUserRequests);

  // Test endpoint
  app.get("/api/test-requests", (req, res) => {
    console.log("📍 Test endpoint hit");
    res.json({
      message: "Test endpoint working",
      timestamp: new Date().toISOString(),
    });
  });
  app.get("/api/requests/:id", getRequest);
  app.put("/api/requests/:id/status", updateRequestStatus);
  app.post("/api/requests/:id/payment", processPayment);

  // Admin routes
  app.get("/api/admin/requests", getAllRequests);
  app.get("/api/admin/pending-verifications", getPendingGhanaCardVerifications);
  app.get("/api/admin/users", getAllUsers);
  app.get("/api/admin/stats", getAdminStats);

  // HOD routes
  app.get("/api/requests/department", getDepartmentRequests);
  app.post("/api/requests/:requestId/confirm", confirmRequest);
  app.post("/api/requests/:requestId/reject", rejectRequest);
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const requestUserId = req.headers["x-user-id"] as string;

      // Only allow users to get their own info or admins/HODs to get any user info
      if (userId !== requestUserId) {
        const requestingUser = await db.getUserById(requestUserId);
        if (
          !requestingUser ||
          !["admin", "hod"].includes(requestingUser.role)
        ) {
          return res.status(403).json({
            success: false,
            message: "Access denied",
          });
        }
      }

      const user = await db.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          studentId: user.studentId,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Upload routes
  app.post("/api/upload/ghana-card", uploadGhanaCard);
  app.post("/api/upload/documents/:requestId", uploadDocuments);
  app.get("/api/files/:fileName", getFile);
  app.put("/api/admin/verify-ghana-card/:userId", verifyGhanaCard);

  // Payment routes
  app.post("/api/payments/initialize", initializePayment);
  app.post("/api/payments/verify", verifyPayment);
  app.get("/api/payments/status/:reference", getPaymentStatus);
  app.post("/api/payments/refund/:reference", refundPayment);

  // Document generation and download routes
  app.get("/api/documents/download/:requestId", generateAndDownloadDocument);
  app.get("/api/documents/preview/:requestId", previewDocument);
  app.get("/api/documents/info/:requestId", getDocumentInfo);
  app.get("/api/documents/types", getDocumentTypes);
  app.get("/api/admin/generate/:requestId", adminGenerateDocument);

  // Legacy document generation routes (keeping for compatibility)
  app.get("/api/generate/document/:requestId", generateDocument);
  app.get("/api/generate/pdf/:requestId", generatePDF);
  app.get("/api/generate/info/:requestId", getDocumentInfo);

  // Test routes for debugging
  app.post("/api/test/phone", testPhoneValidation);
  app.post("/api/test/otp", testOTPGeneration);

  // Debug routes
  app.get("/api/debug/users", debugUsers);
  app.get("/api/debug/user/:userId", debugUser);

  return app;
}
