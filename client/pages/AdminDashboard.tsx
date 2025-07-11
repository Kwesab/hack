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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  GraduationCap,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Settings,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  X,
  Check,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DocumentRequest {
  id: string;
  userId: string;
  type: "transcript" | "certificate" | "attestation";
  subType: string;
  status: "pending" | "processing" | "ready" | "completed" | "rejected";
  deliveryMethod: "digital" | "physical" | "both";
  amount: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    phone: string;
    email?: string;
    studentId?: string;
  };
  adminNotes?: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  studentId?: string;
  isVerified: boolean;
  ghanaCard?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] =
    useState<DocumentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all requests
      const requestsResponse = await fetch("/api/admin/requests");

      if (!requestsResponse.ok) {
        throw new Error(`HTTP error! status: ${requestsResponse.status}`);
      }

      const requestsResult = await requestsResponse.json();

      if (requestsResult.success) {
        setRequests(requestsResult.requests);
      }

      // Simulate fetching users with pending Ghana Card verifications
      const mockPendingUsers: User[] = [
        {
          id: "user_1",
          name: "John Doe",
          phone: "233501234567",
          email: "john.doe@student.ttu.edu.gh",
          studentId: "TTU/CS/2020/001",
          isVerified: false,
          ghanaCard: {
            number: "GHA-123456789-0",
            imageUrl: "/uploads/ghana-card-1.jpg",
            verified: false,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "user_2",
          name: "Jane Smith",
          phone: "233241234567",
          email: "jane.smith@student.ttu.edu.gh",
          studentId: "TTU/EE/2021/045",
          isVerified: false,
          ghanaCard: {
            number: "GHA-987654321-1",
            imageUrl: "/uploads/ghana-card-2.jpg",
            verified: false,
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      setPendingVerifications(mockPendingUsers);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: string,
    notes?: string,
  ) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/requests/${requestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          adminNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? { ...req, status: status as any, adminNotes: notes }
              : req,
          ),
        );

        toast({
          title: "Status Updated",
          description: `Request status changed to ${status}`,
        });

        setSelectedRequest(null);
        setAdminNotes("");
        setNewStatus("");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const verifyGhanaCard = async (userId: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/admin/verify-ghana-card/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verified }),
      });

      const result = await response.json();

      if (result.success) {
        setPendingVerifications((prev) =>
          prev.filter((user) => user.id !== userId),
        );

        toast({
          title: verified ? "Ghana Card Verified" : "Ghana Card Rejected",
          description: `Ghana Card has been ${verified ? "approved" : "rejected"}`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Verify Ghana Card error:", error);
      toast({
        title: "Error",
        description: "Failed to update Ghana Card verification",
        variant: "destructive",
      });
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.studentId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "bg-warning/10 text-warning", icon: Clock },
      processing: { color: "bg-info/10 text-info", icon: RefreshCw },
      ready: { color: "bg-ttu-gold/10 text-ttu-gold", icon: CheckCircle },
      completed: { color: "bg-success/10 text-success", icon: CheckCircle },
      rejected: {
        color: "bg-destructive/10 text-destructive",
        icon: AlertCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const processing = requests.filter((r) => r.status === "processing").length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const revenue = requests
      .filter((r) => r.isPaid)
      .reduce((sum, r) => sum + r.amount, 0);

    return { total, pending, processing, completed, revenue };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ttu-gray/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
            <div className="w-10 h-10 bg-gradient-to-br from-ttu-navy to-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ttu-navy">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">TTU DocPortal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-ttu-gold/10 text-ttu-gold">
              Administrator
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Welcome */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-ttu-navy">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage document requests and user verifications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Requests
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.processing}</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ttu-gold/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-ttu-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">GHS {stats.revenue}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Document Requests</TabsTrigger>
            <TabsTrigger value="verifications">
              Ghana Card Verifications
              {pendingVerifications.length > 0 && (
                <Badge className="ml-2 bg-warning/10 text-warning">
                  {pendingVerifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Document Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by request ID, student name, or student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={fetchData} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
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
                            <FileText className="h-6 w-6 text-ttu-navy" />
                          </div>

                          <div className="space-y-3 flex-1">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {request.subType}
                                </h3>
                                <Badge className={statusConfig.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {request.status}
                                </Badge>
                                {request.isPaid && (
                                  <Badge className="bg-success/10 text-success">
                                    Paid
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                ID:{" "}
                                <span className="font-mono">{request.id}</span>
                              </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="space-y-1">
                                <p className="text-muted-foreground">Student</p>
                                <p className="font-medium">
                                  {request.user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {request.user?.studentId}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-muted-foreground">Contact</p>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <p className="text-xs">
                                    {request.user?.phone}
                                  </p>
                                </div>
                                {request.user?.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <p className="text-xs">
                                      {request.user?.email}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1">
                                <p className="text-muted-foreground">Amount</p>
                                <p className="font-medium">
                                  GHS {request.amount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {request.deliveryMethod}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-muted-foreground">
                                  Requested
                                </p>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <p className="text-xs">
                                    {new Date(
                                      request.createdAt,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setNewStatus(request.status);
                                  setAdminNotes(request.adminNotes || "");
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Request</DialogTitle>
                                <DialogDescription>
                                  Update status and add admin notes for request{" "}
                                  {selectedRequest?.id}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Current Status</Label>
                                    <Select
                                      value={newStatus}
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="processing">
                                          Processing
                                        </SelectItem>
                                        <SelectItem value="ready">
                                          Ready
                                        </SelectItem>
                                        <SelectItem value="completed">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                          Rejected
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Student Info</Label>
                                    <div className="text-sm space-y-1">
                                      <p className="font-medium">
                                        {selectedRequest?.user?.name}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedRequest?.user?.studentId}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedRequest?.user?.phone}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="adminNotes">
                                    Admin Notes
                                  </Label>
                                  <Textarea
                                    id="adminNotes"
                                    placeholder="Add notes about the request processing..."
                                    value={adminNotes}
                                    onChange={(e) =>
                                      setAdminNotes(e.target.value)
                                    }
                                    rows={4}
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    if (selectedRequest) {
                                      updateRequestStatus(
                                        selectedRequest.id,
                                        newStatus,
                                        adminNotes,
                                      );
                                    }
                                  }}
                                  disabled={isUpdating}
                                  className="bg-ttu-navy hover:bg-ttu-navy/90"
                                >
                                  {isUpdating ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                      Updating...
                                    </>
                                  ) : (
                                    "Update Request"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {request.status === "completed" && (
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Generate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredRequests.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No requests found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "No document requests have been submitted yet"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Ghana Card Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pending Ghana Card Verifications
                </CardTitle>
                <CardDescription>
                  Review and verify submitted Ghana Card documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingVerifications.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Student ID: {user.studentId}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Ghana Card Number
                            </p>
                            <p className="font-mono">
                              {user.ghanaCard?.number}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Contact</p>
                            <p>{user.phone}</p>
                            {user.email && (
                              <p className="text-xs">{user.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className="bg-warning/10 text-warning">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending Verification
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Submitted{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                          onClick={() => verifyGhanaCard(user.id, false)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90"
                          onClick={() => verifyGhanaCard(user.id, true)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">
                        Ghana Card Image Preview
                      </p>
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Image preview not available in demo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.ghanaCard?.imageUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingVerifications.length === 0 && (
                  <div className="text-center py-12">
                    <UserCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      All Caught Up!
                    </h3>
                    <p className="text-muted-foreground">
                      No Ghana Card verifications pending at the moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request Trends</CardTitle>
                  <CardDescription>Document requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center space-y-2">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        Analytics chart would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Documents</CardTitle>
                  <CardDescription>
                    Most requested document types
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Official Transcripts</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Degree Certificates</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-ttu-gold rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">50%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Attestations</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-success rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">33%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Processing efficiency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <p className="text-2xl font-bold text-success">98%</p>
                      <p className="text-sm text-muted-foreground">
                        Success Rate
                      </p>
                    </div>
                    <div className="text-center p-4 bg-info/10 rounded-lg">
                      <p className="text-2xl font-bold text-info">36h</p>
                      <p className="text-sm text-muted-foreground">
                        Avg Processing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                  <CardDescription>
                    Payment and revenue tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-medium">GHS 2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Quarter</span>
                      <span className="font-medium">GHS 7,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">This Year</span>
                      <span className="font-medium">GHS 28,800</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
