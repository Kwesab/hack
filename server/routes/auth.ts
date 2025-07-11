import { RequestHandler } from "express";
import { z } from "zod";
import { smsService } from "../services/sms";
import { db } from "../db/database";

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

const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Verify credentials (email/password)
export const verifyCredentials: RequestHandler = async (req, res) => {
  try {
    console.log("Verify credentials request:", req.body);

    const validation = credentialsSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation error:", validation.error);
      return res.status(400).json({
        success: false,
        message: "Invalid email or password format",
        errors: validation.error.errors,
      });
    }

    const { email, password } = validation.data;
    console.log("Verifying credentials for:", email);

    // Find user by email
    const user = await db.getUserByEmail(email);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password (in production, compare hashed passwords)
    if (user.password !== password) {
      console.log("Password mismatch for user:", user.id);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Credentials verified successfully for user:", user.id);

    res.json({
      success: true,
      message: "Credentials verified successfully",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        isVerified: user.isVerified,
        ghanaCard: user.ghanaCard,
      },
    });
  } catch (error) {
    console.error("Verify Credentials Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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

    const isValid = await db.verifyOTP(phone, otp);

    if (isValid) {
      // Check if user exists
      let user = await db.getUserByPhone(phone);

      if (!user) {
        // Create new user if doesn't exist
        user = await db.createUser({
          phone,
          name: "New User", // Will be updated later
          isVerified: true,
        });
      } else {
        // Mark existing user as verified
        await db.updateUser(user.id, { isVerified: true });
      }

      // Clear OTP session
      await db.clearOTPSession(phone);

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

// Login with password (also handles setting password for new users)
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

    // If user has no password set, set it now (new user completing registration)
    if (!(user as any).password) {
      console.log("User has no password set - setting password now");

      const updatedUser = db.updateUser(user.id, {
        password,
        name: user.name === "New User" ? "TTU Student" : user.name,
      });

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Failed to complete registration",
        });
      }

      console.log("Password set successfully - new user registration complete");

      return res.json({
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
    }

    // User has password set - verify it
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
