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
  GraduationCap,
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
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
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
                  <p className="text-sm text-gray-600">
                    {hodInfo?.department} Department
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                {hodInfo?.name}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                Requests awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">
                From your department
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground">Declined requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Management</CardTitle>
            <CardDescription>
              Review and approve document requests from {hodInfo?.department}{" "}
              department students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by student name, email, document type, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={fetchDepartmentRequests}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests Table */}
        {pendingRequests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Approval ({pendingRequests.length})
              </CardTitle>
              <CardDescription>
                These requests require your review and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-gray-500">
                            {request.userEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium capitalize">
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
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700"
                        >
                          GH₵{request.amount} (Paid)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="capitalize">
                            {request.deliveryMethod}
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
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Student Name</Label>
                                      <p className="text-sm font-medium">
                                        {selectedRequest.userName}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm">
                                        {selectedRequest.userEmail}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Document Type</Label>
                                      <p className="text-sm capitalize">
                                        {selectedRequest.type}
                                        {selectedRequest.subType &&
                                          ` - ${selectedRequest.subType}`}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Delivery Method</Label>
                                      <p className="text-sm capitalize">
                                        {selectedRequest.deliveryMethod}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Amount</Label>
                                      <p className="text-sm">
                                        GH₵{selectedRequest.amount}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Payment Status</Label>
                                      <Badge
                                        variant={
                                          selectedRequest.isPaid
                                            ? "default"
                                            : "destructive"
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
                                      <Label>Student Notes</Label>
                                      <p className="text-sm bg-gray-50 p-3 rounded">
                                        {selectedRequest.notes}
                                      </p>
                                    </div>
                                  )}
                                  {selectedRequest.deliveryAddress && (
                                    <div>
                                      <Label>Delivery Address</Label>
                                      <p className="text-sm">
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
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => {
                                    setIsSignatureDialogOpen(true);
                                  }}
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
            </CardContent>
          </Card>
        )}

        {/* All Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Department Requests</CardTitle>
            <CardDescription>
              Complete history of document requests from your department
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No requests found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-gray-500">
                            {request.userEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium capitalize">
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
                          {request.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          GH₵{request.amount}
                          <div
                            className={`text-xs ${request.isPaid ? "text-green-600" : "text-red-600"}`}
                          >
                            {request.isPaid ? "Paid" : "Unpaid"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                          {request.reviewedAt && (
                            <div className="text-xs">
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Digital Signature Dialog */}
      <Dialog
        open={isSignatureDialogOpen}
        onOpenChange={setIsSignatureDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Signature Required</DialogTitle>
            <DialogDescription>
              Please provide your digital signature to confirm this document
              request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signature">Digital Signature</Label>
              <div className="flex items-center space-x-2">
                <PenTool className="h-4 w-4 text-gray-500" />
                <Input
                  id="signature"
                  placeholder="Type your full name as digital signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
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
