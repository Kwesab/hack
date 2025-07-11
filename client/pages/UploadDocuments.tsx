import { useState, useRef } from "react";
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
  GraduationCap,
  Upload,
  FileImage,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: string; // Base64 encoded
  preview: string;
}

export default function UploadDocuments() {
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [ghanaCardFile, setGhanaCardFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      setGhanaCardFile({
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64Data,
        preview: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!ghanaCardNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your Ghana Card number",
        variant: "destructive",
      });
      return;
    }

    if (!ghanaCardFile) {
      toast({
        title: "Missing Document",
        description: "Please select your Ghana Card image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload documents",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/upload/ghana-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({
          cardNumber: ghanaCardNumber,
          imageData: ghanaCardFile.data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUploadSuccess(true);
        toast({
          title: "Upload Successful",
          description:
            "Your Ghana Card has been uploaded and is pending verification",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload Ghana Card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setGhanaCardFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-ttu-gray/30">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                  alt="TTU Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-ttu-navy">
                  Upload Documents
                </h1>
                <p className="text-xs text-muted-foreground">TTU DocPortal</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container max-w-2xl py-16">
          <Card className="shadow-elevation-3 text-center">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-success">
                    Upload Successful!
                  </h2>
                  <p className="text-muted-foreground">
                    Your Ghana Card has been uploaded successfully and is now
                    pending verification by our admin team.
                  </p>
                </div>

                <div className="bg-info/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <Shield className="h-5 w-5 text-info" />
                    <span className="font-medium text-info">
                      Verification Process
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our team will verify your Ghana Card within 24 hours. You'll
                    receive an SMS notification once verification is complete.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard">
                    <Button className="bg-ttu-navy hover:bg-ttu-navy/90">
                      Return to Dashboard
                    </Button>
                  </Link>
                  <Link to="/new-request">
                    <Button variant="outline">Make New Request</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ttu-gray/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbc269ba1ae514c8cb5655e2af9bc5e6a%2Fe27d3c87d0ea48608a4f4fd72e539d38?format=webp&width=800"
                alt="TTU Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ttu-navy">
                Upload Documents
              </h1>
              <p className="text-xs text-muted-foreground">TTU DocPortal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl py-8">
        <div className="space-y-8">
          {/* Info Card */}
          <Card className="border-info/20 bg-info/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-info">
                <Shield className="h-5 w-5" />
                Identity Verification Required
              </CardTitle>
              <CardDescription>
                To ensure security and authenticity, we require Ghana Card
                verification for all document requests. Your information is
                encrypted and securely stored.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Upload Form */}
          <Card className="shadow-elevation-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Ghana Card
              </CardTitle>
              <CardDescription>
                Please provide clear, readable images of your Ghana Card for
                verification
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Ghana Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Ghana Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="GHA-123456789-0"
                  value={ghanaCardNumber}
                  onChange={(e) => setGhanaCardNumber(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Enter the number exactly as shown on your Ghana Card
                </p>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <Label>Ghana Card Image</Label>

                {!ghanaCardFile ? (
                  <div
                    className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="h-8 w-8 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium">Upload Ghana Card Image</p>
                        <p className="text-sm text-muted-foreground">
                          Click to select or drag and drop your file here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: JPG, PNG, WebP (Max 5MB)
                        </p>
                      </div>

                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* File Preview */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={ghanaCardFile.preview}
                            alt="Ghana Card preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium truncate">
                                {ghanaCardFile.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(ghanaCardFile.size)}
                              </p>
                              <Badge className="bg-success/10 text-success">
                                <FileImage className="h-3 w-3 mr-1" />
                                Ready to upload
                              </Badge>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upload another file button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Different File
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-warning/10 rounded-lg p-4">
                <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Photo Guidelines
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure the entire card is visible in the image</li>
                  <li>• Photo should be clear and text should be readable</li>
                  <li>• Avoid glare, shadows, or blurry images</li>
                  <li>• Use good lighting for best results</li>
                </ul>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={
                  isUploading || !ghanaCardNumber.trim() || !ghanaCardFile
                }
                className="w-full bg-ttu-navy hover:bg-ttu-navy/90"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Upload Ghana Card
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-success">
                    Your Privacy is Protected
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All uploaded documents are encrypted and securely stored.
                    Only authorized TTU staff can access your information for
                    verification purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
