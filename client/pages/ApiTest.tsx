import { useState } from "react";

export default function ApiTest() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testPing = async () => {
    setLoading(true);
    try {
      console.log("Testing API ping...");
      const response = await fetch("/api/ping");
      console.log("Response:", response);
      const data = await response.json();
      console.log("Data:", data);
      setResult(`✅ API Ping Success: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("API Ping Error:", error);
      setResult(`❌ API Ping Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSendOTP = async () => {
    setLoading(true);
    try {
      console.log("Testing send OTP...");
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: "053 737 0435" }),
      });
      console.log("Response:", response);
      const data = await response.json();
      console.log("Data:", data);
      setResult(`✅ Send OTP Success: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Send OTP Error:", error);
      setResult(`❌ Send OTP Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>

        <div className="space-y-4">
          <button
            onClick={testPing}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test API Ping"}
          </button>

          <button
            onClick={testSendOTP}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-4"
          >
            {loading ? "Testing..." : "Test Send OTP"}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <h2 className="font-bold mb-2">Result:</h2>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
