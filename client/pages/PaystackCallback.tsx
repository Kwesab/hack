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
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
  CreditCard,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentResult {
  success: boolean;
  status: string;
  reference: string;
  amount: number;
  message: string;
  requestId?: string;
  customerEmail?: string;
  paidAt?: string;
}

export default function PaystackCallback() {
  const [searchParams] = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = searchParams.get("reference");
      const status = searchParams.get("status");

      console.log(
        "Payment callback - Reference:",
        reference,
        "Status:",
        status,
      );

      if (!reference) {
        setPaymentResult({
          success: false,
          status: "failed",
          reference: "",
          amount: 0,
          message: "No payment reference found",
        });
        setIsVerifying(false);
        return;
      }

      // If status is explicitly "cancelled", handle immediately
      if (status === "cancelled") {
        setPaymentResult({
          success: false,
          status: "cancelled",
          reference: reference,
          amount: 0,
          message: "Payment was cancelled by user",
        });
        setIsVerifying(false);
        return;
      }

      // Verify payment with backend
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId || "",
        },
        body: JSON.stringify({
          reference: reference,
        }),
      });

      const result = await response.json();
      console.log("Payment verification result:", result);

      if (result.success) {
        setPaymentResult({
          success: true,
          status: "success",
          reference: reference,
          amount: result.amount || 0,
          message:
            "Payment successful! Your document request is being processed.",
          requestId: result.requestId,
          customerEmail: result.customerEmail,
          paidAt: result.paidAt,
        });

        toast({
          title: "Payment Successful!",
          description: "Your document request is now being processed.",
        });
      } else {
        setPaymentResult({
          success: false,
          status: "failed",
          reference: reference,
          amount: 0,
          message: result.message || "Payment verification failed",
        });

        toast({
          title: "Payment Failed",
          description: result.message || "Payment could not be verified",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentResult({
        success: false,
        status: "error",
        reference: searchParams.get("reference") || "",
        amount: 0,
        message: "Failed to verify payment. Please contact support.",
      });

      toast({
        title: "Verification Error",
        description: "Failed to verify payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetryPayment = () => {
    // Go back to the new request page to retry
    navigate("/new-request");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleTrackRequests = () => {
    navigate("/track-requests");
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-ttu-gray/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-xl text-ttu-navy">
              Verifying Payment
            </CardTitle>
            <CardDescription>
              Please wait while we confirm your payment...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ttu-gray/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-ttu-navy to-primary rounded-xl flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-ttu-navy">
                Payment Status
              </h1>
              <p className="text-sm text-muted-foreground">
                TTU DocPortal Payment Verification
              </p>
            </div>
          </div>
        </div>

        {/* Payment Result Card */}
        <Card className="shadow-elevation-3 border-0 mb-6">
          <CardHeader className="text-center">
            {paymentResult?.success ? (
              <>
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <CardTitle className="text-2xl text-success">
                  Payment Successful!
                </CardTitle>
                <CardDescription className="text-lg">
                  Your document request has been processed successfully
                </CardDescription>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <CardTitle className="text-2xl text-destructive">
                  {paymentResult?.status === "cancelled"
                    ? "Payment Cancelled"
                    : "Payment Failed"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {paymentResult?.message ||
                    "Something went wrong with your payment"}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-ttu-navy">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Reference:</span>
                  <p className="font-mono font-medium">
                    {paymentResult?.reference || "N/A"}
                  </p>
                </div>
                {paymentResult?.amount && paymentResult.amount > 0 && (
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-semibold">GHS {paymentResult.amount}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    className={
                      paymentResult?.success
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    {paymentResult?.status || "Unknown"}
                  </Badge>
                </div>
                {paymentResult?.paidAt && (
                  <div>
                    <span className="text-muted-foreground">Paid At:</span>
                    <p className="text-sm">
                      {new Date(paymentResult.paidAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {paymentResult?.success ? (
                <>
                  <Button
                    onClick={handleTrackRequests}
                    className="w-full bg-success hover:bg-success/90"
                    size="lg"
                  >
                    <Clock className="mr-2 h-5 w-5" />
                    Track Your Document Request
                  </Button>
                  <Button
                    onClick={handleGoToDashboard}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <>
                  {paymentResult?.status !== "cancelled" && (
                    <Button
                      onClick={handleRetryPayment}
                      className="w-full bg-ttu-navy hover:bg-ttu-navy/90"
                      size="lg"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Try Payment Again
                    </Button>
                  )}
                  <Button
                    onClick={handleGoToDashboard}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Return to Dashboard
                  </Button>
                </>
              )}
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-muted-foreground">
              {paymentResult?.success ? (
                <p>
                  You will receive an email confirmation shortly. Your document
                  will be ready for download once processing is complete.
                </p>
              ) : (
                <p>
                  If you continue to experience issues, please contact support
                  with reference:{" "}
                  <span className="font-mono">{paymentResult?.reference}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
