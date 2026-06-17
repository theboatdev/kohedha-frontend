"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { uploadMenuPDF } from "@/lib/menu";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PDFUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: PDFUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async (preview: boolean = true) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Simulate progress for AI processing
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const result = await uploadMenuPDF(file, preview);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);

      if (!preview && result.success) {
        toast({
          title: "Success",
          description: result.message || "Menu uploaded successfully",
        });
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload PDF",
        variant: "destructive",
      });
      setUploadResult({
        success: false,
        message: error.message,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    onOpenChange(false);
  };

  const removeFile = () => {
    setFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-bebas text-2xl">
            <FileText className="h-6 w-6 text-red-600" />
            Upload PDF Menu
          </DialogTitle>
          <DialogDescription className="font-poppins">
            Upload a PDF menu and let AI extract menu items automatically using
            Google Gemini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          {!file && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <span className="text-sm font-poppins text-gray-600 mb-2">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs font-poppins text-gray-500">
                  PDF files only (MAX. 10MB)
                </span>
              </label>
            </div>
          )}

          {/* Selected File */}
          {file && !uploadResult && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <FileText className="h-8 w-8 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-poppins font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs font-poppins text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
                <p className="text-sm font-poppins text-gray-900 font-medium">
                  AI is extracting menu items...
                </p>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs font-poppins text-gray-600 text-center">
                This may take a few seconds depending on menu size
              </p>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Alert
              variant={uploadResult.success ? "default" : "destructive"}
              className={
                uploadResult.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200"
              }
            >
              {uploadResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className="font-poppins">
                <p className="font-medium">{uploadResult.message}</p>
                {uploadResult.data && (
                  <div className="mt-2 text-sm space-y-1">
                    <p>Pages processed: {uploadResult.data.pages}</p>
                    <p>Total extracted: {uploadResult.data.totalExtracted}</p>
                    <p className="text-green-600">
                      Valid items: {uploadResult.data.validItems}
                    </p>
                    {uploadResult.data.invalidItems > 0 && (
                      <p className="text-red-600">
                        Invalid items: {uploadResult.data.invalidItems}
                      </p>
                    )}
                  </div>
                )}
                {uploadResult.preview && (
                  <p className="mt-2 text-xs text-gray-600">
                    Review the extracted data and click "Confirm Upload" to save
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* AI Info Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-poppins font-medium text-gray-900 mb-1">
                  AI-Powered Extraction
                </p>
                <p className="text-xs font-poppins text-gray-600">
                  Using Google Gemini to intelligently extract menu items,
                  categories, descriptions, and prices from your PDF. The AI
                  will automatically detect and normalize currency formats.
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-poppins font-medium text-gray-900 mb-2">
              Best Practices:
            </p>
            <ul className="text-xs font-poppins text-gray-600 space-y-1 list-disc list-inside">
              <li>
                Ensure the PDF contains readable text (not scanned images)
              </li>
              <li>Menu items should be clearly formatted with prices</li>
              <li>
                Categories should be labeled (Appetizers, Main Course, etc.)
              </li>
              <li>Review extracted items before confirming upload</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>

          {!uploadResult && (
            <Button
              onClick={() => handleUpload(true)}
              disabled={!file || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Extract with AI
                </>
              )}
            </Button>
          )}

          {uploadResult?.preview && uploadResult?.success && (
            <Button
              onClick={() => handleUpload(false)}
              disabled={isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Upload
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
