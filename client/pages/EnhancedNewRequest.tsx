import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  FileText,
  CreditCard,
  Download,
  Truck,
  HandCoins,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RequestStep = "document" | "delivery" | "payment" | "confirmation";

interface DocumentType {
  type: string;
  name: string;
  description: string;
  basePrice: number;
  deliveryOptions: {
    method: string;
    name: string;
    additionalCost: number;
    estimatedDelivery: string;
  }[];
}

export default function EnhancedNewRequest() {
  const [step, setStep] = useState<RequestStep>("document");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null,
  );
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch("/api/documents/types");
      const result = await response.json();

      if (result.success) {
        setDocumentTypes(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch document types:", error);
    }
  };

  const handleDocumentSelect = (docType: DocumentType) => {
    setSelectedDocument(docType);
    setStep("delivery");
  };

  const handleDeliverySelect = (delivery: any) => {
    setSelectedDelivery(delivery);
    setStep("payment");
  };

  const calculateTotalAmount = () => {
    if (!selectedDocument || !selectedDelivery) return 0;
    return selectedDocument.basePrice + selectedDelivery.additionalCost;
  };

  const handlePaymentMethodSelect = async (method: string) => {
    setPaymentMethod(method);

    if (method === "cash_on_delivery") {
      // For cash on delivery, skip to confirmation
      await createRequest();
    } else {
      // For Paystack, initiate payment
      await initiatePayment();
    }
  };

  const createRequest = async () => {
    setIsLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please login first");
        navigate("/new-login");
        return;
      }

      const requestData = {
        type: selectedDocument?.type,
        deliveryMethod: selectedDelivery?.method,
        deliveryAddress:
          selectedDelivery?.method !== "digital" ? deliveryAddress : undefined,
        notes,
        paymentMethod,
        amount: calculateTotalAmount(),
      };

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        setStep("confirmation");
      } else {
        alert(result.message || "Failed to create request");
      }
    } catch (error) {
      console.error("Create request error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async () => {
    setIsLoading(true);

    try {
      const requestId = "temp_request_id"; // In real app, create request first
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": localStorage.getItem("userId") || "",
        },
        body: JSON.stringify({
          requestId,
          paymentMethod: "paystack",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Paystack payment page
        window.location.href = result.data.authorization_url;
      } else {
        alert(result.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (currentStep: RequestStep) => {
    switch (currentStep) {
      case "document":
        return <FileText className="h-5 w-5" />;
      case "delivery":
        return <Truck className="h-5 w-5" />;
      case "payment":
        return <CreditCard className="h-5 w-5" />;
      case "confirmation":
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "digital":
        return <Download className="h-5 w-5 text-blue-600" />;
      case "courier":
        return <Truck className="h-5 w-5 text-green-600" />;
      case "cash_on_delivery":
        return <HandCoins className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-200">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                alt="TTU Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-ttu-navy">
                Request Document
              </h1>
              <p className="text-sm text-muted-foreground">
                TTU Academic Records
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {(["document", "delivery", "payment", "confirmation"] as const).map(
              (stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      step === stepName
                        ? "bg-primary text-white border-primary"
                        : index <
                            [
                              "document",
                              "delivery",
                              "payment",
                              "confirmation",
                            ].indexOf(step)
                          ? "bg-success text-white border-success"
                          : "bg-muted text-muted-foreground border-muted",
                    )}
                  >
                    {getStepIcon(stepName)}
                  </div>
                  {index < 3 && <div className="w-8 h-0.5 bg-muted mx-2"></div>}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-elevation-3 border-0">
          {step === "document" && (
            <>
              <CardHeader>
                <CardTitle>Select Document Type</CardTitle>
                <CardDescription>
                  Choose the type of document you want to request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documentTypes.map((docType) => (
                    <Card
                      key={docType.type}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleDocumentSelect(docType)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{docType.name}</h3>
                            <Badge>GHS {docType.basePrice}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {docType.description}
                          </p>
                          <Button className="w-full" size="sm">
                            Select Document
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {step === "delivery" && selectedDocument && (
            <>
              <CardHeader>
                <CardTitle>Select Delivery Method</CardTitle>
                <CardDescription>
                  Choose how you want to receive your{" "}
                  {selectedDocument.name.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDocument.deliveryOptions.map((delivery) => (
                    <Card
                      key={delivery.method}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleDeliverySelect(delivery)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getDeliveryIcon(delivery.method)}
                            <div>
                              <h4 className="font-medium">{delivery.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {delivery.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge>
                              {delivery.additionalCost > 0
                                ? `+GHS ${delivery.additionalCost}`
                                : "Free"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              Total: GHS{" "}
                              {selectedDocument.basePrice +
                                delivery.additionalCost}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedDelivery?.method !== "digital" && (
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your delivery address..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === "payment" && (
            <>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{selectedDocument?.name}</span>
                        <span>GHS {selectedDocument?.basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{selectedDelivery?.name}</span>
                        <span>
                          {selectedDelivery?.additionalCost > 0
                            ? `GHS ${selectedDelivery.additionalCost}`
                            : "Free"}
                        </span>
                      </div>
                      <div className="border-t pt-2 font-medium flex justify-between">
                        <span>Total</span>
                        <span>GHS {calculateTotalAmount()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handlePaymentMethodSelect("paystack")}
                    >
                      <CardContent className="p-6 text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-medium">Pay with Paystack</h4>
                        <p className="text-sm text-muted-foreground">
                          Card, Mobile Money, Bank Transfer
                        </p>
                        <Badge className="mt-2">Instant</Badge>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        handlePaymentMethodSelect("cash_on_delivery")
                      }
                    >
                      <CardContent className="p-6 text-center">
                        <HandCoins className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                        <h4 className="font-medium">Cash on Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive
                        </p>
                        <Badge className="mt-2" variant="secondary">
                          5-7 days
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === "confirmation" && (
            <>
              <CardHeader>
                <CardTitle className="text-success">
                  Request Submitted Successfully!
                </CardTitle>
                <CardDescription>
                  Your document request has been received and is being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-success/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">
                        What happens next?
                      </span>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Your request will be reviewed within 24 hours</li>
                      <li>
                        • You'll receive SMS updates on your request status
                      </li>
                      <li>
                        • Document will be ready for delivery once payment is
                        confirmed
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => navigate("/track-requests")}
                    >
                      Track My Requests
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
