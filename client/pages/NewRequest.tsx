import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GraduationCap,
  FileText,
  Award,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Download,
  Smartphone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type RequestStep = "details" | "delivery" | "payment" | "confirmation";

interface RequestData {
  type: "transcript" | "certificate" | "attestation";
  subType: string;
  deliveryMethod: "digital" | "courier" | "cash_on_delivery";
  deliveryAddress: string;
  notes: string;
}

export default function NewRequest() {
  const [step, setStep] = useState<RequestStep>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState<RequestData>({
    type: "transcript",
    subType: "",
    deliveryMethod: "digital",
    deliveryAddress: "",
    notes: "",
  });
  const [createdRequest, setCreatedRequest] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const documentTypes = {
    transcript: {
      name: "Official Transcript",
      description: "Complete academic record with grades",
      price: 50,
      subTypes: [
        "Undergraduate Transcript",
        "Postgraduate Transcript",
        "Diploma Transcript",
      ],
    },
    certificate: {
      name: "Certificate",
      description: "Degree or diploma certificate",
      price: 30,
      subTypes: [
        "Bachelor's Degree Certificate",
        "Master's Degree Certificate",
        "Diploma Certificate",
        "Certificate of Completion",
      ],
    },
    attestation: {
      name: "Attestation",
      description: "Document verification and authentication",
      price: 20,
      subTypes: [
        "Letter of Good Standing",
        "Academic Verification",
        "Document Authentication",
        "Student Status Confirmation",
      ],
    },
  };

  const handleNext = () => {
    if (step === "details" && (!requestData.type || !requestData.subType)) {
      toast({
        title: "Missing Information",
        description: "Please select document type and specify details",
        variant: "destructive",
      });
      return;
    }

    if (
      step === "delivery" &&
      requestData.deliveryMethod !== "digital" &&
      !requestData.deliveryAddress
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please provide delivery address for courier/cash delivery",
        variant: "destructive",
      });
      return;
    }

    const steps: RequestStep[] = [
      "details",
      "delivery",
      "payment",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: RequestStep[] = [
      "details",
      "delivery",
      "payment",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a request",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCreatedRequest(result.request);

        toast({
          title: "Request Submitted",
          description: "Redirecting to payment...",
        });

        // Automatically redirect to payment after successful request submission
        await handleAutomaticPayment(result.request);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Submit request error:", error);

      // Check if this is a 404 error which likely means session expired
      if (error.message.includes("404")) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });

        // Clear localStorage and redirect to login after a short delay
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutomaticPayment = async (request: any) => {
    try {
      const userId = localStorage.getItem("userId");

      // Initialize payment with Paystack automatically
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId!,
        },
        body: JSON.stringify({
          requestId: request.id,
          amount: request.amount,
          paymentMethod: "paystack", // Default to Paystack
        }),
      });

      const result = await response.json();

      if (result.success && result.authorization_url) {
        // Show loading message and redirect to Paystack
        toast({
          title: "Redirecting to Payment",
          description: "Please complete your payment to process your request",
        });

        // Small delay to show the toast message
        setTimeout(() => {
          window.location.href = result.authorization_url;
        }, 1500);
      } else {
        // If automatic payment fails, show payment step
        console.error("Paystack initialization failed:", result);
        setStep("payment");
        toast({
          title: "Payment Initialization Failed",
          description:
            result.message ||
            "Please try again or choose another payment method",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Automatic payment error:", error);
      // If automatic payment fails, show payment step
      setStep("payment");
      toast({
        title: "Payment Required",
        description: "Please choose a payment method to complete your request",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (paymentMethod: string) => {
    if (!createdRequest) return;

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem("userId");

      // Initialize payment with Paystack
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId!,
        },
        body: JSON.stringify({
          requestId: createdRequest.id,
          amount: createdRequest.amount,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = result.authorization_url;
      } else if (result.success) {
        // For cash on delivery or other non-Paystack methods
        setCreatedRequest(result.request);
        setStep("confirmation");
        toast({
          title: "Request Processed",
          description: "Your request has been processed successfully",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ttu-gray/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ttu-navy to-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ttu-navy">New Request</h1>
              <p className="text-xs text-muted-foreground">TTU DocPortal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {["details", "delivery", "payment", "confirmation"].map(
              (s, index) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step === s
                        ? "bg-primary text-white"
                        : index <
                            [
                              "details",
                              "delivery",
                              "payment",
                              "confirmation",
                            ].indexOf(step)
                          ? "bg-success text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index <
                    ["details", "delivery", "payment", "confirmation"].indexOf(
                      step,
                    ) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-12 h-1 transition-colors ${
                        index <
                        [
                          "details",
                          "delivery",
                          "payment",
                          "confirmation",
                        ].indexOf(step)
                          ? "bg-success"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ),
            )}
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-ttu-navy capitalize">
              {step === "details" && "Document Details"}
              {step === "delivery" && "Delivery Options"}
              {step === "payment" && "Payment"}
              {step === "confirmation" && "Confirmation"}
            </h2>
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-elevation-2">
          <CardContent className="p-8">
            {step === "details" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-ttu-navy">
                    Select Document Type
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(documentTypes).map(([key, doc]) => (
                      <Card
                        key={key}
                        className={`cursor-pointer border-2 transition-colors ${
                          requestData.type === key
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() =>
                          setRequestData({
                            ...requestData,
                            type: key as any,
                            subType: "",
                          })
                        }
                      >
                        <CardHeader className="text-center pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                            {key === "transcript" && (
                              <FileText className="h-6 w-6 text-primary" />
                            )}
                            {key === "certificate" && (
                              <Award className="h-6 w-6 text-primary" />
                            )}
                            {key === "attestation" && (
                              <Shield className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <CardTitle className="text-base">
                            {doc.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {doc.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 text-center">
                          <Badge className="bg-ttu-gold/10 text-ttu-gold">
                            GHS {doc.price}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {requestData.type && (
                  <div className="space-y-4">
                    <Label htmlFor="subType">Specific Document</Label>
                    <Select
                      value={requestData.subType}
                      onValueChange={(value) =>
                        setRequestData({ ...requestData, subType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes[requestData.type].subTypes.map(
                          (subType) => (
                            <SelectItem key={subType} value={subType}>
                              {subType}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-4">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or additional information..."
                    value={requestData.notes}
                    onChange={(e) =>
                      setRequestData({ ...requestData, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === "delivery" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-ttu-navy">
                    Choose Delivery Method
                  </h3>

                  <RadioGroup
                    value={requestData.deliveryMethod}
                    onValueChange={(value: any) =>
                      setRequestData({ ...requestData, deliveryMethod: value })
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="digital" id="digital" />
                      <div className="flex-1">
                        <Label htmlFor="digital" className="font-medium">
                          Digital Only
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive digital copy via email immediately after
                          processing
                        </p>
                        <Badge className="mt-1 bg-success/10 text-success">
                          Fast & Eco-friendly
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="courier" id="courier" />
                      <div className="flex-1">
                        <Label htmlFor="courier" className="font-medium">
                          Courier Delivery
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive official hard copy via courier service
                        </p>
                        <Badge className="mt-1 bg-info/10 text-info">
                          3-5 Business Days
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem
                        value="cash_on_delivery"
                        id="cash_on_delivery"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="cash_on_delivery"
                          className="font-medium"
                        >
                          Cash on Delivery
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your documents at your doorstep
                        </p>
                        <Badge className="mt-1 bg-ttu-gold/10 text-ttu-gold">
                          Pay on Receipt
                        </Badge>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {(requestData.deliveryMethod === "courier" ||
                  requestData.deliveryMethod === "cash_on_delivery") && (
                  <div className="space-y-4">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address..."
                      value={requestData.deliveryAddress}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          deliveryAddress: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Please provide a complete address including postal code
                      for accurate delivery
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === "payment" && !createdRequest && (
              <div className="space-y-8">
                <div className="bg-ttu-light-blue/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-ttu-navy mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Document Type:</span>
                      <span className="font-medium">
                        {documentTypes[requestData.type].name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Specific Document:</span>
                      <span className="font-medium">{requestData.subType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Method:</span>
                      <span className="font-medium capitalize">
                        {requestData.deliveryMethod}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-ttu-navy">
                        GHS {documentTypes[requestData.type].price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Click continue to submit your request and proceed to
                    payment.
                  </p>

                  <Button
                    onClick={handleSubmitRequest}
                    disabled={isSubmitting}
                    className="bg-ttu-navy hover:bg-ttu-navy/90"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing & Redirecting to Payment...
                      </>
                    ) : (
                      <>
                        Submit Request & Pay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && createdRequest && !createdRequest.isPaid && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-ttu-navy">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-muted-foreground">
                    Request ID:{" "}
                    <span className="font-mono font-medium">
                      {createdRequest.id}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-ttu-navy">
                    Choose Payment Method
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handlePayment("mobile_money")}
                      disabled={isSubmitting}
                      className="h-auto p-6 bg-ttu-gold hover:bg-ttu-gold/90"
                    >
                      <div className="text-center">
                        <Smartphone className="h-8 w-8 mx-auto mb-2" />
                        <div className="font-medium">Mobile Money</div>
                        <div className="text-sm opacity-90">
                          MTN, Vodafone, AirtelTigo
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handlePayment("card")}
                      disabled={isSubmitting}
                      variant="outline"
                      className="h-auto p-6 border-ttu-navy"
                    >
                      <div className="text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-2" />
                        <div className="font-medium">Card Payment</div>
                        <div className="text-sm text-muted-foreground">
                          Visa, Mastercard
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === "confirmation" &&
              createdRequest &&
              createdRequest.isPaid && (
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                    <h3 className="text-2xl font-semibold text-success">
                      Payment Successful!
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your document request has been submitted and payment
                      confirmed. You'll receive SMS updates on your request
                      status.
                    </p>
                  </div>

                  <div className="bg-ttu-light-blue/20 rounded-lg p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-ttu-navy mb-3">
                      Request Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Request ID:</span>
                        <span className="font-mono">{createdRequest.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-success/10 text-success">
                          Processing
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Completion:</span>
                        <span>24-48 hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard">
                      <Button className="bg-ttu-navy hover:bg-ttu-navy/90">
                        <Download className="mr-2 h-4 w-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link to="/new-request">
                      <Button variant="outline">Make Another Request</Button>
                    </Link>
                  </div>
                </div>
              )}

            {/* Navigation Buttons */}
            {step !== "confirmation" &&
              (!createdRequest || !createdRequest.isPaid) && (
                <div className="flex justify-between pt-8 border-t">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    disabled={step === "details"}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  {step !== "payment" && (
                    <Button
                      onClick={handleNext}
                      className="bg-ttu-navy hover:bg-ttu-navy/90"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
