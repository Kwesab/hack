import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  sendOTP,
  verifyOTP,
  completeRegistration,
  login,
  getCurrentUser,
} from "./routes/auth";
import {
  createRequest,
  getUserRequests,
  getRequest,
  updateRequestStatus,
  processPayment,
  getAllRequests,
} from "./routes/documents";
import {
  uploadGhanaCard,
  uploadDocuments,
  getFile,
  verifyGhanaCard,
} from "./routes/upload";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increase limit for file uploads
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "TTU DocPortal API v1.0" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/send-otp", sendOTP);
  app.post("/api/auth/verify-otp", verifyOTP);
  app.post("/api/auth/complete-registration", completeRegistration);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", getCurrentUser);

  // Document request routes
  app.post("/api/requests", createRequest);
  app.get("/api/requests", getUserRequests);
  app.get("/api/requests/:id", getRequest);
  app.put("/api/requests/:id/status", updateRequestStatus);
  app.post("/api/requests/:id/payment", processPayment);

  // Admin routes
  app.get("/api/admin/requests", getAllRequests);

  // Upload routes
  app.post("/api/upload/ghana-card", uploadGhanaCard);
  app.post("/api/upload/documents/:requestId", uploadDocuments);
  app.get("/api/files/:fileName", getFile);
  app.put("/api/admin/verify-ghana-card/:userId", verifyGhanaCard);

  return app;
}
