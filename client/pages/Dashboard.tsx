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

export default function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [recentRequests, setRecentRequests] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

    // Fetch recent requests
    fetchRecentRequests();
  }, [navigate]);

  const fetchRecentRequests = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/requests", {
        headers: {
          "X-User-Id": userId!,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setRecentRequests(result.requests.slice(0, 2)); // Show only 2 recent
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    navigate("/login");
  };

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

          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ttu-navy/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-ttu-navy" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Official Transcript</h3>
                      <p className="text-sm text-muted-foreground">
                        Bachelor of Technology - Computer Science
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested on Dec 20, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="bg-warning/10 text-warning">
                      <Clock className="h-3 w-3 mr-1" />
                      Processing
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Expected: Dec 22, 2024
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-success" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">Degree Certificate</h3>
                      <p className="text-sm text-muted-foreground">
                        Bachelor of Technology - Computer Science
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested on Dec 15, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className="bg-success/10 text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Delivered: Dec 18, 2024
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Account Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ghana Card</span>
                  <Badge className="bg-success/10 text-success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Number</span>
                  <Badge className="bg-success/10 text-success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Academic Records</span>
                  <Badge className="bg-success/10 text-success">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-info" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobile Money</span>
                  <Badge className="bg-ttu-gold/10 text-ttu-gold">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Card Payment</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Payment Methods
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Future Features */}
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-muted-foreground">
                More Features Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Additional features like request form, payment processing, admin
                dashboard, and status tracking are being developed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
