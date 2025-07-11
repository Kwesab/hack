// Paystack Configuration
export const PAYSTACK_CONFIG = {
  // ⚠️ WARNING: Using LIVE public key - this will process real payments!
  publicKey:
    process.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_YOUR_LIVE_PUBLIC_KEY_HERE",

  // Helper function to check if we're using live keys
  isLiveMode: () => {
    return PAYSTACK_CONFIG.publicKey.startsWith("pk_live_");
  },

  // Get appropriate callback URL
  getCallbackUrl: () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/payment/callback`;
  },
};

// Log warning for live key usage
if (PAYSTACK_CONFIG.isLiveMode()) {
  console.warn(
    "⚠️ PAYSTACK WARNING: Using LIVE public key - real payments will be processed!",
  );
}
