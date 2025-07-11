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
  Package,
  Truck,
  Loader2,
  Sparkles,
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [requestData, setRequestData] = useState<RequestData>({
    type: "transcript",
    subType: "",
    deliveryMethod: "digital",
    deliveryAddress: "",
    notes: "",
  });
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [createdRequest, setCreatedRequest] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const documentTypes = {
    transcript: {
      name: "Official Transcript",
      description: "Complete academic record with grades and course details",
      price: 50,
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
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
      icon: Award,
      color: "from-yellow-500 to-orange-600",
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
      icon: Shield,
      color: "from-green-500 to-emerald-600",
      subTypes: [
        "Letter of Good Standing",
        "Academic Verification",
        "Document Authentication",
        "Student Status Confirmation",
      ],
    },
  };

  const deliveryOptions = [
    {
      id: "digital",
      name: "Digital Delivery",
      description: "Instant download after processing",
      icon: Download,
      price: 0,
      time: "Instant",
    },
    {
      id: "courier",
      name: "Courier Delivery",
      description: "Physical delivery to your address",
      icon: Truck,
      price: 15,
      time: "3-5 days",
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      description: "Pay when you receive the document",
      icon: Package,
      price: 10,
      time: "5-7 days",
    },
  ];

  const handleNext = () => {
    if (step === "details" && (!requestData.type || !requestData.subType)) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and subtype",
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
        description: "Please provide a delivery address",
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

  const handlePrevious = () => {
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

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make payment",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Calculate total amount
      const totalAmount = getTotalAmount();

      // Initialize payment with Paystack
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({
          amount: totalAmount,
          paymentMethod: "paystack",
          email: localStorage.getItem("userEmail"),
          metadata: {
            documentType: requestData.type,
            subType: requestData.subType,
            deliveryMethod: requestData.deliveryMethod,
            notes: requestData.notes,
            deliveryAddress: requestData.deliveryAddress,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.authorization_url) {
        // Store payment reference for later use
        setPaymentReference(result.reference);

        toast({
          title: "Redirecting to Payment",
          description: "Complete your payment to proceed with the request",
        });

        // Store request data in sessionStorage for after payment
        sessionStorage.setItem(
          "pendingRequestData",
          JSON.stringify(requestData),
        );
        sessionStorage.setItem("paymentReference", result.reference);

        // Redirect to Paystack
        setTimeout(() => {
          window.location.href = result.authorization_url;
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      if (error.message.includes("HTTP error")) {
        toast({
          title: "Payment Error",
          description: "Server error. Please try again.",
          variant: "destructive",
        });
      } else if (
        error.message.includes("401") ||
        error.message.includes("404")
      ) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        toast({
          title: "Payment Error",
          description: "Network error. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessingPayment(false);
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

      // Submit request with payment reference
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({
          ...requestData,
          paymentReference: paymentReference,
          isPaid: true,
          paymentMethod: "paystack",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCreatedRequest(result.request);
        setStep("confirmation");

        toast({
          title: "Request Submitted Successfully",
          description: "Your request has been sent to the admin for processing",
        });

        // Clear session storage
        sessionStorage.removeItem("pendingRequestData");
        sessionStorage.removeItem("paymentReference");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Submit request error:", error);

      if (error.message.includes("401") || error.message.includes("404")) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
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

  const getTotalAmount = () => {
    const basePrice = documentTypes[requestData.type].price;
    const deliveryPrice =
      deliveryOptions.find((option) => option.id === requestData.deliveryMethod)
        ?.price || 0;
    return basePrice + deliveryPrice;
  };

  const stepInfo = {
    details: {
      title: "Document Details",
      subtitle: "Choose your document type",
      step: 1,
    },
    delivery: {
      title: "Delivery Method",
      subtitle: "How would you like to receive it",
      step: 2,
    },
    payment: {
      title: "Payment",
      subtitle: "Complete payment to submit your request",
      step: 3,
    },
    confirmation: {
      title: "Request Submitted",
      subtitle: "Your paid request has been sent to admin",
      step: 4,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                  alt="TTU Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  TTU DocPortal
                </h1>
                <p className="text-sm text-gray-500">New Request</p>
              </div>
            </div>
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    stepInfo[step].step >= num
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                      stepInfo[step].step > num ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {stepInfo[step].title}
            </h2>
            <p className="text-gray-600">{stepInfo[step].subtitle}</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-2xl shadow-blue-500/10">
          <CardContent className="p-8">
            {/* Document Details Step */}
            {step === "details" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Document Type
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(documentTypes).map(([key, type]) => {
                      const IconComponent = type.icon;
                      return (
                        <Card
                          key={key}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            requestData.type === key
                              ? "ring-2 ring-blue-500 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                          onClick={() =>
                            setRequestData({
                              ...requestData,
                              type: key as any,
                              subType: "",
                            })
                          }
                        >
                          <CardContent className="p-6 text-center">
                            <div
                              className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                            >
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {type.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {type.description}
                            </p>
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              GH₵{type.price}
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {requestData.type && (
                  <div>
                    <Label className="text-base font-medium text-gray-900">
                      Select Specific Type
                    </Label>
                    <Select
                      value={requestData.subType}
                      onValueChange={(value) =>
                        setRequestData({ ...requestData, subType: value })
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg mt-2">
                        <SelectValue placeholder="Choose a specific type..." />
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

                <div>
                  <Label
                    htmlFor="notes"
                    className="text-base font-medium text-gray-900"
                  >
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or additional information..."
                    value={requestData.notes}
                    onChange={(e) =>
                      setRequestData({ ...requestData, notes: e.target.value })
                    }
                    className="mt-2 min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Delivery Method Step */}
            {step === "delivery" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Choose Delivery Method
                </h3>
                <RadioGroup
                  value={requestData.deliveryMethod}
                  onValueChange={(value) =>
                    setRequestData({
                      ...requestData,
                      deliveryMethod: value as any,
                    })
                  }
                  className="space-y-4"
                >
                  {deliveryOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <div key={option.id} className="relative">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={option.id}
                          className={`block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            requestData.deliveryMethod === option.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  requestData.deliveryMethod === option.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {option.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {option.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Delivery time: {option.time}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {option.price === 0
                                  ? "Free"
                                  : `+GH₵${option.price}`}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>

                {requestData.deliveryMethod !== "digital" && (
                  <div>
                    <Label
                      htmlFor="address"
                      className="text-base font-medium text-gray-900"
                    >
                      Delivery Address
                    </Label>
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
                      className="mt-2 min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Complete Payment
                </h3>

                <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Document Type:
                      </span>
                      <span className="text-gray-900">
                        {documentTypes[requestData.type].name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Specific Type:
                      </span>
                      <span className="text-gray-900">
                        {requestData.subType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Base Price:
                      </span>
                      <span className="text-gray-900">
                        GH₵{documentTypes[requestData.type].price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        Delivery:
                      </span>
                      <span className="text-gray-900 capitalize">
                        {requestData.deliveryMethod.replace("_", " ")}
                        {deliveryOptions.find(
                          (o) => o.id === requestData.deliveryMethod,
                        )?.price! > 0 &&
                          ` (+GH₵${deliveryOptions.find((o) => o.id === requestData.deliveryMethod)?.price})`}
                      </span>
                    </div>
                    <div className="border-t border-blue-200 pt-3">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-blue-600">
                          GH₵{getTotalAmount()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-1">
                        Payment Required
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Payment must be completed before your request is
                        submitted to the admin for processing. This ensures your
                        document request is prioritized immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Payment Method</h4>
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Paystack Payment
                        </h5>
                        <p className="text-sm text-gray-600">
                          Secure payment with card, mobile money, or bank
                          transfer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your payment has been processed and your request has been
                    sent to the admin for processing.
                  </p>
                  {createdRequest && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">Request ID:</p>
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        {createdRequest.id}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    You will receive updates about your request via SMS and
                    email.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white">
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link to="/track-requests">
                    <Button variant="outline">Track This Request</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation */}
            {step !== "confirmation" && (
              <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === "details"}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {step === "payment" ? (
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-8"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting to Payment...
                      </>
                    ) : (
                      <>
                        Pay GH₵{getTotalAmount()}
                        <CreditCard className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (step === "details" &&
                        (!requestData.type || !requestData.subType)) ||
                      (step === "delivery" &&
                        requestData.deliveryMethod !== "digital" &&
                        !requestData.deliveryAddress)
                    }
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
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
