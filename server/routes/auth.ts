import { RequestHandler } from "express";
import { z } from "zod";
import { smsService } from "../services/sms";
import { db } from "../models";

// Validation schemas
const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9+\-\s()]*$/, "Phone number contains invalid characters"),
});

const verifyOTPSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const loginSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Send OTP
export const sendOTP: RequestHandler = async (req, res) => {
  try {
    console.log("Send OTP request body:", req.body);

    const validation = phoneSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation error:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
        errors: validation.error.errors,
      });
    }

    const { phone } = validation.data;
    console.log("Validated phone:", phone);

    // Send OTP via SMS
    const result = await smsService.sendOTP(phone);
    console.log("SMS service result:", result);

    if (result.success && result.otp) {
      // Store OTP session
      db.createOTPSession(phone, result.otp);

      res.json({
        success: true,
        message: "OTP sent successfully",
        // Don't send OTP in production for security
        ...(process.env.NODE_ENV === "development" && { otp: result.otp }),
      });
    } else {
      console.log("SMS service failed:", result);
      res.status(400).json({
        success: false,
        message: result.message || "Failed to send OTP",
      });
    }
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify OTP
export const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const { phone, otp } = verifyOTPSchema.parse(req.body);

    const isValid = db.verifyOTP(phone, otp);

    if (isValid) {
      // Check if user exists
      let user = db.getUserByPhone(phone);

      if (!user) {
        // Create new user if doesn't exist
        user = db.createUser({
          phone,
          name: "New User", // Will be updated later
          isVerified: true,
        });
      } else {
        // Mark existing user as verified
        db.updateUser(user.id, { isVerified: true });
      }

      // Clear OTP session
      db.clearOTPSession(phone);

      res.json({
        success: true,
        message: "OTP verified successfully",
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
          ghanaCard: user.ghanaCard,
        },
        requiresPassword: !user.name || user.name === "New User",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Complete registration (set password and name)
export const completeRegistration: RequestHandler = async (req, res) => {
  try {
    console.log("Complete registration request:", req.body);

    const { phone, password, name, email, studentId } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const user = db.getUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please verify your phone number first.",
      });
    }

    console.log(`Completing registration for user ${user.id}`);

    // In production, hash the password
    const updatedUser = db.updateUser(user.id, {
      name: name || "TTU Student",
      email: email || "",
      studentId: studentId || "",
      // Store hashed password in production
      password,
    });

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }

    console.log("Registration completed successfully");

    res.json({
      success: true,
      message: "Registration completed successfully",
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        isVerified: updatedUser.isVerified,
        ghanaCard: updatedUser.ghanaCard,
      },
    });
  } catch (error) {
    console.error("Complete Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login with password
export const login: RequestHandler = async (req, res) => {
  try {
    console.log("Login attempt with:", req.body);

    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Login validation error:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid request format",
        errors: validation.error.errors,
      });
    }

    const { phone, password } = validation.data;
    console.log(`Login attempt for phone: ${phone}`);

    const user = db.getUserByPhone(phone);

    if (!user) {
      console.log(`User not found for phone: ${phone}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log(`User found:`, {
      id: user.id,
      name: user.name,
      hasPassword: !!(user as any).password,
    });

    // Check if user has a password set
    if (!(user as any).password) {
      console.log(
        "User has no password set - they need to complete registration",
      );
      return res.status(400).json({
        success: false,
        message: "Please complete your registration first",
        requiresRegistration: true,
      });
    }

    // In production, compare with hashed password
    if ((user as any).password !== password) {
      console.log("Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("Login successful");
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        isVerified: user.isVerified,
        ghanaCard: user.ghanaCard,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get current user
export const getCurrentUser: RequestHandler = async (req, res) => {
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
        phone: user.phone,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        isVerified: user.isVerified,
        ghanaCard: user.ghanaCard,
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
