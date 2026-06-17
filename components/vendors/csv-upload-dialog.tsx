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
import { uploadMenuCSV } from "@/lib/menu";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CSVUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: CSVUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file",
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
      setUploadProgress(30);

      const result = await uploadMenuCSV(file, preview);

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
        description: error.message || "Failed to upload CSV",
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
            <FileSpreadsheet className="h-6 w-6 text-green-600" />
            Upload CSV Menu
          </DialogTitle>
          <DialogDescription className="font-poppins">
            Upload a CSV file with your menu items. Required columns: category,
            name, price. Optional: description, currency, is_available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          {!file && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <span className="text-sm font-poppins text-gray-600 mb-2">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs font-poppins text-gray-500">
                  CSV files only (MAX. 10MB)
                </span>
              </label>
            </div>
          )}

          {/* Selected File */}
          {file && !uploadResult && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <FileSpreadsheet className="h-8 w-8 text-green-600 flex-shrink-0" />
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
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm font-poppins text-gray-600 text-center">
                Uploading... {uploadProgress}%
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
                {uploadResult.summary && (
                  <div className="mt-2 text-sm space-y-1">
                    <p>Total rows: {uploadResult.summary.totalRows}</p>
                    <p className="text-green-600">
                      Valid: {uploadResult.summary.validRows}
                    </p>
                    {uploadResult.summary.skippedRows > 0 && (
                      <p className="text-red-600">
                        Skipped: {uploadResult.summary.skippedRows}
                      </p>
                    )}
                    {!uploadResult.preview &&
                      uploadResult.summary.savedRows > 0 && (
                        <p className="text-blue-600">
                          Saved: {uploadResult.summary.savedRows}
                        </p>
                      )}
                  </div>
                )}
                {uploadResult.preview && (
                  <p className="mt-2 text-xs text-gray-600">
                    Review the data and click "Confirm Upload" to save to
                    database
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* CSV Format Help */}
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-poppins font-medium text-gray-900 mb-2">
              CSV Format Example:
            </p>
            <code className="text-xs font-mono bg-white p-2 rounded block overflow-x-auto">
              category,name,description,price,currency,is_available
              <br />
              Appetizers,Spring Rolls,Crispy vegetable rolls,450,LKR,true
              <br />
              Main Course,Grilled Chicken,Served with rice,1200,LKR,true
            </code>
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
                  Previewing...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Preview
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
