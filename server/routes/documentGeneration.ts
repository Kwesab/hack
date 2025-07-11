import { RequestHandler } from "express";
import { z } from "zod";
import { pdfGeneratorService } from "../services/pdfGenerator";
import { db } from "../db/database";

// Generate and download document as PDF
export const generateAndDownloadDocument: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    // Get user details
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get the actual request from database
    const requests = await db.getRequestsByUserId(userId);
    const request = requests.find((req) => req.id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Document request not found",
      });
    }

    // Check if request belongs to user
    if (request.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this document",
      });
    }

    // PAYMENT VERIFICATION: Check if request is paid before allowing document generation
    if (!request.isPaid) {
      return res.status(402).json({
        success: false,
        message:
          "Payment required. Please complete payment before downloading your document.",
        status: request.status,
        isPaid: request.isPaid,
        amount: request.amount,
        requestId: request.id,
      });
    }

    // Check if request is completed
    if (request.status !== "completed" && request.status !== "ready") {
      return res.status(400).json({
        success: false,
        message:
          "Document is not ready for download. Please wait for processing to complete.",
        status: request.status,
        isPaid: request.isPaid,
      });
    }

    // Prepare document data with real user information
    const documentData = {
      studentName: user.name,
      studentId: user.studentId || "TTU/UNKNOWN/2024",
      documentType: request.type,
      subType: request.subType,
      graduationDate: this.generateGraduationDate(
        user.studentId || "TTU/CS/2020/001",
      ),
      degreeProgram: this.generateDegreeTitle(
        user.department || "Computer Science",
        "undergraduate",
      ),
      gpa: this.generateGPA(user.studentId || "TTU/CS/2020/001"),
      classification: this.getClassification(
        this.generateGPA(user.studentId || "TTU/CS/2020/001"),
      ),
      issueDate: new Date().toLocaleDateString(),
      requestId: request.id,
      department: user.department,
      entranceYear: this.extractYearFromStudentId(
        user.studentId || "TTU/CS/2020/001",
      ).toString(),
      academicLevel: "undergraduate",
      studyPeriod: this.generateStudyPeriod(
        user.studentId || "TTU/CS/2020/001",
        "undergraduate",
      ),
      phone: user.phone,
      email: user.email,
    };

    try {
      // Generate PDF
      const pdfBuffer = await pdfGeneratorService.generateDocumentPDF(
        request.type,
        documentData,
      );

      // Set response headers for PDF download
      const filename = `TTU_${request.type}_${user.studentId}_${Date.now()}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Send the PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate document",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Generate Document Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Preview document (returns PDF for viewing)
export const previewDocument: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get the actual request from database
    const requests = await db.getRequestsByUserId(userId);
    const request = requests.find((req) => req.id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Document request not found",
      });
    }

    // PAYMENT VERIFICATION: Check if request is paid before allowing preview
    if (!request.isPaid) {
      return res.status(402).json({
        success: false,
        message:
          "Payment required. Please complete payment before previewing your document.",
        status: request.status,
        isPaid: request.isPaid,
        amount: request.amount,
        requestId: request.id,
      });
    }

    // Prepare document data with actual request info and real user data
    const documentData = {
      studentName: user.name,
      studentId: user.studentId || "TTU/UNKNOWN/2024",
      documentType: request.type,
      subType: request.subType,
      graduationDate: this.generateGraduationDate(
        user.studentId || "TTU/CS/2020/001",
      ),
      degreeProgram: this.generateDegreeTitle(
        user.department || "Computer Science",
        "undergraduate",
      ),
      gpa: this.generateGPA(user.studentId || "TTU/CS/2020/001"),
      classification: this.getClassification(
        this.generateGPA(user.studentId || "TTU/CS/2020/001"),
      ),
      issueDate: new Date().toLocaleDateString(),
      requestId: request.id,
      department: user.department,
      entranceYear: this.extractYearFromStudentId(
        user.studentId || "TTU/CS/2020/001",
      ).toString(),
      academicLevel: "undergraduate",
      studyPeriod: this.generateStudyPeriod(
        user.studentId || "TTU/CS/2020/001",
        "undergraduate",
      ),
      phone: user.phone,
      email: user.email,
    };

    try {
      const pdfBuffer = await pdfGeneratorService.generateDocumentPDF(
        request.type,
        documentData,
      );

      // Set headers for inline PDF viewing
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Content-Length", pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF preview error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate preview",
      });
    }
  } catch (error) {
    console.error("Preview Document Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get document info
export const getDocumentInfo: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // Mock document info
    const documentInfo = {
      id: requestId,
      type: "transcript",
      subType: "undergraduate",
      status: "completed",
      isPaid: true,
      amount: 50,
      paymentMethod: "paystack",
      deliveryMethod: "digital",
      isDownloadable: true,
      downloadUrl: `/api/documents/download/${requestId}`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: documentInfo,
    });
  } catch (error) {
    console.error("Get Document Info Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Generate document for any user
export const adminGenerateDocument: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Verify admin authentication and role
    const adminUserId = req.headers["x-user-id"] as string;
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const adminUser = await db.getUserById(adminUserId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Get the actual request from database
    const allRequests = await db.getAllRequests();
    const request = allRequests.find((req) => req.id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Document request not found",
      });
    }

    // Get the student user details
    const student = await db.getUserById(request.userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Prepare document data with actual student and request info using real data
    const documentData = {
      studentName: student.name,
      studentId: student.studentId || "TTU/UNKNOWN/2024",
      documentType: request.type,
      subType: request.subType,
      graduationDate: this.generateGraduationDate(
        student.studentId || "TTU/CS/2020/001",
      ),
      degreeProgram: this.generateDegreeTitle(
        student.department || "Computer Science",
        "undergraduate",
      ),
      gpa: this.generateGPA(student.studentId || "TTU/CS/2020/001"),
      classification: this.getClassification(
        this.generateGPA(student.studentId || "TTU/CS/2020/001"),
      ),
      issueDate: new Date().toLocaleDateString(),
      requestId: request.id,
      department: student.department,
      entranceYear: this.extractYearFromStudentId(
        student.studentId || "TTU/CS/2020/001",
      ).toString(),
      academicLevel: "undergraduate",
      studyPeriod: this.generateStudyPeriod(
        student.studentId || "TTU/CS/2020/001",
        "undergraduate",
      ),
      phone: student.phone,
      email: student.email,
    };

    try {
      const pdfBuffer = await pdfGeneratorService.generateDocumentPDF(
        request.type,
        documentData,
      );

      const filename = `TTU_${request.type}_${documentData.studentId}_${Date.now()}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error("Admin PDF generation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate document",
      });
    }
  } catch (error) {
    console.error("Admin Generate Document Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get available document types and pricing
export const getDocumentTypes: RequestHandler = async (req, res) => {
  try {
    const documentTypes = [
      {
        type: "transcript",
        name: "Academic Transcript",
        description: "Official academic record showing all courses and grades",
        basePrice: 50,
        deliveryOptions: [
          {
            method: "digital",
            name: "Digital Download (PDF)",
            additionalCost: 0,
            estimatedDelivery: "Immediate after payment",
          },
          {
            method: "courier",
            name: "Courier Delivery",
            additionalCost: 20,
            estimatedDelivery: "3-5 business days",
          },
          {
            method: "cash_on_delivery",
            name: "Cash on Delivery",
            additionalCost: 25,
            estimatedDelivery: "5-7 business days",
          },
        ],
      },
      {
        type: "certificate",
        name: "Degree Certificate",
        description: "Official certificate of degree completion",
        basePrice: 30,
        deliveryOptions: [
          {
            method: "digital",
            name: "Digital Download (PDF)",
            additionalCost: 0,
            estimatedDelivery: "Immediate after payment",
          },
          {
            method: "courier",
            name: "Courier Delivery",
            additionalCost: 25,
            estimatedDelivery: "3-5 business days",
          },
          {
            method: "cash_on_delivery",
            name: "Cash on Delivery",
            additionalCost: 30,
            estimatedDelivery: "5-7 business days",
          },
        ],
      },
      {
        type: "attestation",
        name: "Letter of Attestation",
        description: "Official letter confirming academic status",
        basePrice: 25,
        deliveryOptions: [
          {
            method: "digital",
            name: "Digital Download (PDF)",
            additionalCost: 0,
            estimatedDelivery: "Immediate after payment",
          },
          {
            method: "courier",
            name: "Courier Delivery",
            additionalCost: 15,
            estimatedDelivery: "3-5 business days",
          },
          {
            method: "cash_on_delivery",
            name: "Cash on Delivery",
            additionalCost: 20,
            estimatedDelivery: "5-7 business days",
          },
        ],
      },
    ];

    res.json({
      success: true,
      data: documentTypes,
    });
  } catch (error) {
    console.error("Get Document Types Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
