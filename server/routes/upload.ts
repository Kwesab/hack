import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../db/database";

// Validation schemas
const uploadGhanaCardSchema = z.object({
  cardNumber: z.string().min(10, "Invalid Ghana Card number"),
  imageData: z.string(), // Base64 encoded image
});

// Simulate file upload (In production, use proper file storage like AWS S3, Cloudinary, etc.)
const saveFile = async (
  base64Data: string,
  fileName: string,
): Promise<string> => {
  // In production, save to file storage service and return URL
  // For simulation, we'll just return a mock URL
  return `/uploads/${fileName}`;
};

// Upload Ghana Card
export const uploadGhanaCard: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { cardNumber, imageData } = uploadGhanaCardSchema.parse(req.body);

    // Save the image (simulate)
    const fileName = `ghana-card-${userId}-${Date.now()}.jpg`;
    const imageUrl = await saveFile(imageData, fileName);

    // Update user with Ghana Card info
    const user = db.updateUser(userId, {
      ghanaCard: {
        number: cardNumber,
        imageUrl,
        verified: false, // Will be verified by admin
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Ghana Card uploaded successfully",
      ghanaCard: user.ghanaCard,
    });
  } catch (error) {
    console.error("Upload Ghana Card Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Upload supporting documents for a request
export const uploadDocuments: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const requestId = req.params.requestId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { documents } = req.body; // Array of { name, data } objects

    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No documents provided",
      });
    }

    const request = db.getRequestById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Save all documents
    const documentUrls: string[] = [];
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const fileName = `request-${requestId}-doc-${i + 1}-${Date.now()}.jpg`;
      const url = await saveFile(doc.data, fileName);
      documentUrls.push(url);
    }

    // Update request with document URLs
    const updatedRequest = db.updateRequest(requestId, {
      documents: [...request.documents, ...documentUrls],
    });

    res.json({
      success: true,
      message: "Documents uploaded successfully",
      documents: documentUrls,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Upload Documents Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get uploaded file (serve static files)
export const getFile: RequestHandler = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    // In production, serve from your file storage service
    // For now, we'll return a placeholder response
    res.json({
      message: "File serving not implemented in demo",
      fileName,
      url: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Get File Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify Ghana Card (admin only)
export const verifyGhanaCard: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { verified } = req.body;

    console.log(
      `Verifying Ghana Card for user: ${userId}, verified: ${verified}`,
    );

    const user = await db.getUserById(userId);

    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.ghanaCard) {
      console.log(`Ghana Card not found for user: ${userId}`);
      console.log(`User details:`, {
        id: user.id,
        name: user.name,
        email: user.email,
        hasGhanaCard: !!user.ghanaCard,
        ghanaCard: user.ghanaCard,
      });
      return res.status(404).json({
        success: false,
        message: "Ghana Card not found for this user",
        userId: userId,
        userName: user.name,
        userEmail: user.email,
      });
    }

    console.log(`Found user and Ghana Card, updating verification status...`);

    const updatedUser = db.updateUser(userId, {
      ghanaCard: {
        ...user.ghanaCard,
        verified,
      },
    });

    res.json({
      success: true,
      message: `Ghana Card ${verified ? "verified" : "rejected"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Verify Ghana Card Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
