import { useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  GraduationCap,
  Smartphone,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AuthStep = "credentials" | "otp" | "success";

export default function NewLogin() {
  const [step, setStep] = useState<AuthStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userPhone, setUserPhone] = useState("");
  const [nextStep, setNextStep] = useState<any>(null);
  const navigate = useNavigate();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (result.success) {
        setUserPhone(result.data.maskedPhone);
        setStep("otp");
        setCountdown(60);

        // Start countdown
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (result.success) {
        // Store user info
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userRole", result.user.role);

        setNextStep(result.nextStep);
        setStep("success");

        setTimeout(() => {
          navigate(result.nextStep.route);
        }, 2000);
      } else {
        alert(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (result.success) {
        setCountdown(60);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert(error.message || "Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
                TTU DocPortal
              </h1>
              <p className="text-sm text-muted-foreground">
                Secure Document Access
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-elevation-3 border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              {step !== "credentials" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (step === "otp") setStep("credentials");
                    if (step === "success") setStep("otp");
                  }}
                  className="absolute left-6 top-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      step === "credentials" ? "bg-primary" : "bg-primary/20",
                    )}
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      step === "otp" || step === "success"
                        ? "bg-primary"
                        : "bg-primary/20",
                    )}
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      step === "success" ? "bg-success" : "bg-primary/20",
                    )}
                  />
                </div>
              </div>
            </div>

            {step === "credentials" && (
              <>
                <CardTitle className="text-ttu-navy">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription>
                  Enter your TTU email and password to continue
                </CardDescription>
              </>
            )}

            {step === "otp" && (
              <>
                <CardTitle className="text-ttu-navy">
                  Verify Your Identity
                </CardTitle>
                <CardDescription>
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-ttu-navy">{userPhone}</span>
                </CardDescription>
              </>
            )}

            {step === "success" && (
              <>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-success">Welcome!</CardTitle>
                <CardDescription>
                  {nextStep?.message || "Authentication successful"}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "credentials" && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@ttu.edu.gh"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-ttu-navy hover:bg-ttu-navy/90"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div className="bg-ttu-light-blue/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-ttu-navy" />
                    <span className="text-sm font-medium text-ttu-navy">
                      Secure Authentication
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your credentials are verified, then an OTP is sent to your
                    registered phone for additional security.
                  </p>
                </div>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      className="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend code in{" "}
                        <span className="font-medium text-ttu-navy">
                          {countdown}s
                        </span>
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant="link"
                        onClick={resendOtp}
                        className="text-primary p-0 h-auto"
                      >
                        Resend verification code
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-ttu-navy hover:bg-ttu-navy/90"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="bg-info/10 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-info" />
                    <span className="text-sm font-medium text-info">
                      Didn't receive the code?
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Check your messages or try resending. The code expires in 10
                    minutes.
                  </p>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Badge className="bg-success/10 text-success">
                    Authentication Complete
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {nextStep?.message || "Redirecting..."}
                  </p>
                </div>

                <Button
                  className="w-full bg-success hover:bg-success/90"
                  onClick={() => {
                    navigate(nextStep?.route || "/dashboard");
                  }}
                >
                  Continue
                </Button>

                <div className="bg-success/10 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      Secure Session Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your session is encrypted and will automatically expire for
                    security.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-muted-foreground">
            Having trouble signing in?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 Takoradi Technical University
          </p>
        </div>
      </div>
    </div>
  );
}
