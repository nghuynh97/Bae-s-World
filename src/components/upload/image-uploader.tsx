'use client';

import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/actions/upload';
import { UploadProgress, type UploadFile } from './upload-progress';

interface ImageUploaderProps {
  bucket: 'public-images' | 'private-images';
  folder: string;
  onUploadComplete?: (imageId: string, previewUrl?: string) => void;
}

export function ImageUploader({
  bucket,
  folder,
  onUploadComplete,
}: ImageUploaderProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const progressTimers = useRef<Map<number, ReturnType<typeof setInterval>>>(
    new Map(),
  );

  const updateFile = useCallback(
    (index: number, updates: Partial<UploadFile>) => {
      setUploadFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, ...updates } : f)),
      );
    },
    [],
  );

  const startProgressSimulation = useCallback(
    (index: number) => {
      // Clear any existing timer for this index
      const existing = progressTimers.current.get(index);
      if (existing) clearInterval(existing);

      let current = 5;
      updateFile(index, { status: 'uploading', progress: current });

      const timer = setInterval(() => {
        current += Math.random() * 8 + 2; // increment 2-10%
        if (current >= 90) {
          current = 90; // cap at 90%, real completion sets 100%
          clearInterval(timer);
          progressTimers.current.delete(index);
        }
        updateFile(index, { progress: Math.round(current) });
      }, 300);

      progressTimers.current.set(index, timer);
    },
    [updateFile],
  );

  const stopProgressSimulation = useCallback((index: number) => {
    const timer = progressTimers.current.get(index);
    if (timer) {
      clearInterval(timer);
      progressTimers.current.delete(index);
    }
  }, []);

  const processFile = useCallback(
    async (file: File, index: number) => {
      startProgressSimulation(index);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadImage(formData, { bucket, folder });
        stopProgressSimulation(index);
        updateFile(index, { status: 'complete', progress: 100, previewUrl: result.previewUrl });
        onUploadComplete?.(result.imageId, result.previewUrl);
      } catch (err) {
        stopProgressSimulation(index);
        const message = err instanceof Error ? err.message : 'Upload failed';
        updateFile(index, {
          status: 'error',
          error: message,
          onRetry: () => processFile(file, index),
        });
      }
    },
    [bucket, folder, onUploadComplete, updateFile, startProgressSimulation, stopProgressSimulation],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const startIndex = uploadFiles.length;
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: 'pending' as const,
      }));

      setUploadFiles((prev) => [...prev, ...newFiles]);

      // Process with max 3 concurrent uploads
      const maxConcurrent = 3;
      let completedCount = 0;
      const totalFiles = acceptedFiles.length;

      const processQueue = async () => {
        const queue = [
          ...acceptedFiles.map((f, i) => ({ file: f, index: startIndex + i })),
        ];
        const active: Promise<void>[] = [];

        while (queue.length > 0 || active.length > 0) {
          while (active.length < maxConcurrent && queue.length > 0) {
            const item = queue.shift()!;
            const promise = processFile(item.file, item.index).then(() => {
              completedCount++;
              const idx = active.indexOf(promise);
              if (idx > -1) active.splice(idx, 1);
            });
            active.push(promise);
          }
          if (active.length > 0) {
            await Promise.race(active);
          }
        }
      };

      await processQueue();

      if (completedCount > 0) {
        toast.success(`${completedCount} photo(s) uploaded successfully`);
      }
    },
    [uploadFiles.length, processFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-[16px] border-2 border-dashed p-12 text-center transition-colors ${
          isDragActive
            ? 'border-solid border-accent bg-[rgba(232,180,184,0.05)]'
            : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-12 w-12 text-text-secondary" />
        <p className="font-body text-base text-text-secondary">
          Drag photos here or click to browse
        </p>
        <p className="mt-1 font-body text-sm text-text-secondary">
          JPEG, PNG, WebP accepted
        </p>
      </div>

      <UploadProgress files={uploadFiles} />
    </div>
  );
}
