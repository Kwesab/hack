import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UseCaseDiagram: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TTU DocPortal - Use Case Diagram
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive view of system actors and their interactions
          </p>
        </div>

        {/* Visual Use Case Diagram */}
        <Card className="mb-8 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Visual Use Case Diagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[800px] bg-gray-50 rounded-lg overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1200 800"
                className="absolute inset-0"
              >
                {/* System Boundary */}
                <rect
                  x="200"
                  y="50"
                  width="800"
                  height="700"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  rx="20"
                />
                <text
                  x="600"
                  y="40"
                  textAnchor="middle"
                  className="text-lg font-bold fill-blue-600"
                >
                  TTU DocPortal System
                </text>

                {/* Actors */}
                {/* Student */}
                <g>
                  <circle cx="80" cy="200" r="25" fill="#10b981" />
                  <rect x="65" y="225" width="30" height="40" fill="#10b981" />
                  <line
                    x1="80"
                    y1="265"
                    x2="65"
                    y2="300"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="265"
                    x2="95"
                    y2="300"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="240"
                    x2="65"
                    y2="255"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="240"
                    x2="95"
                    y2="255"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  <text
                    x="80"
                    y="320"
                    textAnchor="middle"
                    className="text-sm font-semibold fill-green-600"
                  >
                    Student
                  </text>
                </g>

                {/* Admin */}
                <g>
                  <circle cx="80" cy="450" r="25" fill="#dc2626" />
                  <rect x="65" y="475" width="30" height="40" fill="#dc2626" />
                  <line
                    x1="80"
                    y1="515"
                    x2="65"
                    y2="550"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="515"
                    x2="95"
                    y2="550"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="490"
                    x2="65"
                    y2="505"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="490"
                    x2="95"
                    y2="505"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />
                  <text
                    x="80"
                    y="570"
                    textAnchor="middle"
                    className="text-sm font-semibold fill-red-600"
                  >
                    Admin
                  </text>
                </g>

                {/* HOD */}
                <g>
                  <circle cx="80" cy="650" r="25" fill="#7c3aed" />
                  <rect x="65" y="675" width="30" height="40" fill="#7c3aed" />
                  <line
                    x1="80"
                    y1="715"
                    x2="65"
                    y2="750"
                    stroke="#7c3aed"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="715"
                    x2="95"
                    y2="750"
                    stroke="#7c3aed"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="690"
                    x2="65"
                    y2="705"
                    stroke="#7c3aed"
                    strokeWidth="3"
                  />
                  <line
                    x1="80"
                    y1="690"
                    x2="95"
                    y2="705"
                    stroke="#7c3aed"
                    strokeWidth="3"
                  />
                  <text
                    x="80"
                    y="770"
                    textAnchor="middle"
                    className="text-sm font-semibold fill-purple-600"
                  >
                    HOD
                  </text>
                </g>

                {/* Payment System */}
                <g>
                  <circle cx="1120" cy="400" r="25" fill="#f59e0b" />
                  <rect
                    x="1105"
                    y="425"
                    width="30"
                    height="40"
                    fill="#f59e0b"
                  />
                  <line
                    x1="1120"
                    y1="465"
                    x2="1105"
                    y2="500"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  <line
                    x1="1120"
                    y1="465"
                    x2="1135"
                    y2="500"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  <line
                    x1="1120"
                    y1="440"
                    x2="1105"
                    y2="455"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  <line
                    x1="1120"
                    y1="440"
                    x2="1135"
                    y2="455"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  <text
                    x="1120"
                    y="520"
                    textAnchor="middle"
                    className="text-sm font-semibold fill-amber-600"
                  >
                    Paystack
                  </text>
                </g>

                {/* Use Cases */}
                {/* Student Use Cases */}
                <ellipse
                  cx="300"
                  cy="120"
                  rx="70"
                  ry="25"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text
                  x="300"
                  y="125"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Register/Login
                </text>

                <ellipse
                  cx="450"
                  cy="150"
                  rx="70"
                  ry="25"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text
                  x="450"
                  y="155"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Request Document
                </text>

                <ellipse
                  cx="600"
                  cy="120"
                  rx="70"
                  ry="25"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text
                  x="600"
                  y="125"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Make Payment
                </text>

                <ellipse
                  cx="350"
                  cy="200"
                  rx="70"
                  ry="25"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text
                  x="350"
                  y="205"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Track Request
                </text>

                <ellipse
                  cx="500"
                  cy="230"
                  rx="70"
                  ry="25"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text
                  x="500"
                  y="235"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Download Document
                </text>

                <ellipse
                  cx="300"
                  cy="280"
                  rx="70"
                  ry="25"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text
                  x="300"
                  y="285"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Upload Ghana Card
                </text>

                {/* Admin Use Cases */}
                <ellipse
                  cx="400"
                  cy="380"
                  rx="80"
                  ry="25"
                  fill="#fef3e2"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
                <text
                  x="400"
                  y="385"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Manage Users
                </text>

                <ellipse
                  cx="600"
                  cy="350"
                  rx="80"
                  ry="25"
                  fill="#fef3e2"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
                <text
                  x="600"
                  y="355"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Generate Documents
                </text>

                <ellipse
                  cx="750"
                  cy="380"
                  rx="80"
                  ry="25"
                  fill="#fef3e2"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
                <text
                  x="750"
                  y="385"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Verify Ghana Cards
                </text>

                <ellipse
                  cx="500"
                  cy="450"
                  rx="80"
                  ry="25"
                  fill="#fef3e2"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
                <text
                  x="500"
                  y="455"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  View Analytics
                </text>

                <ellipse
                  cx="650"
                  cy="480"
                  rx="80"
                  ry="25"
                  fill="#fef3e2"
                  stroke="#ea580c"
                  strokeWidth="2"
                />
                <text
                  x="650"
                  y="485"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Manage Requests
                </text>

                {/* HOD Use Cases */}
                <ellipse
                  cx="400"
                  cy="580"
                  rx="80"
                  ry="25"
                  fill="#f3e8ff"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                <text
                  x="400"
                  y="585"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Review Requests
                </text>

                <ellipse
                  cx="600"
                  cy="620"
                  rx="80"
                  ry="25"
                  fill="#f3e8ff"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                <text
                  x="600"
                  y="625"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Approve/Reject
                </text>

                <ellipse
                  cx="750"
                  cy="580"
                  rx="80"
                  ry="25"
                  fill="#f3e8ff"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
                <text
                  x="750"
                  y="585"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Add Comments
                </text>

                {/* Payment Use Cases */}
                <ellipse
                  cx="850"
                  cy="250"
                  rx="80"
                  ry="25"
                  fill="#fffbeb"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                <text
                  x="850"
                  y="255"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Process Payment
                </text>

                <ellipse
                  cx="900"
                  cy="320"
                  rx="80"
                  ry="25"
                  fill="#fffbeb"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                <text
                  x="900"
                  y="325"
                  textAnchor="middle"
                  className="text-xs font-medium"
                >
                  Send Confirmation
                </text>

                {/* Associations */}
                {/* Student associations */}
                <line
                  x1="105"
                  y1="200"
                  x2="230"
                  y2="120"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="200"
                  x2="380"
                  y2="150"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="200"
                  x2="530"
                  y2="120"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="200"
                  x2="280"
                  y2="200"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="200"
                  x2="430"
                  y2="230"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="200"
                  x2="230"
                  y2="280"
                  stroke="#374151"
                  strokeWidth="2"
                />

                {/* Admin associations */}
                <line
                  x1="105"
                  y1="450"
                  x2="320"
                  y2="380"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="450"
                  x2="520"
                  y2="350"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="450"
                  x2="670"
                  y2="380"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="450"
                  x2="420"
                  y2="450"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="450"
                  x2="570"
                  y2="480"
                  stroke="#374151"
                  strokeWidth="2"
                />

                {/* HOD associations */}
                <line
                  x1="105"
                  y1="650"
                  x2="320"
                  y2="580"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="650"
                  x2="520"
                  y2="620"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="105"
                  y1="650"
                  x2="670"
                  y2="580"
                  stroke="#374151"
                  strokeWidth="2"
                />

                {/* Payment system associations */}
                <line
                  x1="1095"
                  y1="400"
                  x2="930"
                  y2="250"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <line
                  x1="1095"
                  y1="400"
                  x2="980"
                  y2="320"
                  stroke="#374151"
                  strokeWidth="2"
                />

                {/* Include relationships */}
                <line
                  x1="600"
                  y1="145"
                  x2="780"
                  y2="250"
                  stroke="#059669"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                <text x="690" y="200" className="text-xs fill-green-600">
                  «include»
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Use Cases */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Use Cases */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                👨‍🎓 Student Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Register & Login with OTP verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Request documents (Transcript, Certificate, Attestation)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Make payment via Paystack
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Track request status
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Download completed documents
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Upload Ghana Card for verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Update profile information
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Admin Use Cases */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                👩‍💼 Admin Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Manage user accounts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Generate official documents
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Verify Ghana Card submissions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  View system analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Manage document requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Configure system settings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Monitor payment transactions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* HOD Use Cases */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center gap-2">
                👔 HOD Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Review department requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Approve/reject document requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Add comments to requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  View department analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Manage department students
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Digital signature approval
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Use Case Descriptions */}
        <Card className="mt-8 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Detailed Use Case Descriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">
                  Primary Use Cases
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">UC-01: Document Request</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Actor:</strong> Student
                      <br />
                      <strong>Description:</strong> Student selects document
                      type, chooses delivery method, and initiates payment-first
                      workflow.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold">
                      UC-02: Document Generation
                    </h4>
                    <p className="text-sm text-gray-600">
                      <strong>Actor:</strong> Admin
                      <br />
                      <strong>Description:</strong> Admin generates official
                      documents with real user data and mock academic records.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">UC-03: Request Review</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Actor:</strong> HOD
                      <br />
                      <strong>Description:</strong> HOD reviews
                      department-specific requests and provides
                      approval/rejection with comments.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                  Secondary Use Cases
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">UC-04: Payment Processing</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Actor:</strong> Paystack (External)
                      <br />
                      <strong>Description:</strong> Secure payment processing
                      with verification before document submission.
                    </p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4">
                    <h4 className="font-semibold">
                      UC-05: Ghana Card Verification
                    </h4>
                    <p className="text-sm text-gray-600">
                      <strong>Actor:</strong> Student/Admin
                      <br />
                      <strong>Description:</strong> Upload and verification
                      process for identity validation.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold">UC-06: Request Tracking</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Actor:</strong> Student
                      <br />
                      <strong>Description:</strong> Real-time status tracking
                      from submission to completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UseCaseDiagram;
