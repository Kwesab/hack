interface PaystackInitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
  };
}

class PaystackService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // ⚠️ WARNING: Using LIVE secret key - this will process real payments!
    this.apiKey =
      process.env.PAYSTACK_SECRET_KEY ||
      "sk_live_99e1351b4c69b9ffba5f262e81fa338809d94369";
    this.baseUrl = "https://api.paystack.co";

    // Log warning for live key usage
    if (this.apiKey.startsWith("sk_live_")) {
      console.warn(
        "⚠️ PAYSTACK WARNING: Using LIVE secret key - real payments will be processed!",
      );
    }
  }

  async initializePayment(
    email: string,
    amount: number,
    reference: string,
    callback_url?: string,
  ): Promise<PaystackInitializePaymentResponse> {
    try {
      console.log("🔄 Initializing Paystack payment...");
      console.log("📧 Email:", email);
      console.log("💰 Amount:", amount, "GHS");
      console.log("🔗 Reference:", reference);

      // Convert amount to pesewas (multiply by 100)
      const amountInPesewas = amount * 100;
      console.log("💱 Amount in pesewas:", amountInPesewas);

      const paymentData = {
        email: email,
        amount: amountInPesewas,
        reference: reference,
        callback_url:
          callback_url ||
          `${process.env.FRONTEND_URL || "http://localhost:8080"}/payment/callback`,
        currency: "GHS",
        metadata: {
          document_request: reference,
          service: "TTU DocPortal",
          custom_fields: [
            {
              display_name: "Document Request",
              variable_name: "document_request",
              value: reference,
            },
          ],
        },
        channels: ["card", "mobile_money", "bank_transfer"],
      };

      console.log("📋 Payment payload:", JSON.stringify(paymentData, null, 2));

      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      console.log("📊 Paystack response status:", response.status);

      const responseText = await response.text();
      console.log("📄 Paystack response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse Paystack response:", parseError);
        throw new Error("Invalid response from payment gateway");
      }

      if (!response.ok) {
        console.error("❌ Paystack error:", data);
        throw new Error(data.message || "Payment initialization failed");
      }

      if (!data.status) {
        console.error("❌ Paystack returned error:", data.message);
        throw new Error(data.message || "Payment initialization failed");
      }

      console.log(
        "✅ Payment initialized successfully:",
        data.data.authorization_url,
      );
      return data;
    } catch (error) {
      console.error("❌ Paystack initialize payment error:", error);
      throw error;
    }
  }

  async verifyPayment(
    reference: string,
  ): Promise<PaystackVerifyPaymentResponse> {
    try {
      console.log("🔍 Verifying payment with reference:", reference);

      const response = await fetch(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("📊 Verification response status:", response.status);

      const responseText = await response.text();
      console.log("📄 Verification response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse verification response:", parseError);
        throw new Error("Invalid response from payment gateway");
      }

      if (!response.ok) {
        console.error("❌ Verification failed:", data);
        throw new Error(data.message || "Payment verification failed");
      }

      if (!data.status) {
        console.error("❌ Payment verification returned false:", data.message);
        throw new Error(data.message || "Payment verification failed");
      }

      console.log("✅ Payment verified successfully:", data.data.status);
      console.log("💰 Amount paid:", data.data.amount / 100, "GHS");
      console.log("📧 Customer:", data.data.customer.email);

      return data;
    } catch (error) {
      console.error("❌ Paystack verify payment error:", error);
      throw error;
    }
  }

  async refundPayment(reference: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/refund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: reference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment refund failed");
      }

      return data;
    } catch (error) {
      console.error("Paystack refund payment error:", error);
      throw error;
    }
  }

  generatePaymentReference(prefix: string = "TTU"): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  // Mock payment for development/testing
  async mockPaymentForDevelopment(
    reference: string,
    amount: number,
  ): Promise<PaystackVerifyPaymentResponse> {
    // Simulate successful payment verification
    return {
      status: true,
      message: "Verification successful",
      data: {
        id: Math.floor(Math.random() * 1000000),
        status: "success",
        reference,
        amount: amount * 100,
        gateway_response: "Successful",
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        channel: "card",
        currency: "GHS",
        customer: {
          id: Math.floor(Math.random() * 1000000),
          email: "test@example.com",
          customer_code: `CUS_${Math.random().toString(36).substr(2, 9)}`,
        },
      },
    };
  }
}

export const paystackService = new PaystackService();
