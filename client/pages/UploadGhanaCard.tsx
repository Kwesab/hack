import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileImage,
  Check,
  X,
  AlertCircle,
  CreditCard,
  Shield,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadGhanaCard() {
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !ghanaCardNumber) {
      alert("Please select a file and enter Ghana Card number");
      return;
    }

    setIsUploading(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("ghanaCard", selectedFile);
      formData.append("ghanaCardNumber", ghanaCardNumber);

      const response = await fetch("/api/upload/ghana-card", {
        method: "POST",
        headers: {
          "X-User-Id": userId,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (result.success) {
        setUploadComplete(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        alert(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elevation-3 border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-success">Upload Successful!</CardTitle>
            <CardDescription>
              Your Ghana Card has been uploaded and is pending verification.
              You'll be notified once it's verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                className="w-full bg-success hover:bg-success/90"
                onClick={() => navigate("/dashboard")}
              >
                Continue to Dashboard
              </Button>
              <div className="bg-info/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium text-info">
                    What's Next?
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Our admin team will verify your Ghana Card within 24-48 hours.
                  You can request documents once verification is complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ttu-light-blue via-background to-ttu-gray flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-ttu-navy to-primary rounded-xl flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-ttu-navy">
                Upload Ghana Card
              </h1>
              <p className="text-sm text-muted-foreground">
                Verify Your Identity
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-elevation-3 border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-ttu-navy">
              Ghana Card Verification Required
            </CardTitle>
            <CardDescription>
              Upload a clear photo of your Ghana Card to verify your identity
              and access document services.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Ghana Card Number */}
            <div className="space-y-2">
              <Label htmlFor="ghanaCardNumber">Ghana Card Number</Label>
              <Input
                id="ghanaCardNumber"
                type="text"
                placeholder="GHA-XXXXXXXXX-X"
                value={ghanaCardNumber}
                onChange={(e) => setGhanaCardNumber(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Enter the Ghana Card number exactly as shown on your card
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label>Ghana Card Image</Label>

              {!selectedFile && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer space-y-4 block"
                  >
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload Ghana Card image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, or JPEG (max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {selectedFile && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center gap-3 mb-3">
                      <FileImage className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Ghana Card Preview"
                          className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-success/10 text-success">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Guidelines */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Photo Guidelines
                </span>
              </div>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Ensure all text on the card is clearly readable</li>
                <li>• Take photo in good lighting conditions</li>
                <li>• Avoid glare, shadows, or blur</li>
                <li>• Include the entire card in the frame</li>
                <li>• File size should be less than 5MB</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/dashboard")}
              >
                Skip for Now
              </Button>
              <Button
                className="flex-1 bg-ttu-navy hover:bg-ttu-navy/90"
                onClick={handleUpload}
                disabled={!selectedFile || !ghanaCardNumber || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Verify
                  </>
                )}
              </Button>
            </div>

            {/* Security Info */}
            <div className="bg-ttu-light-blue/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-ttu-navy" />
                <span className="text-sm font-medium text-ttu-navy">
                  Secure & Confidential
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your Ghana Card information is encrypted and stored securely.
                It's only used for identity verification and document
                processing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
