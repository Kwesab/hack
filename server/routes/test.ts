import { RequestHandler } from "express";

// Test endpoint to debug phone validation
export const testPhoneValidation: RequestHandler = async (req, res) => {
  try {
    console.log("Test endpoint called with:", req.body);

    res.json({
      success: true,
      message: "Test endpoint working",
      receivedData: req.body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Test endpoint failed",
      error: error.message,
    });
  }
};

// Test OTP generation without SMS
export const testOTPGeneration: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.body;

    // Generate test OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`Generated test OTP ${otp} for phone ${phone}`);

    res.json({
      success: true,
      message: "Test OTP generated",
      otp: otp,
      phone: phone,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test OTP generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate test OTP",
      error: error.message,
    });
  }
};
