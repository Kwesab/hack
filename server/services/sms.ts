interface SMSResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface SendSMSParams {
  to: string;
  message: string;
}

class SMSService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey =
      process.env.SMS_API_KEY || "ea37f9e4-c06a-4eed-878a-8615178ff888";
    this.baseUrl = "https://app.smsnotifygh.com/api";
  }

  async sendSMS({ to, message }: SendSMSParams): Promise<SMSResponse> {
    try {
      // Format phone number - ensure it starts with 233 for Ghana
      const formattedPhone = this.formatPhoneNumber(to);

      console.log(`Attempting to send SMS to ${formattedPhone}`);
      console.log(`SMS message: ${message}`);

      // In development mode, simulate success
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Simulating SMS success");
        return {
          success: true,
          message: "SMS sent successfully (development mode)",
          data: { messageId: `dev_${Date.now()}` },
        };
      }

      const response = await fetch(`${this.baseUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          recipient: formattedPhone,
          message: message,
          sender: "TTU Portal",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "SMS sent successfully",
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to send SMS",
        };
      }
    } catch (error) {
      console.error("SMS Service Error:", error);

      // In development mode, fallback to success
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: SMS API failed, but returning success");
        return {
          success: true,
          message: "SMS sent successfully (fallback mode)",
          data: { messageId: `fallback_${Date.now()}` },
        };
      }

      return {
        success: false,
        message: "Network error sending SMS",
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any spaces, dashes, or other characters
    let cleaned = phone.replace(/[^\d]/g, "");

    // If it starts with 0, replace with 233
    if (cleaned.startsWith("0")) {
      cleaned = "233" + cleaned.substring(1);
    }

    // If it doesn't start with 233, add it
    if (!cleaned.startsWith("233")) {
      cleaned = "233" + cleaned;
    }

    return cleaned;
  }

  async sendOTP(
    phone: string,
  ): Promise<{ success: boolean; otp?: string; message: string }> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const message = `Your TTU DocPortal verification code is: ${otp}. This code expires in 10 minutes. Do not share this code with anyone.`;

    console.log(`Attempting to send OTP ${otp} to ${phone}`);

    const result = await this.sendSMS({ to: phone, message });

    if (result.success) {
      console.log(`SMS sent successfully to ${phone}`);
      return {
        success: true,
        otp: otp,
        message: "OTP sent successfully",
      };
    } else {
      console.log(`SMS failed to ${phone}, error: ${result.message}`);
      // In development, still return success with OTP for testing
      if (process.env.NODE_ENV === "development") {
        console.log(`Development mode: returning OTP ${otp} anyway`);
        return {
          success: true,
          otp: otp,
          message: "OTP generated (SMS service unavailable in dev mode)",
        };
      }

      return {
        success: false,
        message: result.message,
      };
    }
  }

  async sendDocumentStatusUpdate(
    phone: string,
    documentType: string,
    status: string,
    requestId: string,
  ): Promise<SMSResponse> {
    const statusMessages = {
      pending: `Your ${documentType} request (#${requestId}) has been received and is being processed.`,
      processing: `Your ${documentType} request (#${requestId}) is currently being processed by our team.`,
      ready: `Good news! Your ${documentType} request (#${requestId}) is ready for collection/delivery.`,
      completed: `Your ${documentType} request (#${requestId}) has been completed and delivered.`,
      rejected: `Your ${documentType} request (#${requestId}) requires additional information. Please check your dashboard.`,
    };

    const message =
      statusMessages[status as keyof typeof statusMessages] ||
      `Your document request (#${requestId}) status has been updated to: ${status}`;

    return await this.sendSMS({
      to: phone,
      message: `TTU DocPortal: ${message}`,
    });
  }

  async sendPaymentConfirmation(
    phone: string,
    amount: number,
    documentType: string,
    requestId: string,
  ): Promise<SMSResponse> {
    const message = `Payment of GHS ${amount} confirmed for your ${documentType} request (#${requestId}). Processing will begin shortly.`;

    return await this.sendSMS({
      to: phone,
      message: `TTU DocPortal: ${message}`,
    });
  }
}

export const smsService = new SMSService();
