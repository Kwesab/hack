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
import {
  GraduationCap,
  FileText,
  Upload,
  CreditCard,
  Eye,
  Settings,
  Bell,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import NotificationCenter from "@/components/NotificationCenter";

export default function RobustDashboard() {
  const [userName, setUserName] = useState("User");
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if user is authenticated
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }

        // Get user name
        const storedName = localStorage.getItem("userName");
        if (storedName && storedName !== "New User") {
          setUserName(storedName);
        }

        // Fetch recent requests with robust error handling
        await fetchRecentRequestsSafely();
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const fetchRecentRequestsSafely = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.log("No userId found, skipping requests fetch");
        return;
      }

      console.log("Fetching requests for userId:", userId);

      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 8000); // 8 second timeout

      const response = await fetch("/api/requests", {
        headers: {
          "X-User-Id": userId,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Requests response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Requests API error:", response.status, errorText);
        // Don't throw error for 401/404, just set empty requests
        if (response.status === 401 || response.status === 404) {
          setRecentRequests([]);
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Requests result:", result);

      if (result.success) {
        // Ensure result.requests is an array before calling slice
        const requests = Array.isArray(result.requests) ? result.requests : [];
        setRecentRequests(requests.slice(0, 2));
      } else {
        console.error("Requests API returned error:", result.message);
        setRecentRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);

      if (error.name === "AbortError") {
        toast({
          title: "Request Timeout",
          description: "Failed to load recent requests due to network timeout",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Network Error",
          description:
            "Unable to load recent requests. Please try again later.",
          variant: "destructive",
        });
      }

      // Always set empty array on error to prevent UI from breaking
      setRecentRequests([]);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ttu-gray/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ttu-gray/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Dashboard Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
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
              <h1 className="text-xl font-bold text-ttu-navy">TTU DocPortal</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-ttu-navy">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your academic document requests from your dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/new-request">
            <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">New Request</CardTitle>
                <CardDescription>
                  Request transcripts, certificates, or attestations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-ttu-navy hover:bg-ttu-navy/90">
                  Start New Request
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/upload-documents">
            <Card className="hover:shadow-elevation-2 transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-info" />
                </div>
                <CardTitle className="text-lg">Upload Documents</CardTitle>
                <CardDescription>
                  Upload Ghana Card and supporting documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Upload Ghana Card
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/track-requests">
            <Card className="hover:shadow-elevation-2 transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto">
                  <Eye className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-lg">Track Requests</CardTitle>
                <CardDescription>
                  View status of your document requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ttu-navy">
              Recent Requests
            </h2>
            <Link to="/track-requests">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      No recent requests
                    </h3>
                    <p className="text-muted-foreground">
                      Start by creating your first document request
                    </p>
                  </div>
                  <Link to="/new-request">
                    <Button className="bg-ttu-navy hover:bg-ttu-navy/90">
                      Create New Request
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentRequests.map((request: any) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-ttu-navy/10 rounded-xl flex items-center justify-center">
                          <FileText className="h-6 w-6 text-ttu-navy" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{request.subType}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested on{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge
                          className={
                            request.status === "completed"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }
                        >
                          {request.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Account Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verified</span>
                  <Badge className="bg-success/10 text-success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Active</span>
                  <Badge className="bg-success/10 text-success">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-info" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fetchRecentRequestsSafely()}
                >
                  Refresh Requests
                </Button>
                <Link to="/test-otp">
                  <Button variant="outline" size="sm" className="w-full">
                    Debug Tools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
