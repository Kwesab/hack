import { RequestHandler } from "express";
import { z } from "zod";
import { smsService } from "../services/sms";
import { db } from "../models";

// Validation schemas
const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Step 1: Email/Password Login
export const emailLogin: RequestHandler = async (req, res) => {
  try {
    console.log("Email login request:", req.body);

    const validation = emailLoginSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation error:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password format",
        errors: validation.error.errors,
      });
    }

    const { email, password } = validation.data;
    console.log(`Login attempt for email: ${email}`);

    // Find user by email
    const user = db.getUserByEmail(email);

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    if (user.password !== password) {
      console.log("Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log(
      `Password verified for user ${user.id}, sending OTP to ${user.phone}`,
    );

    // Send OTP to user's phone
    const otpResult = await smsService.sendOTP(user.phone);

    if (otpResult.success && otpResult.otp) {
      // Store OTP session
      db.createOTPSession(user.phone, otpResult.otp);

      res.json({
        success: true,
        message: "Password verified. OTP sent to your phone.",
        data: {
          phone: user.phone,
          maskedPhone: `***-***-${user.phone.slice(-4)}`,
        },
        // Don't send OTP in production for security
        ...(process.env.NODE_ENV === "development" && { otp: otpResult.otp }),
      });
    } else {
      console.log("OTP sending failed:", otpResult);
      res.status(400).json({
        success: false,
        message: otpResult.message || "Failed to send OTP",
      });
    }
  } catch (error) {
    console.error("Email Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Step 2: Verify OTP
export const verifyLoginOTP: RequestHandler = async (req, res) => {
  try {
    console.log("Verify OTP request:", req.body);

    const validation = verifyOTPSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request format",
        errors: validation.error.errors,
      });
    }

    const { email, otp } = validation.data;

    // Find user by email
    const user = db.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP
    const isValidOTP = db.verifyOTP(user.phone, otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Clear OTP session
    db.clearOTPSession(user.phone);

    // Mark user as verified
    db.updateUser(user.id, { isVerified: true });

    console.log(`OTP verified for user ${user.id}`);

    // Check Ghana card status
    const hasGhanaCard = user.ghanaCard && user.ghanaCard.verified;

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        isVerified: user.isVerified,
        hasGhanaCard,
        ghanaCardVerified: user.ghanaCard?.verified || false,
      },
      nextStep: determineNextStep(user),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper function to determine next step in the flow
function determineNextStep(user: any) {
  // If admin, go to admin dashboard
  if (user.role === "admin") {
    return {
      route: "/admin",
      message: "Redirecting to admin dashboard",
    };
  }

  // If student without Ghana card, go to upload page
  if (
    user.role === "student" &&
    (!user.ghanaCard || !user.ghanaCard.verified)
  ) {
    return {
      route: "/upload-ghana-card",
      message: "Please upload your Ghana card to continue",
    };
  }

  // If student with verified Ghana card, go to dashboard
  if (user.role === "student" && user.ghanaCard && user.ghanaCard.verified) {
    return {
      route: "/dashboard",
      message: "Welcome to your dashboard",
    };
  }

  // Default fallback
  return {
    route: "/dashboard",
    message: "Welcome",
  };
}

// Get current authenticated user
export const getCurrentAuthUser: RequestHandler = async (req, res) => {
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

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        isVerified: user.isVerified,
        hasGhanaCard: user.ghanaCard && user.ghanaCard.verified,
        ghanaCardVerified: user.ghanaCard?.verified || false,
      },
    });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
