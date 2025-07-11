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
  XCircle,
  Download,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

type PaymentStatus = "verifying" | "success" | "failed" | "cancelled";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference && !trxref) {
        setStatus("failed");
        setError("No payment reference found");
        return;
      }

      const paymentRef = reference || trxref;

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference: paymentRef,
            requestId: "demo_request_id", // In real app, get from state/localStorage
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatus("success");
          setPaymentData(result.data);
        } else {
          setStatus("failed");
          setError(result.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setError("Network error during verification");
      }
    };

    // Delay verification slightly to allow redirect to complete
    const timer = setTimeout(verifyPayment, 1000);
    return () => clearTimeout(timer);
  }, [reference, trxref]);

  const handleDownloadDocument = () => {
    // In real implementation, use the actual request ID
    const requestId = "demo_request_id";
    window.open(`/api/documents/download/${requestId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-elevation-3 border-0">
          <CardHeader className="text-center">
            {status === "verifying" && (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-blue-600">
                  Verifying Payment
                </CardTitle>
                <CardDescription>
                  Please wait while we confirm your payment...
                </CardDescription>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-success">
                  Payment Successful!
                </CardTitle>
                <CardDescription>
                  Your payment has been confirmed and your document is ready for
                  download.
                </CardDescription>
              </>
            )}

            {status === "failed" && (
              <>
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-destructive">
                  Payment Failed
                </CardTitle>
                <CardDescription>
                  There was an issue with your payment. Please try again.
                </CardDescription>
              </>
            )}

            {status === "cancelled" && (
              <>
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-amber-600">
                  Payment Cancelled
                </CardTitle>
                <CardDescription>
                  You cancelled the payment process.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {status === "verifying" && (
              <div className="text-center">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}

            {status === "success" && paymentData && (
              <div className="space-y-4">
                <div className="bg-success/10 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Payment Reference
                    </span>
                    <Badge className="bg-success/10 text-success">
                      {paymentData.reference}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount Paid</span>
                    <span className="text-sm font-mono">
                      GHS {paymentData.amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className="bg-success/10 text-success">Paid</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-success hover:bg-success/90"
                    onClick={handleDownloadDocument}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </div>

                <div className="bg-info/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-info" />
                    <span className="text-sm font-medium text-info">
                      Download Information
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your document is available for download immediately. You can
                    also access it from your dashboard at any time.
                  </p>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">
                        Error Details
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/new-request")}
                  >
                    Try Payment Again
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600">
                      Need Help?
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    If you continue to experience issues, please contact TTU
                    support with your payment reference.
                  </p>
                </div>
              </div>
            )}

            {status === "cancelled" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/new-request")}
                  >
                    Try Again
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 Takoradi Technical University
          </p>
        </div>
      </div>
    </div>
  );
}
