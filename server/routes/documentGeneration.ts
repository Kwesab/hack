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

    // For demo purposes, we'll create a mock request
    // In real implementation, fetch the actual request from database
    const mockRequest = {
      id: requestId,
      userId,
      type: "transcript" as const,
      subType: "undergraduate",
      status: "completed" as const,
      isPaid: true,
      createdAt: new Date(),
    };

    // Check if request belongs to user
    if (mockRequest.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this document",
      });
    }

    // Check if request is completed and paid
    if (mockRequest.status !== "completed" || !mockRequest.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Document is not ready for download",
        status: mockRequest.status,
        isPaid: mockRequest.isPaid,
      });
    }

    // Prepare document data
    const documentData = {
      studentName: user.name,
      studentId: user.studentId || "TTU/UNKNOWN/2024",
      documentType: mockRequest.type,
      subType: mockRequest.subType,
      graduationDate: "July 2024",
      degreeProgram: "Bachelor of Science in Computer Science",
      gpa: "3.55",
      classification: "Second Class Upper",
      issueDate: new Date().toLocaleDateString(),
      requestId: mockRequest.id,
    };

    try {
      // Generate PDF
      const pdfBuffer = await pdfGeneratorService.generateDocumentPDF(
        mockRequest.type,
        documentData,
      );

      // Set response headers for PDF download
      const filename = `TTU_${mockRequest.type}_${user.studentId}_${Date.now()}.pdf`;

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

    // Mock request data
    const documentData = {
      studentName: user.name,
      studentId: user.studentId || "TTU/DEMO/2024",
      documentType: "transcript",
      subType: "undergraduate",
      graduationDate: "July 2024",
      degreeProgram: "Bachelor of Science in Computer Science",
      gpa: "3.55",
      classification: "Second Class Upper",
      issueDate: new Date().toLocaleDateString(),
      requestId: requestId,
    };

    try {
      const pdfBuffer = await pdfGeneratorService.generateDocumentPDF(
        "transcript",
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

    // In real implementation, verify admin authentication here
    const adminUserId = req.headers["x-user-id"] as string;
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    // Mock request and user data for admin generation
    const documentData = {
      studentName: "John Doe",
      studentId: "TTU/CS/2020/001",
      documentType: "transcript",
      subType: "undergraduate",
      graduationDate: "July 2024",
      degreeProgram: "Bachelor of Science in Computer Science",
      gpa: "3.55",
      classification: "Second Class Upper",
      issueDate: new Date().toLocaleDateString(),
      requestId: requestId,
    };

    try {
      const pdfBuffer = await pdfGeneratorService.generateDocumentPDF(
        "transcript",
        documentData,
      );

      const filename = `TTU_transcript_${documentData.studentId}_${Date.now()}.pdf`;

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
