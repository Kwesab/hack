import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TTU DocPortal - System Architecture
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive view of system components, layers, and integrations
          </p>
        </div>

        {/* High-Level Architecture */}
        <Card className="mb-8 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              System Architecture Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[900px] bg-gray-50 rounded-lg overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1400 900"
                className="absolute inset-0"
              >
                {/* Background layers */}
                <defs>
                  <linearGradient
                    id="frontendGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient
                    id="backendGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient
                    id="dataGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Layer Headers */}
                <text
                  x="700"
                  y="30"
                  textAnchor="middle"
                  className="text-2xl font-bold fill-gray-800"
                >
                  TTU DocPortal System Architecture
                </text>

                {/* Presentation Layer */}
                <rect
                  x="50"
                  y="60"
                  width="1300"
                  height="200"
                  fill="url(#frontendGradient)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  rx="10"
                />
                <text x="70" y="85" className="text-lg font-bold fill-blue-700">
                  Presentation Layer (Frontend)
                </text>

                {/* Frontend Components */}
                <rect
                  x="80"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="155"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Landing Page
                </text>
                <text x="155" y="140" textAnchor="middle" className="text-xs">
                  React + Vite
                </text>
                <text x="155" y="155" textAnchor="middle" className="text-xs">
                  Modern UI/UX
                </text>

                <rect
                  x="250"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="325"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Student Portal
                </text>
                <text x="325" y="140" textAnchor="middle" className="text-xs">
                  Document Requests
                </text>
                <text x="325" y="155" textAnchor="middle" className="text-xs">
                  Payment Integration
                </text>

                <rect
                  x="420"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="495"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Admin Dashboard
                </text>
                <text x="495" y="140" textAnchor="middle" className="text-xs">
                  User Management
                </text>
                <text x="495" y="155" textAnchor="middle" className="text-xs">
                  Document Generation
                </text>

                <rect
                  x="590"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="665"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  HOD Dashboard
                </text>
                <text x="665" y="140" textAnchor="middle" className="text-xs">
                  Request Review
                </text>
                <text x="665" y="155" textAnchor="middle" className="text-xs">
                  Department Analytics
                </text>

                <rect
                  x="760"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="835"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Authentication
                </text>
                <text x="835" y="140" textAnchor="middle" className="text-xs">
                  OTP Verification
                </text>
                <text x="835" y="155" textAnchor="middle" className="text-xs">
                  Role-based Access
                </text>

                <rect
                  x="930"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1005"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Document Viewer
                </text>
                <text x="1005" y="140" textAnchor="middle" className="text-xs">
                  PDF Preview
                </text>
                <text x="1005" y="155" textAnchor="middle" className="text-xs">
                  Download Manager
                </text>

                <rect
                  x="1100"
                  y="100"
                  width="150"
                  height="80"
                  fill="#dbeafe"
                  stroke="#2563eb"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1175"
                  y="125"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Test Interface
                </text>
                <text x="1175" y="140" textAnchor="middle" className="text-xs">
                  System Testing
                </text>
                <text x="1175" y="155" textAnchor="middle" className="text-xs">
                  Document Generation
                </text>

                {/* API Gateway Layer */}
                <rect
                  x="50"
                  y="290"
                  width="1300"
                  height="80"
                  fill="#f0f9ff"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  rx="10"
                />
                <text x="70" y="315" className="text-lg font-bold fill-sky-700">
                  API Gateway & Routing Layer
                </text>

                <rect
                  x="200"
                  y="320"
                  width="200"
                  height="40"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="300"
                  y="345"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Express.js Router
                </text>

                <rect
                  x="450"
                  y="320"
                  width="200"
                  height="40"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="550"
                  y="345"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Authentication Middleware
                </text>

                <rect
                  x="700"
                  y="320"
                  width="200"
                  height="40"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="800"
                  y="345"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  CORS & Security
                </text>

                <rect
                  x="950"
                  y="320"
                  width="200"
                  height="40"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1050"
                  y="345"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Error Handling
                </text>

                {/* Business Logic Layer */}
                <rect
                  x="50"
                  y="400"
                  width="1300"
                  height="200"
                  fill="url(#backendGradient)"
                  stroke="#10b981"
                  strokeWidth="2"
                  rx="10"
                />
                <text
                  x="70"
                  y="425"
                  className="text-lg font-bold fill-green-700"
                >
                  Business Logic Layer (Backend Services)
                </text>

                {/* Backend Services */}
                <rect
                  x="80"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="155"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Auth Service
                </text>
                <text x="155" y="480" textAnchor="middle" className="text-xs">
                  OTP Generation
                </text>
                <text x="155" y="495" textAnchor="middle" className="text-xs">
                  JWT Management
                </text>

                <rect
                  x="250"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="325"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  User Service
                </text>
                <text x="325" y="480" textAnchor="middle" className="text-xs">
                  Profile Management
                </text>
                <text x="325" y="495" textAnchor="middle" className="text-xs">
                  Role Assignment
                </text>

                <rect
                  x="420"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="495"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Document Service
                </text>
                <text x="495" y="480" textAnchor="middle" className="text-xs">
                  PDF Generation
                </text>
                <text x="495" y="495" textAnchor="middle" className="text-xs">
                  Template Engine
                </text>

                <rect
                  x="590"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="665"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Request Service
                </text>
                <text x="665" y="480" textAnchor="middle" className="text-xs">
                  Workflow Management
                </text>
                <text x="665" y="495" textAnchor="middle" className="text-xs">
                  Status Tracking
                </text>

                <rect
                  x="760"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="835"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Payment Service
                </text>
                <text x="835" y="480" textAnchor="middle" className="text-xs">
                  Paystack Integration
                </text>
                <text x="835" y="495" textAnchor="middle" className="text-xs">
                  Transaction Tracking
                </text>

                <rect
                  x="930"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1005"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Upload Service
                </text>
                <text x="1005" y="480" textAnchor="middle" className="text-xs">
                  File Management
                </text>
                <text x="1005" y="495" textAnchor="middle" className="text-xs">
                  Ghana Card Processing
                </text>

                <rect
                  x="1100"
                  y="440"
                  width="150"
                  height="80"
                  fill="#d1fae5"
                  stroke="#059669"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1175"
                  y="465"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Notification Service
                </text>
                <text x="1175" y="480" textAnchor="middle" className="text-xs">
                  Email/SMS
                </text>
                <text x="1175" y="495" textAnchor="middle" className="text-xs">
                  Status Updates
                </text>

                {/* Data Access Layer */}
                <rect
                  x="50"
                  y="630"
                  width="1300"
                  height="120"
                  fill="url(#dataGradient)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  rx="10"
                />
                <text
                  x="70"
                  y="655"
                  className="text-lg font-bold fill-amber-700"
                >
                  Data Access Layer
                </text>

                <rect
                  x="150"
                  y="670"
                  width="200"
                  height="60"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="250"
                  y="695"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Database Service
                </text>
                <text x="250" y="710" textAnchor="middle" className="text-xs">
                  PostgreSQL/In-Memory
                </text>

                <rect
                  x="400"
                  y="670"
                  width="200"
                  height="60"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="500"
                  y="695"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  File Storage
                </text>
                <text x="500" y="710" textAnchor="middle" className="text-xs">
                  Document Repository
                </text>

                <rect
                  x="650"
                  y="670"
                  width="200"
                  height="60"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="750"
                  y="695"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Cache Layer
                </text>
                <text x="750" y="710" textAnchor="middle" className="text-xs">
                  Session Management
                </text>

                <rect
                  x="900"
                  y="670"
                  width="200"
                  height="60"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1000"
                  y="695"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Backup System
                </text>
                <text x="1000" y="710" textAnchor="middle" className="text-xs">
                  Data Recovery
                </text>

                {/* External Services */}
                <rect
                  x="50"
                  y="780"
                  width="1300"
                  height="100"
                  fill="#f8fafc"
                  stroke="#64748b"
                  strokeWidth="2"
                  rx="10"
                />
                <text
                  x="70"
                  y="805"
                  className="text-lg font-bold fill-slate-700"
                >
                  External Services & Integrations
                </text>

                <rect
                  x="150"
                  y="820"
                  width="150"
                  height="50"
                  fill="#fecaca"
                  stroke="#dc2626"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="225"
                  y="845"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Paystack API
                </text>
                <text x="225" y="860" textAnchor="middle" className="text-xs">
                  Payment Gateway
                </text>

                <rect
                  x="350"
                  y="820"
                  width="150"
                  height="50"
                  fill="#fed7d7"
                  stroke="#e53e3e"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="425"
                  y="845"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  SMS Gateway
                </text>
                <text x="425" y="860" textAnchor="middle" className="text-xs">
                  OTP Delivery
                </text>

                <rect
                  x="550"
                  y="820"
                  width="150"
                  height="50"
                  fill="#fef2e2"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="625"
                  y="845"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Email Service
                </text>
                <text x="625" y="860" textAnchor="middle" className="text-xs">
                  SMTP/SendGrid
                </text>

                <rect
                  x="750"
                  y="820"
                  width="150"
                  height="50"
                  fill="#e6fffa"
                  stroke="#319795"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="825"
                  y="845"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Cloud Storage
                </text>
                <text x="825" y="860" textAnchor="middle" className="text-xs">
                  File Repository
                </text>

                <rect
                  x="950"
                  y="820"
                  width="150"
                  height="50"
                  fill="#f0fff4"
                  stroke="#38a169"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="1025"
                  y="845"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                >
                  Ghana Card API
                </text>
                <text x="1025" y="860" textAnchor="middle" className="text-xs">
                  Identity Verification
                </text>

                {/* Connection Lines */}
                {/* Frontend to API Gateway */}
                <line
                  x1="155"
                  y1="180"
                  x2="300"
                  y2="320"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="325"
                  y1="180"
                  x2="400"
                  y2="320"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="495"
                  y1="180"
                  x2="550"
                  y2="320"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="665"
                  y1="180"
                  x2="650"
                  y2="320"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="835"
                  y1="180"
                  x2="750"
                  y2="320"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="1005"
                  y1="180"
                  x2="950"
                  y2="320"
                  stroke="#6b7280"
                  strokeWidth="2"
                />

                {/* API Gateway to Business Logic */}
                <line
                  x1="300"
                  y1="360"
                  x2="325"
                  y2="440"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="550"
                  y1="360"
                  x2="495"
                  y2="440"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="800"
                  y1="360"
                  x2="665"
                  y2="440"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="1050"
                  y1="360"
                  x2="835"
                  y2="440"
                  stroke="#6b7280"
                  strokeWidth="2"
                />

                {/* Business Logic to Data Access */}
                <line
                  x1="325"
                  y1="520"
                  x2="250"
                  y2="670"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="495"
                  y1="520"
                  x2="500"
                  y2="670"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="665"
                  y1="520"
                  x2="750"
                  y2="670"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="835"
                  y1="520"
                  x2="1000"
                  y2="670"
                  stroke="#6b7280"
                  strokeWidth="2"
                />

                {/* External Services connections */}
                <line
                  x1="835"
                  y1="520"
                  x2="225"
                  y2="820"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="155"
                  y1="520"
                  x2="425"
                  y2="820"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="1175"
                  y1="520"
                  x2="625"
                  y2="820"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">
                Frontend Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <div>
                    <strong>React 18</strong> - Modern UI framework with hooks
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <div>
                    <strong>Vite</strong> - Fast build tool and dev server
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                  <div>
                    <strong>TypeScript</strong> - Type-safe JavaScript
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                  <div>
                    <strong>Tailwind CSS</strong> - Utility-first CSS framework
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <div>
                    <strong>React Router</strong> - Client-side routing
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div>
                    <strong>Shadcn/UI</strong> - Modern component library
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">
                Backend Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <div>
                    <strong>Node.js</strong> - JavaScript runtime environment
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <div>
                    <strong>Express.js</strong> - Web application framework
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <div>
                    <strong>PostgreSQL</strong> - Primary database with
                    in-memory fallback
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <div>
                    <strong>jsPDF</strong> - PDF generation library
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <div>
                    <strong>Paystack</strong> - Payment processing integration
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <div>
                    <strong>Zod</strong> - Schema validation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Architecture Patterns */}
        <Card className="mb-8 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Architecture Patterns & Principles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  🏗️ Layered Architecture
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Presentation Layer (React Frontend)</li>
                  <li>• API Gateway Layer (Express Router)</li>
                  <li>• Business Logic Layer (Services)</li>
                  <li>• Data Access Layer (Database)</li>
                  <li>• External Services Layer</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  🔧 Service-Oriented Design
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Document Generation Service</li>
                  <li>• Payment Processing Service</li>
                  <li>• Authentication Service</li>
                  <li>• User Management Service</li>
                  <li>• Notification Service</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">
                  🔒 Security Principles
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Role-based Access Control (RBAC)</li>
                  <li>• JWT Token Authentication</li>
                  <li>• OTP Verification</li>
                  <li>• Payment-First Security</li>
                  <li>• Data Encryption</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Flow */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Data Flow Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Document Request Flow
                </h3>
                <div className="flex items-center gap-4 text-sm overflow-x-auto">
                  <div className="bg-blue-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Student Request
                  </div>
                  <span>→</span>
                  <div className="bg-yellow-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Payment Processing
                  </div>
                  <span>→</span>
                  <div className="bg-purple-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    HOD Review
                  </div>
                  <span>→</span>
                  <div className="bg-green-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Admin Processing
                  </div>
                  <span>→</span>
                  <div className="bg-orange-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Document Generation
                  </div>
                  <span>→</span>
                  <div className="bg-cyan-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Student Download
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Authentication Flow
                </h3>
                <div className="flex items-center gap-4 text-sm overflow-x-auto">
                  <div className="bg-red-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    User Login
                  </div>
                  <span>→</span>
                  <div className="bg-yellow-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    OTP Generation
                  </div>
                  <span>→</span>
                  <div className="bg-purple-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    SMS Delivery
                  </div>
                  <span>→</span>
                  <div className="bg-green-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    OTP Verification
                  </div>
                  <span>→</span>
                  <div className="bg-blue-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    JWT Token
                  </div>
                  <span>→</span>
                  <div className="bg-orange-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Dashboard Access
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Payment Processing Flow
                </h3>
                <div className="flex items-center gap-4 text-sm overflow-x-auto">
                  <div className="bg-green-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Payment Init
                  </div>
                  <span>→</span>
                  <div className="bg-yellow-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Paystack Gateway
                  </div>
                  <span>→</span>
                  <div className="bg-blue-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Payment Success
                  </div>
                  <span>→</span>
                  <div className="bg-purple-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Request Submission
                  </div>
                  <span>→</span>
                  <div className="bg-orange-100 px-3 py-2 rounded-lg whitespace-nowrap">
                    Status Update
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

export default ArchitectureDiagram;
