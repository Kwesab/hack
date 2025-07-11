import { Pool } from "pg";

// Database interfaces
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
  subType?: string;
  status: "pending" | "processing" | "ready" | "completed" | "rejected";
  deliveryMethod: "digital" | "courier" | "cash_on_delivery";
  deliveryAddress?: string;
  amount: number;
  isPaid: boolean;
  paymentMethod?: "paystack" | "cash_on_delivery";
  paymentReference?: string;
  documents: string[];
  notes?: string;
  adminNotes?: string;
  downloadUrl?: string;
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

// Enhanced Database Service
class DatabaseService {
  private pool: Pool | null = null;
  private usePostgres = false;

  // In-memory fallback storage
  private users: Map<string, User> = new Map();
  private requests: Map<string, DocumentRequest> = new Map();
  private otpSessions: Map<string, OTPSession> = new Map();

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Try to connect to PostgreSQL
      const connectionString = process.env.DATABASE_URL;

      if (connectionString) {
        this.pool = new Pool({
          connectionString,
          ssl: {
            rejectUnauthorized: false,
          },
        });

        // Test connection
        await this.pool.query("SELECT 1");
        this.usePostgres = true;
        console.log("✅ Connected to PostgreSQL database");

        // Initialize PostgreSQL tables if they don't exist
        await this.createTablesIfNotExists();
      } else {
        throw new Error("No database URL provided");
      }
    } catch (error) {
      console.log("⚠️ PostgreSQL connection failed, using in-memory database");
      console.log("Error:", error.message);
      this.usePostgres = false;
      this.initializeInMemoryData();
    }
  }

  private async createTablesIfNotExists() {
    if (!this.pool) return;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY,
        email VARCHAR UNIQUE NOT NULL,
        phone VARCHAR UNIQUE NOT NULL,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        role VARCHAR DEFAULT 'student',
        student_id VARCHAR,
        is_verified BOOLEAN DEFAULT false,
        ghana_card JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createDocumentRequestsTable = `
      CREATE TABLE IF NOT EXISTS document_requests (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        sub_type VARCHAR,
        status VARCHAR DEFAULT 'pending',
        delivery_method VARCHAR NOT NULL,
        delivery_address TEXT,
        amount DECIMAL(10,2) NOT NULL,
        is_paid BOOLEAN DEFAULT false,
        payment_method VARCHAR,
        payment_reference VARCHAR,
        documents JSONB DEFAULT '[]',
        notes TEXT,
        admin_notes TEXT,
        download_url VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
    `;

    const createOtpSessionsTable = `
      CREATE TABLE IF NOT EXISTS otp_sessions (
        phone VARCHAR PRIMARY KEY,
        otp VARCHAR NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    try {
      await this.pool.query(createUsersTable);
      await this.pool.query(createDocumentRequestsTable);
      await this.pool.query(createOtpSessionsTable);
      console.log("📝 Database tables created/verified");

      // Add sample data
      await this.addSampleData();
    } catch (error) {
      console.error("❌ Error creating tables:", error);
    }
  }

  private async addSampleData() {
    if (!this.pool) return;

    try {
      // Check if admin exists
      const adminExists = await this.pool.query(
        "SELECT id FROM users WHERE email = $1",
        ["admin@ttu.edu.gh"],
      );

      if (adminExists.rows.length === 0) {
        // Add sample admin
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, is_verified, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `,
          [
            `admin_${Date.now()}`,
            "admin@ttu.edu.gh",
            "233501111111",
            "Admin User",
            "admin123",
            "admin",
            true,
          ],
        );

        // Add sample student with Ghana card
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, student_id, is_verified, ghana_card, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `,
          [
            `student_${Date.now()}`,
            "john.doe@student.ttu.edu.gh",
            "233501234567",
            "John Doe",
            "student123",
            "student",
            "TTU/CS/2020/001",
            true,
            JSON.stringify({
              number: "GHA-123456789-0",
              imageUrl: "/uploads/ghana-card-sample.jpg",
              verified: true,
            }),
          ],
        );

        // Add student with unverified Ghana card
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, student_id, is_verified, ghana_card, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `,
          [
            `student_pending_${Date.now()}`,
            "test.student@student.ttu.edu.gh",
            "233503456789",
            "Test Student",
            "student123",
            "student",
            "TTU/CS/2022/003",
            true,
            JSON.stringify({
              number: "GHA-123456789-2",
              imageUrl: "/uploads/test-ghana-card.jpg",
              verified: false,
            }),
          ],
        );

        console.log("📊 Sample data added to database");
      }
    } catch (error) {
      console.error("❌ Error adding sample data:", error);
    }
  }

  private initializeInMemoryData() {
    // Create sample admin user
    const adminUser: User = {
      id: `admin_${Date.now()}`,
      email: "admin@ttu.edu.gh",
      phone: "233501111111",
      name: "Admin User",
      password: "admin123",
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create sample student with Ghana Card
    const studentUser: User = {
      id: `student_${Date.now()}`,
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
      createdAt: new Date(),
    };
    this.users.set(studentUser.id, studentUser);

    // Create student with unverified Ghana card
    const testStudent: User = {
      id: `student_pending_${Date.now()}`,
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
      createdAt: new Date(),
    };
    this.users.set(testStudent.id, testStudent);

    console.log("📊 In-memory database initialized with sample data");
  }

  // User methods
  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...userData,
    };

    if (this.usePostgres && this.pool) {
      try {
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, student_id, is_verified, ghana_card, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        `,
          [
            user.id,
            user.email,
            user.phone,
            user.name,
            user.password,
            user.role,
            user.studentId || null,
            user.isVerified,
            user.ghanaCard ? JSON.stringify(user.ghanaCard) : null,
          ],
        );
      } catch (error) {
        console.error("Error creating user in PostgreSQL:", error);
        // Fallback to in-memory
        this.users.set(user.id, user);
      }
    } else {
      this.users.set(user.id, user);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (this.usePostgres && this.pool) {
      try {
        const result = await this.pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email],
        );

        if (result.rows.length > 0) {
          const row = result.rows[0];
          return {
            id: row.id,
            email: row.email,
            phone: row.phone,
            name: row.name,
            password: row.password,
            role: row.role,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            createdAt: new Date(row.created_at),
          };
        }
      } catch (error) {
        console.error("Error getting user by email:", error);
      }
    }

    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getUserById(id: string): Promise<User | undefined> {
    if (this.usePostgres && this.pool) {
      try {
        const result = await this.pool.query(
          "SELECT * FROM users WHERE id = $1",
          [id],
        );

        if (result.rows.length > 0) {
          const row = result.rows[0];
          return {
            id: row.id,
            email: row.email,
            phone: row.phone,
            name: row.name,
            password: row.password,
            role: row.role,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            createdAt: new Date(row.created_at),
          };
        }
      } catch (error) {
        console.error("Error getting user by ID:", error);
      }
    }

    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    if (this.usePostgres && this.pool) {
      try {
        const result = await this.pool.query(
          "SELECT * FROM users WHERE phone = $1",
          [phone],
        );

        if (result.rows.length > 0) {
          const row = result.rows[0];
          return {
            id: row.id,
            email: row.email,
            phone: row.phone,
            name: row.name,
            password: row.password,
            role: row.role,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            createdAt: new Date(row.created_at),
          };
        }
      } catch (error) {
        console.error("Error getting user by phone:", error);
      }
    }

    return Array.from(this.users.values()).find((user) => user.phone === phone);
  }

  async updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<User | undefined> {
    if (this.usePostgres && this.pool) {
      try {
        const setClause = [];
        const values = [];
        let paramIndex = 1;

        if (updates.name !== undefined) {
          setClause.push(`name = $${paramIndex++}`);
          values.push(updates.name);
        }
        if (updates.password !== undefined) {
          setClause.push(`password = $${paramIndex++}`);
          values.push(updates.password);
        }
        if (updates.isVerified !== undefined) {
          setClause.push(`is_verified = $${paramIndex++}`);
          values.push(updates.isVerified);
        }
        if (updates.ghanaCard !== undefined) {
          setClause.push(`ghana_card = $${paramIndex++}`);
          values.push(JSON.stringify(updates.ghanaCard));
        }

        setClause.push(`updated_at = NOW()`);
        values.push(id);

        const query = `
          UPDATE users 
          SET ${setClause.join(", ")}
          WHERE id = $${paramIndex}
          RETURNING *
        `;

        const result = await this.pool.query(query, values);

        if (result.rows.length > 0) {
          const row = result.rows[0];
          return {
            id: row.id,
            email: row.email,
            phone: row.phone,
            name: row.name,
            password: row.password,
            role: row.role,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            createdAt: new Date(row.created_at),
          };
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }

    // Fallback to in-memory
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getAllUsers(): Promise<User[]> {
    if (this.usePostgres && this.pool) {
      try {
        const result = await this.pool.query(
          "SELECT * FROM users ORDER BY created_at DESC",
        );
        return result.rows.map((row) => ({
          id: row.id,
          email: row.email,
          phone: row.phone,
          name: row.name,
          password: row.password,
          role: row.role,
          studentId: row.student_id,
          isVerified: row.is_verified,
          ghanaCard: row.ghana_card,
          createdAt: new Date(row.created_at),
        }));
      } catch (error) {
        console.error("Error getting all users:", error);
      }
    }

    return Array.from(this.users.values());
  }

  async getPendingGhanaCardVerifications(): Promise<User[]> {
    if (this.usePostgres && this.pool) {
      try {
        const result = await this.pool.query(`
          SELECT * FROM users 
          WHERE ghana_card IS NOT NULL 
          AND ghana_card->>'verified' = 'false'
          ORDER BY created_at DESC
        `);
        return result.rows.map((row) => ({
          id: row.id,
          email: row.email,
          phone: row.phone,
          name: row.name,
          password: row.password,
          role: row.role,
          studentId: row.student_id,
          isVerified: row.is_verified,
          ghanaCard: row.ghana_card,
          createdAt: new Date(row.created_at),
        }));
      } catch (error) {
        console.error("Error getting pending verifications:", error);
      }
    }

    return Array.from(this.users.values()).filter(
      (user) => user.ghanaCard && !user.ghanaCard.verified,
    );
  }

  // OTP methods
  async createOTPSession(phone: string, otp: string): Promise<OTPSession> {
    const session: OTPSession = {
      phone,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      verified: false,
    };

    if (this.usePostgres && this.pool) {
      try {
        await this.pool.query(
          `
          INSERT INTO otp_sessions (phone, otp, expires_at, verified, created_at)
          VALUES ($1, $2, $3, $4, NOW())
          ON CONFLICT (phone) DO UPDATE SET
          otp = $2, expires_at = $3, verified = $4, created_at = NOW()
        `,
          [phone, otp, session.expiresAt, false],
        );
      } catch (error) {
        console.error("Error creating OTP session:", error);
      }
    }

    this.otpSessions.set(phone, session);
    return session;
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    if (this.usePostgres && this.pool) {
      try {
        const result = await this.pool.query(
          `
          UPDATE otp_sessions 
          SET verified = true 
          WHERE phone = $1 AND otp = $2 AND expires_at > NOW() AND verified = false
          RETURNING *
        `,
          [phone, otp],
        );

        return result.rows.length > 0;
      } catch (error) {
        console.error("Error verifying OTP:", error);
      }
    }

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

  async clearOTPSession(phone: string): Promise<void> {
    if (this.usePostgres && this.pool) {
      try {
        await this.pool.query("DELETE FROM otp_sessions WHERE phone = $1", [
          phone,
        ]);
      } catch (error) {
        console.error("Error clearing OTP session:", error);
      }
    }
    this.otpSessions.delete(phone);
  }

  // Document request methods - simplified for now
  async createRequest(
    requestData: Omit<DocumentRequest, "id" | "createdAt" | "updatedAt">,
  ): Promise<DocumentRequest> {
    const request: DocumentRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...requestData,
    };
    this.requests.set(request.id, request);
    return request;
  }

  async getRequestsByUserId(userId: string): Promise<DocumentRequest[]> {
    return Array.from(this.requests.values()).filter(
      (req) => req.userId === userId,
    );
  }

  async getAllRequests(): Promise<DocumentRequest[]> {
    return Array.from(this.requests.values());
  }
}

export const db = new DatabaseService();
