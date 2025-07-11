import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "student"]);
export const documentTypeEnum = pgEnum("document_type", [
  "transcript",
  "certificate",
  "attestation",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "processing",
  "ready",
  "completed",
  "rejected",
]);
export const deliveryMethodEnum = pgEnum("delivery_method", [
  "digital",
  "courier",
  "cash_on_delivery",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "paystack",
  "cash_on_delivery",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  studentId: varchar("student_id", { length: 50 }),
  isVerified: boolean("is_verified").default(false),
  ghanaCard: jsonb("ghana_card").$type<{
    number: string;
    imageUrl: string;
    verified: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document requests table
export const documentRequests = pgTable("document_requests", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  type: documentTypeEnum("type").notNull(),
  subType: varchar("sub_type", { length: 100 }),
  status: requestStatusEnum("status").default("pending"),
  deliveryMethod: deliveryMethodEnum("delivery_method").notNull(),
  deliveryAddress: text("delivery_address"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  isPaid: boolean("is_paid").default(false),
  paymentMethod: paymentMethodEnum("payment_method"),
  paymentReference: varchar("payment_reference", { length: 255 }),
  documents: jsonb("documents").$type<string[]>().default([]),
  notes: text("notes"),
  adminNotes: text("admin_notes"),
  downloadUrl: varchar("download_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// OTP sessions table
export const otpSessions = pgTable("otp_sessions", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  phone: varchar("phone", { length: 20 }).notNull(),
  otp: varchar("otp", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit logs table for tracking all activities
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads table
export const fileUploads = pgTable("file_uploads", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: uuid("user_id").references(() => users.id),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: decimal("size").notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  purpose: varchar("purpose", { length: 100 }).notNull(), // 'ghana_card', 'document', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DocumentRequest = typeof documentRequests.$inferSelect;
export type NewDocumentRequest = typeof documentRequests.$inferInsert;
export type OTPSession = typeof otpSessions.$inferSelect;
export type NewOTPSession = typeof otpSessions.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type FileUpload = typeof fileUploads.$inferSelect;
export type NewFileUpload = typeof fileUploads.$inferInsert;
