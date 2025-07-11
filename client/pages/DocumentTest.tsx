import React, { useState } from "react";
import {
  AlertCircle,
  Download,
  Eye,
  FileText,
  Award,
  CheckCircle,
} from "lucide-react";

const DocumentTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  // Test users with different departments
  const testUsers = [
    {
      id: "student_cs_001",
      name: "John Doe",
      studentId: "TTU/CS/2020/001",
      department: "Computer Science",
    },
    {
      id: "student_ee_002",
      name: "Sarah Mensah",
      studentId: "TTU/EE/2019/005",
      department: "Electrical Engineering",
    },
    {
      id: "student_me_003",
      name: "Kwame Osei",
      studentId: "TTU/ME/2021/006",
      department: "Mechanical Engineering",
    },
  ];

  const documentTypes = [
    { type: "transcript", name: "Academic Transcript", icon: FileText },
    { type: "certificate", name: "Degree Certificate", icon: Award },
    { type: "attestation", name: "Letter of Attestation", icon: CheckCircle },
  ];

  const testDocumentGeneration = async (
    documentType: string,
    studentData: any,
  ) => {
    try {
      setIsLoading(true);

      // Create a test request first
      const requestResponse = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": studentData.id,
        },
        body: JSON.stringify({
          type: documentType,
          subType:
            documentType === "transcript"
              ? "undergraduate"
              : documentType === "certificate"
                ? "degree"
                : "verification",
          deliveryMethod: "digital",
          amount:
            documentType === "transcript"
              ? 50
              : documentType === "certificate"
                ? 30
                : 25,
          isPaid: true, // Mark as paid for testing
          paymentMethod: "paystack",
        }),
      });

      const requestData = await requestResponse.json();

      if (!requestData.success) {
        throw new Error(requestData.message);
      }

      // Mark request as completed so we can generate document
      await fetch(`/api/admin/requests/${requestData.data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "admin_123", // Admin user
        },
        body: JSON.stringify({
          status: "completed",
        }),
      });

      // Test document generation
      const generateResponse = await fetch(
        `/api/documents/generate/${requestData.data.id}`,
        {
          method: "GET",
          headers: {
            "x-user-id": studentData.id,
          },
        },
      );

      const result = {
        user: studentData,
        documentType,
        requestId: requestData.data.id,
        success: generateResponse.ok,
        error: generateResponse.ok ? null : await generateResponse.text(),
        downloadUrl: generateResponse.ok
          ? `/api/documents/download/${requestData.data.id}`
          : null,
        previewUrl: generateResponse.ok
          ? `/api/documents/preview/${requestData.data.id}`
          : null,
        timestamp: new Date().toLocaleString(),
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error) {
      const result = {
        user: studentData,
        documentType,
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleString(),
      };
      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    for (const user of testUsers) {
      for (const docType of documentTypes) {
        await testDocumentGeneration(docType.type, user);
        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Generation Test Suite
            </h1>
            <p className="text-gray-600">
              Test the enhanced document generation system with real user data
            </p>
          </div>

          {/* Test Controls */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Test User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a user...</option>
                  {testUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.studentId}) - {user.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={runAllTests}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Run All Tests
              </button>

              {selectedUser &&
                documentTypes.map((docType) => {
                  const user = testUsers.find((u) => u.id === selectedUser);
                  const Icon = docType.icon;
                  return (
                    <button
                      key={docType.type}
                      onClick={() => testDocumentGeneration(docType.type, user)}
                      disabled={isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      Test {docType.name}
                    </button>
                  );
                })}

              <button
                onClick={() => setTestResults([])}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No test results yet. Run some tests to see results here.
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      result.success
                        ? "bg-green-50 border-green-500"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          {result.documentType.charAt(0).toUpperCase() +
                            result.documentType.slice(1)}{" "}
                          - {result.user.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {result.timestamp}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Student:</span>{" "}
                      {result.user.studentId} ({result.user.department})
                    </div>

                    {result.success ? (
                      <div className="flex gap-2">
                        <a
                          href={result.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </a>
                        <a
                          href={result.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Preview
                        </a>
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        <span className="font-medium">Error:</span>{" "}
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Tested */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Features Being Tested
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Document Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Academic Transcripts with real course data</li>
                  <li>��� Degree Certificates with proper titles</li>
                  <li>• Letters of Attestation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Generation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Department-specific course listings</li>
                  <li>• Calculated graduation dates</li>
                  <li>• Realistic GPA generation</li>
                  <li>• Proper degree title mapping</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTest;
