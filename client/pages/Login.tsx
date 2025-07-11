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
} from "lucide-react";
import { cn } from "@/lib/utils";

type AuthStep = "phone" | "otp" | "password" | "success";

export default function Login() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
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
        alert(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store user info
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userPhone", result.user.phone);

        if (result.requiresPassword) {
          setStep("password");
        } else {
          setStep("success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } else {
        alert(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store user info
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userPhone", result.user.phone);
        localStorage.setItem("userName", result.user.name);

        setStep("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

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
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-ttu-navy to-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
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
              {step !== "phone" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (step === "otp") setStep("phone");
                    if (step === "password") setStep("otp");
                    if (step === "success") setStep("password");
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
                      step === "phone" ? "bg-primary" : "bg-primary/20",
                    )}
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      step === "otp" ||
                        step === "password" ||
                        step === "success"
                        ? "bg-primary"
                        : "bg-primary/20",
                    )}
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      step === "password" || step === "success"
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

            {step === "phone" && (
              <>
                <CardTitle className="text-ttu-navy">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription>
                  Enter your phone number to receive a verification code
                </CardDescription>
              </>
            )}

            {step === "otp" && (
              <>
                <CardTitle className="text-ttu-navy">
                  Verify Your Phone
                </CardTitle>
                <CardDescription>
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-ttu-navy">
                    {phoneNumber}
                  </span>
                </CardDescription>
              </>
            )}

            {step === "password" && (
              <>
                <CardTitle className="text-ttu-navy">Enter Password</CardTitle>
                <CardDescription>
                  Enter your password to complete sign in
                </CardDescription>
              </>
            )}

            {step === "success" && (
              <>
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-success">Welcome Back!</CardTitle>
                <CardDescription>
                  You have successfully signed in to your account
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">🇬🇭</span>
                      <span className="text-sm text-muted-foreground">
                        +233
                      </span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="50 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-20"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a verification code to this number
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-ttu-navy hover:bg-ttu-navy/90"
                    disabled={isLoading || !phoneNumber}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Smartphone className="mr-2 h-4 w-4" />
                        Send Verification Code
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="text-primary hover:underline font-medium"
                      >
                        Contact TTU Registrar
                      </a>
                    </p>
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
                    Your phone number is used for identity verification and
                    secure access to your academic records.
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

            {step === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
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
                    disabled={isLoading || !password}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
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
              </form>
            )}

            {step === "success" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Badge className="bg-success/10 text-success">
                    Authentication Complete
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your dashboard...
                  </p>
                </div>

                <Button
                  className="w-full bg-success hover:bg-success/90"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  Continue to Dashboard
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
