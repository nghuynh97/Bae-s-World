'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from '@/components/ui/progress';

export type UploadFile = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
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
            <span className="max-w-[200px] truncate font-body text-sm font-bold">
              {uploadFile.file.name}
            </span>
            {uploadFile.status === 'complete' && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            )}
            {uploadFile.status === 'error' && (
              <XCircle className="h-5 w-5 shrink-0 text-destructive" />
            )}
            {(uploadFile.status === 'uploading' ||
              uploadFile.status === 'pending') && (
              <span className="font-body text-sm text-text-secondary">
                {uploadFile.progress}%
              </span>
            )}
          </div>

          {(uploadFile.status === 'uploading' ||
            uploadFile.status === 'pending') && (
            <Progress value={uploadFile.progress}>
              <ProgressTrack className="h-1 bg-border">
                <ProgressIndicator className="bg-accent" />
              </ProgressTrack>
            </Progress>
          )}

          {uploadFile.status === 'error' && (
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-destructive">
                {uploadFile.error || 'Upload failed'}
              </span>
              {uploadFile.onRetry && (
                <button
                  onClick={uploadFile.onRetry}
                  className="font-body text-sm text-accent hover:underline"
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
