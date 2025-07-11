import { RequestHandler } from "express";
import { db } from "../db/database";

// Get all users with pending Ghana Card verifications
export const getPendingGhanaCardVerifications: RequestHandler = async (
  req,
  res,
) => {
  try {
    // In a real implementation, you'd verify admin authentication here

    // Get users with pending Ghana Card verifications
    const pendingUsers = await db.getPendingGhanaCardVerifications();

    const formattedUsers = pendingUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      studentId: user.studentId,
      isVerified: user.isVerified,
      ghanaCard: user.ghanaCard,
      createdAt: user.createdAt.toISOString(),
    }));

    res.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Get Pending Ghana Card Verifications Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all users for admin management
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    // In a real implementation, you'd verify admin authentication here

    const allUsers = Array.from((db as any).users.values());

    const formattedUsers = allUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      studentId: user.studentId,
      isVerified: user.isVerified,
      ghanaCard: user.ghanaCard,
      createdAt: user.createdAt.toISOString(),
    }));

    res.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get dashboard stats for admin
export const getAdminStats: RequestHandler = async (req, res) => {
  try {
    const allUsers = Array.from((db as any).users.values());
    const allRequests = Array.from((db as any).requests.values());

    const stats = {
      totalUsers: allUsers.length,
      totalStudents: allUsers.filter((user) => user.role === "student").length,
      totalAdmins: allUsers.filter((user) => user.role === "admin").length,
      pendingVerifications: allUsers.filter(
        (user) =>
          user.ghanaCard && user.ghanaCard.imageUrl && !user.ghanaCard.verified,
      ).length,
      totalRequests: allRequests.length,
      pendingRequests: allRequests.filter((req) => req.status === "pending")
        .length,
      processingRequests: allRequests.filter(
        (req) => req.status === "processing",
      ).length,
      completedRequests: allRequests.filter((req) => req.status === "completed")
        .length,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
