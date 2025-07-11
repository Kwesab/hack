import { RequestHandler } from "express";
import { documentGenerator } from "../services/documentGenerator";
import { db } from "../models";

// Generate document
export const generateDocument: RequestHandler = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = db.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Request must be completed before generating document",
      });
    }

    const user = db.getUserById(request.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare student data
    const studentData = {
      name: user.name,
      studentId: user.studentId || "TTU/CS/2024/001",
      email: user.email,
      phone: user.phone,
      program: "Bachelor of Technology in Computer Science",
      graduationYear: "June 2024",
      gpa: 3.45,
    };

    // Prepare request data
    const requestData = {
      id: request.id,
      type: request.type,
      subType: request.subType,
      createdAt: new Date(request.createdAt),
      completedAt: new Date(request.updatedAt),
    };

    // Additional data based on document type
    const additionalData = {
      degreeTitle: "Bachelor of Technology in Computer Science",
      studyPeriod: "September 2020 - June 2024",
      academicStatus: "Graduate in Good Standing",
      purpose: "employment verification",
    };

    // Generate the document
    const documentHtml = documentGenerator.generateDocument(
      studentData,
      requestData,
      additionalData,
    );

    // Set appropriate headers for HTML download
    res.setHeader("Content-Type", "text/html");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${request.type}-${request.id}.html"`,
    );

    res.send(documentHtml);
  } catch (error) {
    console.error("Generate document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate document",
    });
  }
};

// Generate PDF (placeholder for future implementation)
export const generatePDF: RequestHandler = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = db.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // For now, return a message about PDF generation
    res.json({
      success: false,
      message:
        "PDF generation not implemented yet. Please use HTML download for now.",
    });
  } catch (error) {
    console.error("Generate PDF error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
    });
  }
};

// Preview document before generation
export const previewDocument: RequestHandler = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = db.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const user = db.getUserById(request.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare student data
    const studentData = {
      name: user.name,
      studentId: user.studentId || "TTU/CS/2024/001",
      email: user.email,
      phone: user.phone,
      program: "Bachelor of Technology in Computer Science",
      graduationYear: "June 2024",
      gpa: 3.45,
    };

    // Prepare request data
    const requestData = {
      id: request.id,
      type: request.type,
      subType: request.subType,
      createdAt: new Date(request.createdAt),
      completedAt: new Date(request.updatedAt),
    };

    // Additional data based on document type
    const additionalData = {
      degreeTitle: "Bachelor of Technology in Computer Science",
      studyPeriod: "September 2020 - June 2024",
      academicStatus: "Graduate in Good Standing",
      purpose: "employment verification",
    };

    // Generate the document
    const documentHtml = documentGenerator.generateDocument(
      studentData,
      requestData,
      additionalData,
    );

    // Return HTML content for preview
    res.setHeader("Content-Type", "text/html");
    res.send(documentHtml);
  } catch (error) {
    console.error("Preview document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to preview document",
    });
  }
};

// Get document info (metadata)
export const getDocumentInfo: RequestHandler = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = db.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const user = db.getUserById(request.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const documentInfo = {
      requestId: request.id,
      documentType: request.type,
      subType: request.subType,
      status: request.status,
      studentName: user.name,
      studentId: user.studentId,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      isGeneratable: request.status === "completed",
      estimatedSize: "150-200 KB",
      format: "HTML/PDF",
    };

    res.json({
      success: true,
      documentInfo,
    });
  } catch (error) {
    console.error("Get document info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get document info",
    });
  }
};
