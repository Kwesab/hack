interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  log(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
    const logEntry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...entry,
    };

    this.logs.push(logEntry);

    // Keep only last 1000 entries
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // In production, you would save to a database
    console.log("AUDIT LOG:", logEntry);
  }

  // User authentication activities
  logUserLogin(
    userId: string,
    phone: string,
    success: boolean,
    ipAddress?: string,
  ) {
    this.log({
      userId,
      action: "USER_LOGIN",
      resource: "authentication",
      resourceId: userId,
      details: { phone, method: "otp" },
      ipAddress,
      success,
    });
  }

  logUserRegistration(userId: string, phone: string, success: boolean) {
    this.log({
      userId,
      action: "USER_REGISTRATION",
      resource: "user",
      resourceId: userId,
      details: { phone },
      success,
    });
  }

  // Document request activities
  logRequestCreation(
    userId: string,
    requestId: string,
    requestType: string,
    success: boolean,
  ) {
    this.log({
      userId,
      action: "REQUEST_CREATED",
      resource: "document_request",
      resourceId: requestId,
      details: { type: requestType },
      success,
    });
  }

  logRequestStatusUpdate(
    adminUserId: string,
    requestId: string,
    oldStatus: string,
    newStatus: string,
    success: boolean,
  ) {
    this.log({
      userId: adminUserId,
      action: "REQUEST_STATUS_UPDATED",
      resource: "document_request",
      resourceId: requestId,
      details: { oldStatus, newStatus },
      success,
    });
  }

  logPaymentProcessed(
    userId: string,
    requestId: string,
    amount: number,
    method: string,
    success: boolean,
  ) {
    this.log({
      userId,
      action: "PAYMENT_PROCESSED",
      resource: "payment",
      resourceId: requestId,
      details: { amount, method },
      success,
    });
  }

  // Ghana Card verification activities
  logGhanaCardUpload(userId: string, cardNumber: string, success: boolean) {
    this.log({
      userId,
      action: "GHANA_CARD_UPLOADED",
      resource: "ghana_card",
      resourceId: userId,
      details: { cardNumber: cardNumber.substring(0, 8) + "***" }, // Mask sensitive data
      success,
    });
  }

  logGhanaCardVerification(
    adminUserId: string,
    targetUserId: string,
    verified: boolean,
    success: boolean,
  ) {
    this.log({
      userId: adminUserId,
      action: "GHANA_CARD_VERIFIED",
      resource: "ghana_card",
      resourceId: targetUserId,
      details: { verified },
      success,
    });
  }

  // Document generation activities
  logDocumentGenerated(
    userId: string,
    requestId: string,
    documentType: string,
    success: boolean,
  ) {
    this.log({
      userId,
      action: "DOCUMENT_GENERATED",
      resource: "document",
      resourceId: requestId,
      details: { type: documentType },
      success,
    });
  }

  logDocumentDownloaded(
    userId: string,
    requestId: string,
    documentType: string,
    success: boolean,
  ) {
    this.log({
      userId,
      action: "DOCUMENT_DOWNLOADED",
      resource: "document",
      resourceId: requestId,
      details: { type: documentType },
      success,
    });
  }

  // SMS activities
  logSMSSent(
    userId: string,
    phone: string,
    messageType: string,
    success: boolean,
  ) {
    this.log({
      userId,
      action: "SMS_SENT",
      resource: "sms",
      resourceId: `${phone}_${Date.now()}`,
      details: { messageType, phone },
      success,
    });
  }

  // Admin activities
  logAdminAction(
    adminUserId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details: any,
  ) {
    this.log({
      userId: adminUserId,
      action: `ADMIN_${action.toUpperCase()}`,
      resource: resourceType,
      resourceId,
      details,
      success: true,
    });
  }

  // System activities
  logSystemEvent(
    action: string,
    resourceType: string,
    resourceId: string,
    details: any,
    success: boolean,
  ) {
    this.log({
      action: `SYSTEM_${action.toUpperCase()}`,
      resource: resourceType,
      resourceId,
      details,
      success,
    });
  }

  // Query methods
  getAllLogs(): AuditLogEntry[] {
    return [...this.logs].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  getLogsByUser(userId: string): AuditLogEntry[] {
    return this.logs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getLogsByAction(action: string): AuditLogEntry[] {
    return this.logs
      .filter((log) => log.action === action)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    return this.logs
      .filter((log) => log.timestamp >= startDate && log.timestamp <= endDate)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getLogsByResource(resource: string, resourceId?: string): AuditLogEntry[] {
    let filtered = this.logs.filter((log) => log.resource === resource);

    if (resourceId) {
      filtered = filtered.filter((log) => log.resourceId === resourceId);
    }

    return filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  // Analytics
  getLoginAttempts(timeframe: "hour" | "day" | "week" = "day"): {
    total: number;
    successful: number;
    failed: number;
  } {
    const now = new Date();
    let startTime: Date;

    switch (timeframe) {
      case "hour":
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const loginLogs = this.logs.filter(
      (log) => log.action === "USER_LOGIN" && log.timestamp >= startTime,
    );

    return {
      total: loginLogs.length,
      successful: loginLogs.filter((log) => log.success).length,
      failed: loginLogs.filter((log) => !log.success).length,
    };
  }

  getRequestStatistics(): {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  } {
    const requestLogs = this.logs.filter(
      (log) => log.action === "REQUEST_CREATED",
    );
    const statusLogs = this.logs.filter(
      (log) => log.action === "REQUEST_STATUS_UPDATED",
    );

    const byType: Record<string, number> = {};
    requestLogs.forEach((log) => {
      const type = log.details.type;
      byType[type] = (byType[type] || 0) + 1;
    });

    const byStatus: Record<string, number> = {};
    statusLogs.forEach((log) => {
      const status = log.details.newStatus;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total: requestLogs.length,
      byType,
      byStatus,
    };
  }

  // Initialize with sample data
  initSampleData() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Sample login activities
    this.logUserLogin("user_1", "233501234567", true);
    this.logUserLogin("user_2", "233241234567", true);
    this.logUserLogin("user_unknown", "233999999999", false);

    // Sample request activities
    this.logRequestCreation("user_1", "req_1", "transcript", true);
    this.logRequestCreation("user_2", "req_2", "certificate", true);
    this.logRequestStatusUpdate(
      "admin_1",
      "req_1",
      "pending",
      "processing",
      true,
    );
    this.logRequestStatusUpdate(
      "admin_1",
      "req_1",
      "processing",
      "completed",
      true,
    );

    // Sample payment activities
    this.logPaymentProcessed("user_1", "req_1", 50, "mobile_money", true);
    this.logPaymentProcessed("user_2", "req_2", 30, "mobile_money", true);

    // Sample Ghana Card activities
    this.logGhanaCardUpload("user_1", "GHA-123456789-0", true);
    this.logGhanaCardVerification("admin_1", "user_1", true, true);

    // Sample document activities
    this.logDocumentGenerated("user_1", "req_1", "transcript", true);
    this.logDocumentDownloaded("user_1", "req_1", "transcript", true);

    // Sample SMS activities
    this.logSMSSent("user_1", "233501234567", "otp", true);
    this.logSMSSent("user_1", "233501234567", "status_update", true);
  }
}

export const auditLogger = new AuditLogger();

// Initialize with sample data
auditLogger.initSampleData();
