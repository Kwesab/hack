import { RequestHandler } from "express";
import { db } from "../db/database";

// Debug endpoint to see all users and their Ghana Card status
export const debugUsers: RequestHandler = async (req, res) => {
  try {
    const allUsers = await db.getAllUsers();
    const pendingVerifications = await db.getPendingGhanaCardVerifications();

    const userDebugInfo = allUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasGhanaCard: !!user.ghanaCard,
      ghanaCardVerified: user.ghanaCard?.verified || false,
      ghanaCardNumber: user.ghanaCard?.number || null,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalUsers: allUsers.length,
        usersWithGhanaCard: allUsers.filter((u) => u.ghanaCard).length,
        pendingVerifications: pendingVerifications.length,
        allUsers: userDebugInfo,
        pendingVerificationUsers: pendingVerifications.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          ghanaCard: user.ghanaCard,
        })),
      },
    });
  } catch (error) {
    console.error("Debug Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Debug endpoint to check specific user
export const debugUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        userId,
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasGhanaCard: !!user.ghanaCard,
        ghanaCard: user.ghanaCard,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Debug User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
