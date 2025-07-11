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
  Smartphone,
  Shield,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Sparkles,
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      if (error.message.includes("HTTP error")) {
        alert("Server error. Please try again.");
      } else {
        alert("Network error. Please try again.");
      }
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
        setCountdown(30);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store user info from the credentials verification (userInfo has the correct database user ID)
        localStorage.setItem("userId", userInfo.id);
        localStorage.setItem("userEmail", userInfo.email);
        localStorage.setItem("userName", userInfo.name);
        localStorage.setItem("userRole", userInfo.role);

        // Determine next step based on role
        let nextRoute = "/dashboard";
        let roleName = "student";

        if (userInfo.role === "admin") {
          nextRoute = "/admin";
          roleName = "admin";
        } else if (userInfo.role === "hod") {
          nextRoute = "/hod";
          roleName = "HOD";
        }

        setNextStep({
          route: nextRoute,
          message: `Redirecting to ${roleName} dashboard...`,
        });

        setStep("success");

        setTimeout(() => {
          navigate(nextRoute);
        }, 2000);
      } else {
        alert(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.message.includes("HTTP error")) {
        alert("Server error. Please try again.");
      } else {
        alert("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stepInfo = {
    credentials: {
      title: "Welcome Back",
      subtitle: "Sign in to access your documents",
      step: 1,
    },
    phone: {
      title: "Verify Phone Number",
      subtitle: "We'll send a verification code to your phone",
      step: 2,
    },
    otp: {
      title: "Enter Verification Code",
      subtitle: `Code sent to ${phoneNumber}`,
      step: 3,
    },
    success: {
      title: "Login Successful!",
      subtitle: nextStep?.message || "Redirecting...",
      step: 4,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-400/10 to-orange-600/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                  alt="TTU Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              TTU DocPortal
            </h1>
            <p className="text-gray-600 font-medium">
              Takoradi Technical University
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl shadow-blue-500/10 bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    stepInfo[step].step >= num
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "bg-gray-200",
                  )}
                />
              ))}
            </div>

            {/* Back Button */}
            {step !== "credentials" && step !== "success" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (step === "phone") setStep("credentials");
                  if (step === "otp") setStep("phone");
                }}
                className="absolute left-6 top-6 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {stepInfo[step].title}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {stepInfo[step].subtitle}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Credentials Step */}
            {step === "credentials" && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@ttu.edu.gh"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            )}

            {/* Phone Step */}
            {step === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0XX XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    We'll send a verification code to this number
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 text-center block">
                    Enter 6-digit verification code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      className="gap-2"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="w-12 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-12 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-12 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                        <InputOTPSlot
                          index={3}
                          className="w-12 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                        <InputOTPSlot
                          index={4}
                          className="w-12 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                        <InputOTPSlot
                          index={5}
                          className="w-12 h-12 text-lg font-semibold border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {countdown > 0 && (
                    <p className="text-center text-sm text-gray-500">
                      Resend code in {countdown}s
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>
              </form>
            )}

            {/* Success Step */}
            {step === "success" && (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Welcome back, {userInfo?.name}!
                  </h3>
                  <p className="text-gray-600">{nextStep?.message}</p>
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(nextStep?.route || "/dashboard")}
                >
                  Continue to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Ghana Card Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
