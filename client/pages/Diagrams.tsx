import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Layers,
  Users,
  Database,
  Workflow,
  GitBranch,
  Download,
  ArrowRight,
} from "lucide-react";
import UseCaseDiagram from "./UseCaseDiagram";
import ArchitectureDiagram from "./ArchitectureDiagram";

const Diagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TTU DocPortal - System Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive system design and architecture documentation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="usecase" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Use Cases
            </TabsTrigger>
            <TabsTrigger
              value="architecture"
              className="flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Technical Specs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              {/* Project Overview */}
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    🎓 TTU DocPortal System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">
                        Project Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        The TTU DocPortal is a comprehensive digital document
                        management system designed for Takoradi Technical
                        University. It streamlines the process of requesting,
                        processing, and delivering official academic documents
                        including transcripts, certificates, and attestation
                        letters.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        The system implements a payment-first workflow,
                        department-based approval process, and automated
                        document generation with real user data integration.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Multi-role user management (Student, HOD, Admin)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Secure payment processing with Paystack
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Automated document generation (PDF)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Real-time request tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Ghana Card verification system
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                          Department-based workflow management
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Statistics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">User Roles</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                    <p className="text-sm text-blue-100 mt-2">
                      Student, HOD, Admin
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Document Types</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <FileText className="h-8 w-8 text-green-200" />
                    </div>
                    <p className="text-sm text-green-100 mt-2">
                      Transcript, Certificate, Attestation
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">System Layers</p>
                        <p className="text-2xl font-bold">5</p>
                      </div>
                      <Layers className="h-8 w-8 text-purple-200" />
                    </div>
                    <p className="text-sm text-purple-100 mt-2">
                      Presentation to Data
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Use Cases</p>
                        <p className="text-2xl font-bold">15+</p>
                      </div>
                      <Workflow className="h-8 w-8 text-orange-200" />
                    </div>
                    <p className="text-sm text-orange-100 mt-2">
                      Across all user roles
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Navigation */}
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Button
                      onClick={() => setActiveTab("usecase")}
                      className="h-auto p-6 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                      variant="outline"
                    >
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-semibold">Use Case Diagram</h3>
                        <p className="text-sm text-blue-600 mt-1">
                          View actors and their interactions
                        </p>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setActiveTab("architecture")}
                      className="h-auto p-6 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                      variant="outline"
                    >
                      <div className="text-center">
                        <Layers className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-semibold">System Architecture</h3>
                        <p className="text-sm text-green-600 mt-1">
                          Explore system components and layers
                        </p>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setActiveTab("technical")}
                      className="h-auto p-6 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                      variant="outline"
                    >
                      <div className="text-center">
                        <Database className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-semibold">Technical Details</h3>
                        <p className="text-sm text-purple-600 mt-1">
                          Review specifications and implementation
                        </p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Use Case Tab */}
          <TabsContent value="usecase">
            <UseCaseDiagram />
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture">
            <ArchitectureDiagram />
          </TabsContent>

          {/* Technical Specifications Tab */}
          <TabsContent value="technical">
            <div className="space-y-8">
              {/* Technical Overview */}
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">
                        Development Stack
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Frontend
                          </h4>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            <li>• React 18 with TypeScript</li>
                            <li>• Vite for build and development</li>
                            <li>• Tailwind CSS for styling</li>
                            <li>• Shadcn/UI component library</li>
                            <li>• React Router for navigation</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Backend</h4>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            <li>• Node.js with Express.js</li>
                            <li>• TypeScript for type safety</li>
                            <li>• PostgreSQL with in-memory fallback</li>
                            <li>• Zod for schema validation</li>
                            <li>• jsPDF for document generation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-green-600">
                        External Integrations
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Payment Processing
                          </h4>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            <li>• Paystack payment gateway</li>
                            <li>• Secure transaction processing</li>
                            <li>• Real-time payment verification</li>
                            <li>• Webhook-based confirmations</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Communication
                          </h4>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            <li>• SMS gateway for OTP delivery</li>
                            <li>• Email service integration</li>
                            <li>• Push notifications</li>
                            <li>• Status update alerts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Database Schema */}
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Database Schema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-3">
                        Users Table
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• id (Primary Key)</li>
                        <li>• email (Unique)</li>
                        <li>• phone</li>
                        <li>• name</li>
                        <li>• password</li>
                        <li>• role (student/hod/admin)</li>
                        <li>• department</li>
                        <li>• studentId</li>
                        <li>• isVerified</li>
                        <li>• ghanaCard (JSON)</li>
                        <li>• digitalSignature</li>
                        <li>• timestamps</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-3">
                        Document Requests
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• id (Primary Key)</li>
                        <li>• userId (Foreign Key)</li>
                        <li>• userDepartment</li>
                        <li>• type (transcript/certificate/attestation)</li>
                        <li>• subType</li>
                        <li>• status</li>
                        <li>• deliveryMethod</li>
                        <li>• amount</li>
                        <li>• isPaid</li>
                        <li>• paymentReference</li>
                        <li>• documents (JSON)</li>
                        <li>• hodSignature</li>
                        <li>• timestamps</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-3">
                        OTP Sessions
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• phone (Primary Key)</li>
                        <li>• otp</li>
                        <li>• expiresAt</li>
                        <li>• verified</li>
                        <li>• createdAt</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3">
                        Authentication & Users
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <code className="bg-blue-100 px-2 py-1 rounded">
                            POST /api/auth/send-otp
                          </code>
                          <span className="text-gray-600">Send OTP</span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-blue-100 px-2 py-1 rounded">
                            POST /api/auth/verify-otp
                          </code>
                          <span className="text-gray-600">Verify OTP</span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-blue-100 px-2 py-1 rounded">
                            POST /api/auth/register
                          </code>
                          <span className="text-gray-600">
                            User Registration
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-blue-100 px-2 py-1 rounded">
                            GET /api/user/:id
                          </code>
                          <span className="text-gray-600">Get User Info</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">
                        Document Management
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <code className="bg-green-100 px-2 py-1 rounded">
                            POST /api/requests
                          </code>
                          <span className="text-gray-600">Create Request</span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-green-100 px-2 py-1 rounded">
                            GET /api/requests/user/:id
                          </code>
                          <span className="text-gray-600">
                            Get User Requests
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-green-100 px-2 py-1 rounded">
                            GET /api/documents/download/:id
                          </code>
                          <span className="text-gray-600">
                            Download Document
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-green-100 px-2 py-1 rounded">
                            GET /api/admin/generate/:id
                          </code>
                          <span className="text-gray-600">Admin Generate</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-700 mb-3">
                        Payment Processing
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <code className="bg-purple-100 px-2 py-1 rounded">
                            POST /api/payments/initialize
                          </code>
                          <span className="text-gray-600">Init Payment</span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-purple-100 px-2 py-1 rounded">
                            POST /api/payments/verify
                          </code>
                          <span className="text-gray-600">Verify Payment</span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-purple-100 px-2 py-1 rounded">
                            GET /api/payments/status/:ref
                          </code>
                          <span className="text-gray-600">Payment Status</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3">
                        Admin Operations
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <code className="bg-orange-100 px-2 py-1 rounded">
                            GET /api/admin/requests
                          </code>
                          <span className="text-gray-600">
                            Get All Requests
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-orange-100 px-2 py-1 rounded">
                            PUT /api/admin/requests/:id
                          </code>
                          <span className="text-gray-600">Update Request</span>
                        </div>
                        <div className="flex justify-between">
                          <code className="bg-orange-100 px-2 py-1 rounded">
                            PUT /api/admin/verify-ghana-card/:id
                          </code>
                          <span className="text-gray-600">Verify ID</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Performance */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-red-50 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700">
                      Security Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Multi-Factor Authentication</strong>
                          <p className="text-sm text-gray-600">
                            OTP-based verification via SMS
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Role-Based Access Control</strong>
                          <p className="text-sm text-gray-600">
                            Granular permissions for different user types
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Payment Security</strong>
                          <p className="text-sm text-gray-600">
                            Secure payment processing with Paystack
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Data Encryption</strong>
                          <p className="text-sm text-gray-600">
                            Encrypted sensitive data storage
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-700">
                      Performance Optimizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Fast Build System</strong>
                          <p className="text-sm text-gray-600">
                            Vite for lightning-fast development builds
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Efficient PDF Generation</strong>
                          <p className="text-sm text-gray-600">
                            Optimized jsPDF usage with template caching
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Database Optimization</strong>
                          <p className="text-sm text-gray-600">
                            Indexed queries and connection pooling
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <div>
                          <strong>Frontend Optimization</strong>
                          <p className="text-sm text-gray-600">
                            Code splitting and lazy loading
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Diagrams;
