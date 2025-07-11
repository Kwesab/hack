import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestOTP() {
  const [phone, setPhone] = useState("233501234567");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testPhoneValidation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testOTPGeneration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testActualOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>OTP Debug Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number:
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={testPhoneValidation}
                disabled={isLoading}
                variant="outline"
              >
                Test Phone Validation
              </Button>
              <Button
                onClick={testOTPGeneration}
                disabled={isLoading}
                variant="outline"
              >
                Test OTP Generation
              </Button>
              <Button
                onClick={testActualOTP}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Test Actual OTP
              </Button>
            </div>

            {result && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Response:
                </label>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {result}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
