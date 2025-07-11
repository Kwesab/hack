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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DocumentRequest {
  id: string;
  type: "transcript" | "certificate" | "attestation";
  subType: string;
  status: "pending" | "processing" | "ready" | "completed" | "rejected";
  deliveryMethod: "digital" | "physical" | "both";
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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

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

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((request) => request.status === filterStatus);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, filterStatus]);

  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your requests",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/requests", {
        headers: {
          "X-User-Id": userId,
        },
      });

      const result = await response.json();

      if (result.success) {
        setRequests(result.requests);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Fetch requests error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "bg-warning/10 text-warning",
        icon: Clock,
        label: "Pending",
      },
      processing: {
        color: "bg-info/10 text-info",
        icon: RefreshCw,
        label: "Processing",
      },
      ready: {
        color: "bg-ttu-gold/10 text-ttu-gold",
        icon: Package,
        label: "Ready",
      },
      completed: {
        color: "bg-success/10 text-success",
        icon: CheckCircle,
        label: "Completed",
      },
      rejected: {
        color: "bg-destructive/10 text-destructive",
        icon: AlertCircle,
        label: "Needs Attention",
      },
    };

    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "transcript":
        return FileText;
      case "certificate":
        return Award;
      case "attestation":
        return Shield;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getExpectedCompletion = (createdAt: string, status: string) => {
    const created = new Date(createdAt);
    const expected = new Date(created.getTime() + 48 * 60 * 60 * 1000); // 48 hours

    if (status === "completed") return "Completed";
    if (status === "ready") return "Ready for collection";

    return `Expected: ${formatDate(expected.toISOString())}`;
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
              <h1 className="text-xl font-bold text-ttu-navy">
                Track Requests
              </h1>
              <p className="text-xs text-muted-foreground">TTU DocPortal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-ttu-navy">Your Requests</h1>
          <p className="text-muted-foreground">
            Track and manage your document requests
          </p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by request ID, document type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "ready", label: "Ready" },
                  { value: "completed", label: "Completed" },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={
                      filterStatus === filter.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterStatus(filter.value)}
                    className={
                      filterStatus === filter.value
                        ? "bg-ttu-navy hover:bg-ttu-navy/90"
                        : ""
                    }
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    {searchTerm || filterStatus !== "all"
                      ? "No matching requests"
                      : "No requests yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start by creating your first document request"}
                  </p>
                </div>
                {!searchTerm && filterStatus === "all" && (
                  <Link to="/new-request">
                    <Button className="bg-ttu-navy hover:bg-ttu-navy/90">
                      Create New Request
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const DocumentIcon = getDocumentIcon(request.type);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={request.id}
                  className="hover:shadow-elevation-2 transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-ttu-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <DocumentIcon className="h-6 w-6 text-ttu-navy" />
                        </div>

                        <div className="space-y-3 flex-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {request.subType}
                              </h3>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Request ID:{" "}
                              <span className="font-mono">{request.id}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="text-muted-foreground">
                                Delivery Method
                              </p>
                              <p className="font-medium capitalize">
                                {request.deliveryMethod}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Amount</p>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  GHS {request.amount}
                                </p>
                                {request.isPaid ? (
                                  <Badge className="bg-success/10 text-success">
                                    Paid
                                  </Badge>
                                ) : (
                                  <Badge className="bg-warning/10 text-warning">
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">
                                Requested On
                              </p>
                              <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(request.createdAt)}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-muted-foreground">Status</p>
                              <p className="font-medium">
                                {getExpectedCompletion(
                                  request.createdAt,
                                  request.status,
                                )}
                              </p>
                            </div>
                          </div>

                          {request.adminNotes && (
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm font-medium mb-1">
                                Admin Notes:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {request.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {request.status === "completed" && (
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}

                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <Button
            onClick={fetchRequests}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Requests
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
