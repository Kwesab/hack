import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  FileText,
  Award,
  Shield,
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  Package,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DocumentRequest {
  id: string;
  type: "transcript" | "certificate" | "attestation";
  subType: string;
  status: "pending" | "processing" | "ready" | "completed" | "rejected";
  deliveryMethod: "digital" | "courier" | "cash_on_delivery";
  amount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  adminNotes?: string;
}

export default function TrackRequests() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DocumentRequest[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/requests", {
        headers: {
          "X-User-Id": userId!,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRequests(result.requests || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast({
        title: "Error",
        description: "Failed to load your requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDownload = async (requestId: string) => {
    try {
      const userId = localStorage.getItem("userId");

      // First check if the request is paid before attempting download
      const request = requests.find((req) => req.id === requestId);
      if (request && !request.isPaid) {
        toast({
          title: "Payment Required",
          description: `Please complete payment of GHS ${request.amount} before downloading your document.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Verifying Payment",
        description: "Checking payment status and preparing document...",
      });

      // Use the correct download endpoint with payment verification
      const response = await fetch(`/api/documents/download/${requestId}`, {
        method: "GET",
        headers: {
          "X-User-Id": userId!,
        },
      });

      if (response.status === 402) {
        const errorData = await response.json();
        toast({
          title: "Payment Required",
          description: `Please complete payment of GHS ${errorData.amount} before downloading your document.`,
          variant: "destructive",
        });
        return;
      }

      if (response.status === 400) {
        const errorData = await response.json();
        toast({
          title: "Document Not Ready",
          description: errorData.message,
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // For successful response, trigger download as blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TTU_${request?.type || "document"}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your document is downloading",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = async (requestId: string) => {
    try {
      const userId = localStorage.getItem("userId");

      // Check payment status before preview
      const request = requests.find((req) => req.id === requestId);
      if (request && !request.isPaid) {
        toast({
          title: "Payment Required",
          description: `Please complete payment of GHS ${request.amount} before previewing your document.`,
          variant: "destructive",
        });
        return;
      }

      // Open preview in new tab
      const previewUrl = `/api/documents/preview/${requestId}`;
      const previewWindow = window.open(
        previewUrl + `?userId=${userId}`,
        "_blank",
      );

      if (!previewWindow) {
        toast({
          title: "Preview Blocked",
          description: "Please allow popups for this site to preview documents",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast({
        title: "Preview Failed",
        description: "Failed to preview document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (requestId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      const request = requests.find((req) => req.id === requestId);

      if (!request) {
        toast({
          title: "Error",
          description: "Request not found",
          variant: "destructive",
        });
        return;
      }

      // Initialize payment
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId!,
        },
        body: JSON.stringify({
          requestId: request.id,
          amount: request.amount,
          paymentMethod: "paystack",
        }),
      });

      const result = await response.json();

      if (result.success && result.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = result.authorization_url;
      } else {
        throw new Error(result.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.subType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800", icon: RefreshCw },
      ready: { color: "bg-green-100 text-green-800", icon: Package },
      completed: { color: "bg-success/10 text-success", icon: CheckCircle },
      rejected: {
        color: "bg-destructive/10 text-destructive",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;

    return (
      <Badge className={config?.color || "bg-gray-100 text-gray-800"}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "transcript":
        return <FileText className="h-5 w-5" />;
      case "certificate":
        return <Award className="h-5 w-5" />;
      case "attestation":
        return <Shield className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ttu-gray/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ttu-gray/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-ttu-navy hover:text-ttu-navy/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-ttu-navy">
                Track Requests
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                  alt="TTU Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="text-sm font-medium text-ttu-navy">
                TTU DocPortal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by request ID, document type, or subtype..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-semibold">
                    {requests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-xl font-semibold">
                    {requests.filter((r) => r.status === "processing").length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-semibold">
                    {
                      requests.filter(
                        (r) => r.status === "completed" || r.status === "ready",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unpaid</p>
                  <p className="text-xl font-semibold">
                    {requests.filter((r) => !r.isPaid).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "No requests match your search criteria"
                  : "You haven't submitted any document requests yet"}
              </p>
              <Link to="/new-request">
                <Button>Submit New Request</Button>
              </Link>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      {getDocumentIcon(request.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {request.subType}
                        </h3>
                        {getStatusBadge(request.status)}
                        {!request.isPaid && (
                          <Badge className="bg-red-100 text-red-800">
                            <CreditCard className="w-3 h-3 mr-1" />
                            Payment Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Request ID: {request.id}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Amount:</span>
                          GHS {request.amount}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Delivery:</span>
                          {request.deliveryMethod}
                        </div>
                      </div>
                      {request.adminNotes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Admin Notes:</strong> {request.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {!request.isPaid ? (
                      <Button
                        onClick={() => handlePayment(request.id)}
                        className="bg-ttu-gold hover:bg-ttu-gold/90"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    ) : (
                      <>
                        {(request.status === "completed" ||
                          request.status === "ready") && (
                          <>
                            <Button
                              onClick={() => handleDownload(request.id)}
                              className="bg-success hover:bg-success/90"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button
                              onClick={() => handlePreview(request.id)}
                              variant="outline"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
