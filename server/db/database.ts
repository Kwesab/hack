import { Pool } from "pg";

// Database interfaces
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  password: string;
  role: "admin" | "student" | "hod";
  department?: string;
  studentId?: string;
  isVerified: boolean;
  ghanaCard?: {
    number: string;
    imageUrl: string;
    verified: boolean;
  };
  digitalSignature?: string;
  createdAt: Date;
}

export interface DocumentRequest {
  id: string;
  userId: string;
  userDepartment?: string;
  type: "transcript" | "certificate" | "attestation";
  subType?: string;
  status:
    | "pending"
    | "processing"
    | "ready"
    | "completed"
    | "rejected"
    | "confirmed";
  deliveryMethod: "digital" | "courier" | "cash_on_delivery";
  deliveryAddress?: string;
  amount: number;
  isPaid: boolean;
  paymentMethod?: "paystack" | "cash_on_delivery";
  paymentReference?: string;
  documents: string[];
  notes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  hodSignature?: string;
  hodId?: string;
  downloadUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  reviewedAt?: Date;
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
        phone VARCHAR,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        role VARCHAR DEFAULT 'student',
        department VARCHAR,
        student_id VARCHAR,
        is_verified BOOLEAN DEFAULT false,
        ghana_card JSONB,
        digital_signature TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const createDocumentRequestsTable = `
      CREATE TABLE IF NOT EXISTS document_requests (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL,
        user_department VARCHAR,
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
        rejection_reason TEXT,
        hod_signature TEXT,
        hod_id VARCHAR,
        download_url VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP,
        reviewed_at TIMESTAMP
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
          INSERT INTO users (id, email, phone, name, password, role, department, is_verified, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `,
          [
            `admin_${Date.now()}`,
            "admin@ttu.edu.gh",
            "0552873245",
            "Admin User",
            "admin123",
            "admin",
            "Administration",
            true,
          ],
        );

        // Add HOD for Computer Science Department
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, department, is_verified, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `,
          [
            `hod_cs_${Date.now()}`,
            "hod.cs@ttu.edu.gh",
            "0245384940",
            "Dr. CS Department Head",
            "hod123",
            "hod",
            "Computer Science",
            true,
          ],
        );

        // Add HOD for Electrical Engineering Department
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, department, is_verified, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `,
          [
            `hod_ee_${Date.now()}`,
            "hod.ee@ttu.edu.gh",
            "0233456789",
            "Dr. EE Department Head",
            "hod123",
            "hod",
            "Electrical Engineering",
            true,
          ],
        );

        // Add sample student with Ghana card
        await this.pool.query(
          `
          INSERT INTO users (id, email, phone, name, password, role, department, student_id, is_verified, ghana_card, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        `,
          [
            `student_${Date.now()}`,
            "john.doe@student.ttu.edu.gh",
            "0533745869",
            "John Doe",
            "student123",
            "student",
            "Computer Science",
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
          INSERT INTO users (id, email, phone, name, password, role, department, student_id, is_verified, ghana_card, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        `,
          [
            `student_pending_${Date.now()}`,
            "test.student@student.ttu.edu.gh",
            "0537370435",
            "Test Student",
            "student123",
            "student",
            "Electrical Engineering",
            "TTU/EE/2022/003",
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
    // Create comprehensive admin user
    const adminUser: User = {
      id: `admin_${Date.now()}`,
      email: "admin@ttu.edu.gh",
      phone: "0552873245",
      name: "Admin User",
      password: "admin123",
      role: "admin",
      department: "Administration",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create HOD for Computer Science
    const hodCS: User = {
      id: `hod_cs_${Date.now()}`,
      email: "hod.cs@ttu.edu.gh",
      phone: "0245384940",
      name: "Dr. CS Department Head",
      password: "hod123",
      role: "hod",
      department: "Computer Science",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(hodCS.id, hodCS);

    // Create HOD for Electrical Engineering
    const hodEE: User = {
      id: `hod_ee_${Date.now()}`,
      email: "hod.ee@ttu.edu.gh",
      phone: "0233456789",
      name: "Dr. EE Department Head",
      password: "hod123",
      role: "hod",
      department: "Electrical Engineering",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(hodEE.id, hodEE);

    // Create student with verified Ghana Card
    const studentUser: User = {
      id: `student_${Date.now()}`,
      email: "john.doe@student.ttu.edu.gh",
      phone: "0533745869",
      name: "John Doe",
      password: "student123",
      role: "student",
      department: "Computer Science",
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
      phone: "0537370435",
      name: "Test Student",
      password: "student123",
      role: "student",
      department: "Electrical Engineering",
      studentId: "TTU/EE/2022/003",
      isVerified: true,
      ghanaCard: {
        number: "GHA-123456789-2",
        imageUrl: "/uploads/test-ghana-card.jpg",
        verified: false,
      },
      createdAt: new Date(),
    };
    this.users.set(testStudent.id, testStudent);

    // Create student without Ghana card
    const newStudent: User = {
      id: `student_new_${Date.now()}`,
      email: "jane.smith@student.ttu.edu.gh",
      phone: "0533745869",
      name: "Jane Smith",
      password: "student123",
      role: "student",
      department: "Mechanical Engineering",
      studentId: "TTU/ME/2021/002",
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(newStudent.id, newStudent);

    // Create additional test students
    const moreStudents = [
      {
        id: `student_cs_${Date.now()}_1`,
        email: "michael.asante@student.ttu.edu.gh",
        phone: "0537370435",
        name: "Michael Asante",
        password: "student123",
        role: "student" as const,
        department: "Computer Science",
        studentId: "TTU/CS/2021/004",
        isVerified: true,
        ghanaCard: {
          number: "GHA-234567890-1",
          imageUrl: "/uploads/ghana-card-michael.jpg",
          verified: true,
        },
        createdAt: new Date(),
      },
      {
        id: `student_ee_${Date.now()}_2`,
        email: "sarah.mensah@student.ttu.edu.gh",
        phone: "0537370435",
        name: "Sarah Mensah",
        password: "student123",
        role: "student" as const,
        department: "Electrical Engineering",
        studentId: "TTU/EE/2020/005",
        isVerified: true,
        ghanaCard: {
          number: "GHA-345678901-2",
          imageUrl: "/uploads/ghana-card-sarah.jpg",
          verified: false,
        },
        createdAt: new Date(),
      },
      {
        id: `student_me_${Date.now()}_3`,
        email: "kwame.osei@student.ttu.edu.gh",
        phone: "0537370435",
        name: "Kwame Osei",
        password: "student123",
        role: "student" as const,
        department: "Mechanical Engineering",
        studentId: "TTU/ME/2019/006",
        isVerified: true,
        createdAt: new Date(),
      },
    ];

    moreStudents.forEach((student) => {
      this.users.set(student.id, student);
    });

    // Create sample document requests with department mapping
    const sampleRequests = [
      {
        id: `req_${Date.now()}_1`,
        userId: studentUser.id,
        userDepartment: "Computer Science",
        type: "transcript" as const,
        subType: "undergraduate",
        status: "completed" as const,
        deliveryMethod: "digital" as const,
        amount: 50,
        isPaid: true,
        paymentMethod: "paystack" as const,
        paymentReference: "TTU_1234567890_abc",
        documents: [],
        notes: "Urgent request for job application",
        downloadUrl: "/api/documents/download/req_sample_1",
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: `req_${Date.now()}_2`,
        userId: testStudent.id,
        userDepartment: "Electrical Engineering",
        type: "certificate" as const,
        subType: "degree",
        status: "processing" as const,
        deliveryMethod: "courier" as const,
        deliveryAddress: "123 Main Street, Takoradi, Ghana",
        amount: 55,
        isPaid: true,
        paymentMethod: "paystack" as const,
        paymentReference: "TTU_1234567891_def",
        documents: [],
        notes: "Need for visa application",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(),
      },
      {
        id: `req_${Date.now()}_3`,
        userId: newStudent.id,
        userDepartment: "Mechanical Engineering",
        type: "attestation" as const,
        status: "pending" as const,
        deliveryMethod: "cash_on_delivery" as const,
        deliveryAddress: "456 University Road, Cape Coast, Ghana",
        amount: 45,
        isPaid: false,
        documents: [],
        notes: "Letter of attestation for employment",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleRequests.forEach((request) => {
      this.requests.set(request.id, request);
    });

    console.log(
      "📊 In-memory database initialized with comprehensive sample data",
    );
    console.log(
      `👥 Created ${this.users.size} users (1 admin, 2 HODs, ${this.users.size - 3} students)`,
    );
    console.log(`📄 Created ${this.requests.size} sample document requests`);
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
          INSERT INTO users (id, email, phone, name, password, role, department, student_id, is_verified, ghana_card, digital_signature, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        `,
          [
            user.id,
            user.email,
            user.phone,
            user.name,
            user.password,
            user.role,
            user.department || null,
            user.studentId || null,
            user.isVerified,
            user.ghanaCard ? JSON.stringify(user.ghanaCard) : null,
            user.digitalSignature || null,
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
            department: row.department,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            digitalSignature: row.digital_signature,
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
            department: row.department,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            digitalSignature: row.digital_signature,
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
            department: row.department,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            digitalSignature: row.digital_signature,
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
        if (updates.department !== undefined) {
          setClause.push(`department = $${paramIndex++}`);
          values.push(updates.department);
        }
        if (updates.isVerified !== undefined) {
          setClause.push(`is_verified = $${paramIndex++}`);
          values.push(updates.isVerified);
        }
        if (updates.ghanaCard !== undefined) {
          setClause.push(`ghana_card = $${paramIndex++}`);
          values.push(JSON.stringify(updates.ghanaCard));
        }
        if (updates.digitalSignature !== undefined) {
          setClause.push(`digital_signature = $${paramIndex++}`);
          values.push(updates.digitalSignature);
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
            department: row.department,
            studentId: row.student_id,
            isVerified: row.is_verified,
            ghanaCard: row.ghana_card,
            digitalSignature: row.digital_signature,
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
          department: row.department,
          studentId: row.student_id,
          isVerified: row.is_verified,
          ghanaCard: row.ghana_card,
          digitalSignature: row.digital_signature,
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
          department: row.department,
          studentId: row.student_id,
          isVerified: row.is_verified,
          ghanaCard: row.ghana_card,
          digitalSignature: row.digital_signature,
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

  // Document request methods
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

  async getRequestsByDepartment(
    department: string,
  ): Promise<DocumentRequest[]> {
    return Array.from(this.requests.values()).filter(
      (req) => req.userDepartment === department,
    );
  }

  async updateRequest(
    requestId: string,
    updates: Partial<DocumentRequest>,
  ): Promise<DocumentRequest | undefined> {
    const request = this.requests.get(requestId);
    if (request) {
      const updatedRequest = {
        ...request,
        ...updates,
        updatedAt: new Date(),
        ...(updates.status === "completed" &&
          !request.completedAt && { completedAt: new Date() }),
        ...(updates.status === "confirmed" ||
          (updates.status === "rejected" && { reviewedAt: new Date() })),
      };
      this.requests.set(requestId, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  async getRequestById(
    requestId: string,
  ): Promise<DocumentRequest | undefined> {
    return this.requests.get(requestId);
  }

  // Department-related methods
  async getDepartments(): Promise<string[]> {
    const users = await this.getAllUsers();
    const departments = new Set<string>();

    users.forEach((user) => {
      if (user.department) {
        departments.add(user.department);
      }
    });

    return Array.from(departments).sort();
  }

  async getHODsByDepartment(): Promise<Record<string, User[]>> {
    const users = await this.getAllUsers();
    const hodsByDept: Record<string, User[]> = {};

    users
      .filter((user) => user.role === "hod" && user.department)
      .forEach((hod) => {
        if (!hodsByDept[hod.department!]) {
          hodsByDept[hod.department!] = [];
        }
        hodsByDept[hod.department!].push(hod);
      });

    return hodsByDept;
  }
}

export const db = new DatabaseService();
