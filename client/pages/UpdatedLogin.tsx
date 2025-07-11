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
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AuthStep = "credentials" | "phone" | "otp" | "success";

export default function UpdatedLogin() {
  const [step, setStep] = useState<AuthStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [nextStep, setNextStep] = useState<any>(null);
  const navigate = useNavigate();

  // Verify credentials against database
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Make API call to verify credentials
      const response = await fetch("/api/auth/verify-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        setUserInfo(result.user);
        // Auto-set the phone number from database
        setPhoneNumber(result.user.phone.replace("233", "").replace(/^0/, ""));
        setStep("phone");
      } else {
        alert(result.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Credentials verification error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format the phone number for sending OTP
      const formattedPhone = phoneNumber.startsWith("0")
        ? phoneNumber
        : "0" + phoneNumber;

      // Send OTP using existing endpoint
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

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

        // Show the OTP in development for easy testing
        if (result.otp) {
          console.log(`🔑 OTP for ${formattedPhone}: ${result.otp}`);
        }
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
      // Format the phone number for verification
      const formattedPhone = phoneNumber.startsWith("0")
        ? phoneNumber
        : "0" + phoneNumber;

      // Verify OTP using existing endpoint
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone, otp }),
      });

      const result = await response.json();

      if (result.success) {
        // Store user info from the OTP verification response (which has the correct user ID)
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userEmail", userInfo.email);
        localStorage.setItem("userName", userInfo.name);
        localStorage.setItem("userRole", userInfo.role);

        // Determine next step based on role
        const nextRoute = userInfo.role === "admin" ? "/admin" : "/dashboard";
        setNextStep({
          route: nextRoute,
          message: `Redirecting to ${userInfo.role} dashboard...`,
        });

        setStep("success");

        setTimeout(() => {
          navigate(nextRoute);
        }, 2000);
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
              {step !== "credentials" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (step === "phone") setStep("credentials");
                    if (step === "otp") setStep("phone");
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
                      step === "phone" || step === "otp" || step === "success"
                        ? "bg-primary"
                        : "bg-primary/20",
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

            {step === "phone" && (
              <>
                <CardTitle className="text-ttu-navy">
                  Enter Phone Number
                </CardTitle>
                <CardDescription>
                  Welcome back,{" "}
                  <span className="font-medium text-ttu-navy">
                    {userInfo?.name}
                  </span>
                  ! Enter your phone number for verification
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
                  <span className="font-medium text-ttu-navy">
                    {phoneNumber}
                  </span>
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
                      Continue
                    </>
                  )}
                </Button>

                <div className="bg-ttu-light-blue/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-ttu-navy" />
                    <span className="text-sm font-medium text-ttu-navy">
                      Test Credentials
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <strong>Admin:</strong> admin@ttu.edu.gh / admin123
                    </p>
                    <p>
                      <strong>Students:</strong> john.doe@student.ttu.edu.gh,
                      test.student@student.ttu.edu.gh / student123
                    </p>
                  </div>
                </div>
              </form>
            )}

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
                    Phone number auto-filled from your account
                  </p>
                </div>

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
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
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
                    <p className="text-xs text-muted-foreground">
                      OTP sent to your phone number
                    </p>
                  )}
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
                    "Complete Sign In"
                  )}
                </Button>
              </form>
            )}

            {step === "success" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Badge className="bg-success/10 text-success">
                    Authentication Complete
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to {userInfo?.role} dashboard...
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
