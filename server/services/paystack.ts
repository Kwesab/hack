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
    // Use test key for development
    this.apiKey =
      process.env.PAYSTACK_SECRET_KEY || "sk_test_your_test_secret_key_here";
    this.baseUrl = "https://api.paystack.co";
  }

  async initializePayment(
    email: string,
    amount: number,
    reference: string,
    callback_url?: string,
  ): Promise<PaystackInitializePaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Paystack expects amount in kobo (pesewas)
          reference,
          callback_url:
            callback_url || `${process.env.FRONTEND_URL}/payment/callback`,
          metadata: {
            custom_fields: [
              {
                display_name: "Document Request",
                variable_name: "document_request",
                value: reference,
              },
            ],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      return data;
    } catch (error) {
      console.error("Paystack initialize payment error:", error);
      throw error;
    }
  }

  async verifyPayment(
    reference: string,
  ): Promise<PaystackVerifyPaymentResponse> {
    try {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      return data;
    } catch (error) {
      console.error("Paystack verify payment error:", error);
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
