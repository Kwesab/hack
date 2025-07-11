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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  Settings,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  PenTool,
  Download,
  LogOut,
  Bell,
  User,
  Activity,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DocumentRequest {
  id: string;
  userId: string;
  userDepartment: string;
  type: "transcript" | "certificate" | "attestation";
  subType?: string;
  status: string;
  deliveryMethod: string;
  deliveryAddress?: string;
  amount: number;
  isPaid: boolean;
  paymentMethod?: string;
  paymentReference?: string;
  documents: string[];
  notes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  hodSignature?: string;
  hodId?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export default function HODDashboard() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<DocumentRequest | null>(null);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [signature, setSignature] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hodInfo, setHodInfo] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchHODData();
    fetchDepartmentRequests();
  }, []);

  const fetchHODData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          "X-User-Id": userId,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setHodInfo(result.user);
      }
    } catch (error) {
      console.error("Error fetching HOD data:", error);
    }
  };

  const fetchDepartmentRequests = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/requests/department", {
        headers: {
          "X-User-Id": userId,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setRequests(result.requests || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch department requests",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRequest = async (request: DocumentRequest) => {
    if (!signature.trim()) {
      toast({
        title: "Signature Required",
        description:
          "Please provide your digital signature to confirm the request",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/requests/${request.id}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId!,
        },
        body: JSON.stringify({
          signature,
          hodId: userId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Request Confirmed",
          description:
            "The document request has been confirmed and will be processed",
        });
        setIsSignatureDialogOpen(false);
        setSignature("");
        setSelectedRequest(null);
        fetchDepartmentRequests();
      } else {
        const result = await response.json();
        toast({
          title: "Error",
          description: result.message || "Failed to confirm request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error confirming request:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async (request: DocumentRequest) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejecting the request",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/requests/${request.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId!,
        },
        body: JSON.stringify({
          rejectionReason,
          hodId: userId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Request Rejected",
          description:
            "The document request has been rejected and the student will be notified",
        });
        setIsRejectionDialogOpen(false);
        setRejectionReason("");
        setSelectedRequest(null);
        fetchDepartmentRequests();
      } else {
        const result = await response.json();
        toast({
          title: "Error",
          description: result.message || "Failed to reject request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const pendingRequests = filteredRequests.filter(
    (r) => r.status === "processing" && r.isPaid,
  );
  const reviewedRequests = filteredRequests.filter((r) =>
    ["confirmed", "rejected"].includes(r.status),
  );

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      confirmed: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      completed: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Activity className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                    alt="TTU Logo"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    HOD Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    {hodInfo?.department} Department
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {hodInfo?.name}
                  </p>
                  <p className="text-xs text-gray-500">Head of Department</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome, {hodInfo?.name}
            </h2>
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Review and approve document requests from your department
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Review
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingRequests.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {requests.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "confirmed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "rejected").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">
              Requests Awaiting Review
            </AlertTitle>
            <AlertDescription className="text-orange-700">
              You have {pendingRequests.length} document request
              {pendingRequests.length === 1 ? "" : "s"} that require your
              approval.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Request Management
            </CardTitle>
            <CardDescription className="text-gray-600">
              Review and approve document requests from {hodInfo?.department}{" "}
              department students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by student name, email, document type, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchDepartmentRequests}
                className="h-12 px-6"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests Table */}
        {pendingRequests.length > 0 && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Pending Approval ({pendingRequests.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                These requests require your review and approval
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Student</TableHead>
                      <TableHead className="font-semibold">
                        Document Type
                      </TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Delivery</TableHead>
                      <TableHead className="font-semibold">Requested</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {request.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.userEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium capitalize text-gray-900">
                              {request.type}
                            </div>
                            {request.subType && (
                              <div className="text-sm text-gray-500">
                                {request.subType}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            GH₵{request.amount} (Paid)
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="capitalize font-medium text-gray-900">
                              {request.deliveryMethod.replace("_", " ")}
                            </div>
                            {request.deliveryAddress && (
                              <div className="text-gray-500 truncate max-w-32">
                                {request.deliveryAddress}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Request Details</DialogTitle>
                                  <DialogDescription>
                                    Review the complete request information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Student Name
                                        </Label>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                          {selectedRequest.userName}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Email
                                        </Label>
                                        <p className="text-sm text-gray-900 mt-1">
                                          {selectedRequest.userEmail}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Document Type
                                        </Label>
                                        <p className="text-sm capitalize text-gray-900 mt-1">
                                          {selectedRequest.type}
                                          {selectedRequest.subType &&
                                            ` - ${selectedRequest.subType}`}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Delivery Method
                                        </Label>
                                        <p className="text-sm capitalize text-gray-900 mt-1">
                                          {selectedRequest.deliveryMethod.replace(
                                            "_",
                                            " ",
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Amount
                                        </Label>
                                        <p className="text-sm text-gray-900 mt-1">
                                          GH₵{selectedRequest.amount}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Payment Status
                                        </Label>
                                        <Badge
                                          className={
                                            selectedRequest.isPaid
                                              ? "bg-green-50 text-green-700 border-green-200"
                                              : "bg-red-50 text-red-700 border-red-200"
                                          }
                                        >
                                          {selectedRequest.isPaid
                                            ? "Paid"
                                            : "Unpaid"}
                                        </Badge>
                                      </div>
                                    </div>
                                    {selectedRequest.notes && (
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Student Notes
                                        </Label>
                                        <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">
                                          {selectedRequest.notes}
                                        </p>
                                      </div>
                                    )}
                                    {selectedRequest.deliveryAddress && (
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                          Delivery Address
                                        </Label>
                                        <p className="text-sm text-gray-900 mt-1">
                                          {selectedRequest.deliveryAddress}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <DialogFooter className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsRejectionDialogOpen(true);
                                    }}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setIsSignatureDialogOpen(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Requests Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">
              All Department Requests
            </CardTitle>
            <CardDescription className="text-gray-600">
              Complete history of document requests from your department
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Student</TableHead>
                      <TableHead className="font-semibold">Document</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {request.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.userEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium capitalize text-gray-900">
                              {request.type}
                            </div>
                            {request.subType && (
                              <div className="text-sm text-gray-500">
                                {request.subType}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              <span className="capitalize">
                                {request.status.replace("_", " ")}
                              </span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              GH₵{request.amount}
                            </div>
                            <div
                              className={`text-xs ${request.isPaid ? "text-green-600" : "text-red-600"}`}
                            >
                              {request.isPaid ? "Paid" : "Unpaid"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            <div>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                            {request.reviewedAt && (
                              <div className="text-xs text-gray-400">
                                Reviewed:{" "}
                                {new Date(
                                  request.reviewedAt,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Digital Signature Dialog */}
      <Dialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Digital Signature Required</DialogTitle>
            <DialogDescription>
              Please provide your digital signature to confirm this document
              request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signature" className="text-sm font-medium">
                Digital Signature
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <PenTool className="h-4 w-4 text-gray-500" />
                <Input
                  id="signature"
                  placeholder="Type your full name as digital signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your digital signature will be applied to the document
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSignatureDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedRequest && handleConfirmRequest(selectedRequest)
              }
              disabled={isProcessing || !signature.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={isRejectionDialogOpen}
        onOpenChange={setIsRejectionDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason" className="text-sm font-medium">
                Rejection Reason
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be sent to the student via email
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedRequest && handleRejectRequest(selectedRequest)
              }
              disabled={isProcessing || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
