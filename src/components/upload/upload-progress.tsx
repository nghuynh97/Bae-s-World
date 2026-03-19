"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

export type UploadFile = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
  onRetry?: () => void;
};

export function UploadProgress({ files }: { files: UploadFile[] }) {
  if (files.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {files.map((uploadFile, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold truncate max-w-[200px] font-body">
              {uploadFile.file.name}
            </span>
            {uploadFile.status === "complete" && (
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            )}
            {uploadFile.status === "error" && (
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
            )}
            {(uploadFile.status === "uploading" || uploadFile.status === "pending") && (
              <span className="text-sm font-body text-text-secondary">
                {uploadFile.progress}%
              </span>
            )}
          </div>

          {(uploadFile.status === "uploading" || uploadFile.status === "pending") && (
            <Progress value={uploadFile.progress}>
              <ProgressTrack className="h-1 bg-border">
                <ProgressIndicator className="bg-accent" />
              </ProgressTrack>
            </Progress>
          )}

          {uploadFile.status === "error" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-destructive font-body">
                {uploadFile.error || "Upload failed"}
              </span>
              {uploadFile.onRetry && (
                <button
                  onClick={uploadFile.onRetry}
                  className="text-sm text-accent hover:underline font-body"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
