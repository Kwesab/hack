import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
  FileText,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");
  const [requestData, setRequestData] = useState<any>(null);
  const [createdRequest, setCreatedRequest] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (reference || trxref) {
      verifyPaymentAndSubmitRequest();
    } else {
      setPaymentStatus("failed");
      setIsProcessing(false);
    }
  }, [reference, trxref]);

  const verifyPaymentAndSubmitRequest = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const paymentRef = reference || trxref;
      if (!paymentRef) {
        throw new Error("No payment reference found");
      }

      // Step 1: Verify payment with backend
      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({ reference: paymentRef }),
      });

      if (!verifyResponse.ok) {
        throw new Error(
          `Payment verification failed: ${verifyResponse.status}`,
        );
      }

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success || !verifyResult.payment_verified) {
        throw new Error("Payment verification failed");
      }

      // Step 2: Get request data from session storage
      const pendingRequestData = sessionStorage.getItem("pendingRequestData");
      if (!pendingRequestData) {
        throw new Error("Request data not found");
      }

      const parsedRequestData = JSON.parse(pendingRequestData);
      setRequestData(parsedRequestData);

      // Step 3: Submit request to admin now that payment is verified
      const submitResponse = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({
          ...parsedRequestData,
          paymentReference: paymentRef,
          isPaid: true,
          paymentMethod: "paystack",
          amount: verifyResult.amount / 100, // Convert from kobo to naira/cedis
        }),
      });

      if (!submitResponse.ok) {
        throw new Error(`Request submission failed: ${submitResponse.status}`);
      }

      const submitResult = await submitResponse.json();

      if (!submitResult.success) {
        throw new Error(submitResult.message || "Request submission failed");
      }

      // Success!
      setCreatedRequest(submitResult.request);
      setPaymentStatus("success");

      // Clean up session storage
      sessionStorage.removeItem("pendingRequestData");
      sessionStorage.removeItem("paymentReference");

      toast({
        title: "Success!",
        description: "Payment confirmed and request submitted to admin",
      });
    } catch (error) {
      console.error("Payment verification or request submission error:", error);
      setPaymentStatus("failed");

      toast({
        title: "Error",
        description:
          error.message || "Failed to process payment and submit request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                alt="TTU Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            TTU DocPortal
          </h1>
          <p className="text-gray-600 font-medium">Payment Processing</p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl shadow-blue-500/10 bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8">
            {paymentStatus === "verifying" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Verifying Payment
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we verify your payment and submit your
                    request...
                  </p>
                </div>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your payment has been processed and your document request
                    has been submitted to the admin for processing.
                  </p>

                  {createdRequest && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Request Details
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Request ID: {createdRequest.id}
                      </p>
                      <p className="text-sm text-green-700">
                        Type: {requestData?.type}
                      </p>
                      <p className="text-sm text-green-700">
                        Amount: GH₵{createdRequest.amount}
                      </p>
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    You will receive updates about your request via SMS and
                    email.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate("/track-requests")}
                    variant="outline"
                    className="w-full"
                  >
                    Track This Request
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Processing Failed
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't verify your payment or submit your request. This
                    might be due to a cancelled payment or technical issue.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    If you made a payment, please contact support or try
                    submitting your request again.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/new-request")}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
