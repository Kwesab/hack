// In-memory database simulation - In production, replace with actual database
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  password: string;
  role: "admin" | "student";
  studentId?: string;
  isVerified: boolean;
  ghanaCard?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
  createdAt: Date;
}

export interface DocumentRequest {
  id: string;
  userId: string;
  type: "transcript" | "certificate" | "attestation";
  subType?: string; // e.g., "undergraduate", "postgraduate"
  status: "pending" | "processing" | "ready" | "completed" | "rejected";
  deliveryMethod: "digital" | "physical" | "both";
  deliveryAddress?: string;
  amount: number;
  isPaid: boolean;
  paymentMethod?: "mobile_money" | "card";
  documents: string[]; // URLs to uploaded documents
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface OTPSession {
  phone: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}

// Simulated database
class Database {
  private users: Map<string, User> = new Map();
  private requests: Map<string, DocumentRequest> = new Map();
  private otpSessions: Map<string, OTPSession> = new Map();

  // User methods
  createUser(userData: Omit<User, "id" | "createdAt">): User {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...userData,
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserByPhone(phone: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.phone === phone);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Document Request methods
  createRequest(
    requestData: Omit<DocumentRequest, "id" | "createdAt" | "updatedAt">,
  ): DocumentRequest {
    const request: DocumentRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...requestData,
    };
    this.requests.set(request.id, request);
    return request;
  }

  getRequestById(id: string): DocumentRequest | undefined {
    return this.requests.get(id);
  }

  getRequestsByUserId(userId: string): DocumentRequest[] {
    return Array.from(this.requests.values()).filter(
      (req) => req.userId === userId,
    );
  }

  updateRequest(
    id: string,
    updates: Partial<DocumentRequest>,
  ): DocumentRequest | undefined {
    const request = this.requests.get(id);
    if (request) {
      const updatedRequest = {
        ...request,
        ...updates,
        updatedAt: new Date(),
      };
      this.requests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  getAllRequests(): DocumentRequest[] {
    return Array.from(this.requests.values());
  }

  // OTP methods
  createOTPSession(phone: string, otp: string): OTPSession {
    const session: OTPSession = {
      phone,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      verified: false,
    };
    this.otpSessions.set(phone, session);
    return session;
  }

  getOTPSession(phone: string): OTPSession | undefined {
    return this.otpSessions.get(phone);
  }

  verifyOTP(phone: string, otp: string): boolean {
    const session = this.otpSessions.get(phone);
    if (
      session &&
      session.otp === otp &&
      session.expiresAt > new Date() &&
      !session.verified
    ) {
      session.verified = true;
      this.otpSessions.set(phone, session);
      return true;
    }
    return false;
  }

  clearOTPSession(phone: string): void {
    this.otpSessions.delete(phone);
  }

  // Initialize with some sample data
  init() {
    // Create sample admin user
    const adminUser = this.createUser({
      email: "admin@ttu.edu.gh",
      phone: "233501111111",
      name: "Admin User",
      password: "admin123",
      role: "admin",
      isVerified: true,
    });

    // Create a sample student user
    const sampleUser = this.createUser({
      email: "john.doe@student.ttu.edu.gh",
      phone: "233501234567",
      name: "John Doe",
      password: "student123",
      role: "student",
      studentId: "TTU/CS/2020/001",
      isVerified: true,
      ghanaCard: {
        number: "GHA-123456789-0",
        imageUrl: "/uploads/ghana-card-sample.jpg",
        verified: true,
      },
    });

    // Create a student without Ghana card
    this.createUser({
      email: "jane.smith@student.ttu.edu.gh",
      phone: "233502345678",
      name: "Jane Smith",
      password: "student123",
      role: "student",
      studentId: "TTU/IT/2021/002",
      isVerified: true,
    });

    // Create a student with unverified Ghana card for testing admin verification
    this.createUser({
      email: "test.student@student.ttu.edu.gh",
      phone: "233503456789",
      name: "Test Student",
      password: "student123",
      role: "student",
      studentId: "TTU/CS/2022/003",
      isVerified: true,
      ghanaCard: {
        number: "GHA-123456789-2",
        imageUrl: "/uploads/test-ghana-card.jpg",
        verified: false,
      },
    });

    // Create sample requests
    this.createRequest({
      userId: sampleUser.id,
      type: "transcript",
      subType: "undergraduate",
      status: "processing",
      deliveryMethod: "both",
      amount: 50,
      isPaid: true,
      paymentMethod: "mobile_money",
      documents: [],
    });

    this.createRequest({
      userId: sampleUser.id,
      type: "certificate",
      subType: "degree",
      status: "completed",
      deliveryMethod: "digital",
      amount: 30,
      isPaid: true,
      paymentMethod: "mobile_money",
      documents: [],
      completedAt: new Date(),
    });
  }
}

export const db = new Database();

// Initialize with sample data
db.init();
