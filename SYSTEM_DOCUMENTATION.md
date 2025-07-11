# TTU DocPortal - System Documentation

## Project Overview

The TTU DocPortal is a comprehensive digital document management system designed for Takoradi Technical University. It streamlines the process of requesting, processing, and delivering official academic documents including transcripts, certificates, and attestation letters.

## Use Case Diagram

### Actors

1. **Student** - University students requesting documents
2. **Admin** - System administrators managing the platform
3. **HOD (Head of Department)** - Department heads reviewing requests
4. **Paystack** - External payment processing service

### Primary Use Cases

#### Student Use Cases

- **UC-01: Register/Login** - User registration and authentication with OTP verification
- **UC-02: Request Document** - Submit requests for transcripts, certificates, or attestations
- **UC-03: Make Payment** - Process payment through Paystack before request submission
- **UC-04: Track Request** - Monitor request status in real-time
- **UC-05: Download Document** - Download completed documents in PDF format
- **UC-06: Upload Ghana Card** - Submit identity verification documents

#### Admin Use Cases

- **UC-07: Manage Users** - Create, update, and manage user accounts
- **UC-08: Generate Documents** - Create official documents with real user data
- **UC-09: Verify Ghana Cards** - Review and approve identity verification submissions
- **UC-10: View Analytics** - Monitor system performance and usage statistics
- **UC-11: Manage Requests** - Process and update document request statuses

#### HOD Use Cases

- **UC-12: Review Requests** - Examine department-specific document requests
- **UC-13: Approve/Reject** - Make approval decisions on requests
- **UC-14: Add Comments** - Provide feedback and notes on requests

#### External System Use Cases

- **UC-15: Process Payment** - Handle secure payment transactions (Paystack)
- **UC-16: Send Notifications** - Deliver OTP and status updates via SMS/Email

## System Architecture

### Layered Architecture

#### 1. Presentation Layer (Frontend)

- **Technology**: React 18 with TypeScript, Vite, Tailwind CSS
- **Components**:
  - Landing Page - Marketing and information portal
  - Student Portal - Document request management
  - Admin Dashboard - System administration interface
  - HOD Dashboard - Department-specific request management
  - Authentication - OTP-based login system
  - Document Viewer - PDF preview and download functionality

#### 2. API Gateway & Routing Layer

- **Technology**: Express.js with middleware
- **Components**:
  - Express.js Router - Route management and API endpoints
  - Authentication Middleware - JWT token validation
  - CORS & Security - Cross-origin and security headers
  - Error Handling - Centralized error management

#### 3. Business Logic Layer (Backend Services)

- **Technology**: Node.js with Express.js, TypeScript
- **Services**:
  - **Auth Service** - OTP generation, JWT management, user authentication
  - **User Service** - Profile management, role assignment
  - **Document Service** - PDF generation, template engine
  - **Request Service** - Workflow management, status tracking
  - **Payment Service** - Paystack integration, transaction tracking
  - **Upload Service** - File management, Ghana Card processing
  - **Notification Service** - Email/SMS delivery, status updates

#### 4. Data Access Layer

- **Technology**: PostgreSQL with in-memory fallback
- **Components**:
  - Database Service - PostgreSQL/In-Memory data management
  - File Storage - Document repository and file handling
  - Cache Layer - Session management and performance optimization
  - Backup System - Data recovery and redundancy

#### 5. External Services & Integrations

- **Paystack API** - Payment gateway integration
- **SMS Gateway** - OTP delivery service
- **Email Service** - SMTP/SendGrid for notifications
- **Cloud Storage** - File repository for documents and uploads
- **Ghana Card API** - Identity verification service (planned)

### Data Flow Architecture

#### Document Request Flow

```
Student Request → Payment Processing → HOD Review → Admin Processing → Document Generation → Student Download
```

#### Authentication Flow

```
User Login → OTP Generation → SMS Delivery → OTP Verification → JWT Token → Dashboard Access
```

#### Payment Processing Flow

```
Payment Init → Paystack Gateway → Payment Success → Request Submission → Status Update
```

## Database Schema

### Users Table

- `id` (Primary Key) - Unique user identifier
- `email` (Unique) - User email address
- `phone` - Contact phone number
- `name` - Full name
- `password` - Hashed password
- `role` - User role (student/hod/admin)
- `department` - Academic department
- `studentId` - Student identification number
- `isVerified` - Account verification status
- `ghanaCard` (JSON) - Ghana Card verification data
- `digitalSignature` - Digital signature for documents
- `createdAt`, `updatedAt` - Timestamps

### Document Requests Table

- `id` (Primary Key) - Unique request identifier
- `userId` (Foreign Key) - Reference to Users table
- `userDepartment` - Student's department
- `type` - Document type (transcript/certificate/attestation)
- `subType` - Document subtype specification
- `status` - Request status (pending/processing/ready/completed/rejected)
- `deliveryMethod` - Delivery preference (digital/courier/cash_on_delivery)
- `amount` - Total cost including delivery
- `isPaid` - Payment status
- `paymentReference` - Paystack payment reference
- `documents` (JSON) - Associated document files
- `hodSignature` - HOD approval signature
- `createdAt`, `updatedAt`, `completedAt` - Timestamps

### OTP Sessions Table

- `phone` (Primary Key) - Phone number
- `otp` - One-time password
- `expiresAt` - Expiration timestamp
- `verified` - Verification status
- `createdAt` - Creation timestamp

## API Endpoints

### Authentication & Users

- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/register` - Register new user account
- `GET /api/user/:id` - Get user information
- `PUT /api/user/:id` - Update user profile

### Document Management

- `POST /api/requests` - Create new document request
- `GET /api/requests/user/:id` - Get user's requests
- `GET /api/documents/download/:id` - Download document PDF
- `GET /api/documents/preview/:id` - Preview document
- `GET /api/admin/generate/:id` - Admin document generation

### Payment Processing

- `POST /api/payments/initialize` - Initialize payment transaction
- `POST /api/payments/verify` - Verify payment completion
- `GET /api/payments/status/:ref` - Check payment status
- `POST /api/payments/refund/:ref` - Process payment refund

### Admin Operations

- `GET /api/admin/requests` - Get all system requests
- `PUT /api/admin/requests/:id` - Update request status
- `PUT /api/admin/verify-ghana-card/:id` - Verify Ghana Card submission
- `GET /api/admin/users` - Get all system users

### HOD Operations

- `GET /api/hod/requests/:dept` - Get department requests
- `PUT /api/hod/approve/:id` - Approve request
- `PUT /api/hod/reject/:id` - Reject request with reason

## Technology Stack

### Frontend Technologies

- **React 18** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Shadcn/UI** - Modern, accessible component library
- **React Router** - Client-side routing and navigation
- **Lucide React** - Icon library for consistent UI elements

### Backend Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type safety for backend development
- **PostgreSQL** - Primary relational database
- **jsPDF** - PDF generation library
- **Zod** - Schema validation library
- **JWT** - JSON Web Tokens for authentication

### External Services

- **Paystack** - Payment processing gateway
- **SMS Gateway** - OTP delivery service
- **Email Service** - Notification delivery (SMTP/SendGrid)
- **Cloud Storage** - File storage and backup

## Security Features

### Authentication & Authorization

- **Multi-Factor Authentication** - OTP-based verification via SMS
- **Role-Based Access Control** - Granular permissions for different user types
- **JWT Token Management** - Secure session handling
- **Password Hashing** - Secure password storage

### Payment Security

- **Secure Payment Processing** - Paystack integration with encryption
- **Payment Verification** - Webhook-based confirmation system
- **Transaction Tracking** - Audit trail for all payments
- **Payment-First Workflow** - Ensures payment before processing

### Data Protection

- **Data Encryption** - Encrypted sensitive data storage
- **Input Validation** - Zod schema validation for all inputs
- **CORS Protection** - Cross-origin request security
- **Error Handling** - Secure error messages without information leakage

## Performance Optimizations

### Frontend Optimizations

- **Fast Build System** - Vite for lightning-fast development builds
- **Code Splitting** - Lazy loading of components and routes
- **Asset Optimization** - Minification and compression
- **Caching Strategy** - Browser caching for static assets

### Backend Optimizations

- **Efficient PDF Generation** - Optimized jsPDF usage with template caching
- **Database Optimization** - Indexed queries and connection pooling
- **API Response Optimization** - Efficient data serialization
- **Error Handling** - Graceful error recovery

### Infrastructure

- **Database Fallback** - In-memory database when PostgreSQL unavailable
- **Session Management** - Efficient session storage and cleanup
- **File Storage** - Optimized file upload and retrieval
- **Monitoring** - Performance tracking and error reporting

## Deployment Architecture

### Development Environment

- **Local Development** - Vite dev server with hot reload
- **Database** - PostgreSQL with in-memory fallback
- **Payment Testing** - Paystack test mode integration
- **File Storage** - Local file system storage

### Production Environment

- **Frontend Deployment** - Static site deployment with CDN
- **Backend Deployment** - Node.js server with PM2 process management
- **Database** - PostgreSQL with backup and replication
- **File Storage** - Cloud storage integration
- **Payment Processing** - Paystack live mode with webhooks

## Future Enhancements

### Planned Features

- **Email Notifications** - Automated status update emails
- **Mobile Application** - React Native mobile app
- **Document Templates** - Customizable document templates
- **Bulk Operations** - Batch processing for multiple requests
- **API Rate Limiting** - Request throttling and abuse prevention

### Integration Opportunities

- **University Information System** - Integration with existing student records
- **Ghana Card API** - Automated identity verification
- **Academic Records System** - Real academic data integration
- **Alumni Portal** - Extended access for graduates
- **Payment Analytics** - Advanced financial reporting

## Conclusion

The TTU DocPortal represents a modern, secure, and efficient solution for university document management. With its layered architecture, comprehensive security measures, and user-friendly interface, it provides a robust platform for students, faculty, and administrators to manage academic document requests seamlessly.

The system's modular design allows for easy maintenance and future enhancements, while its integration capabilities ensure it can grow with the university's evolving needs.
