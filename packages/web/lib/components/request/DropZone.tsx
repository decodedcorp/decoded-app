"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { UPLOAD_CONFIG } from "@/lib/utils/validation";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

export function DropZone({
  onFilesSelected,
  disabled = false,
  compact = false,
  className = "",
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [disabled, onFilesSelected]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesSelected(Array.from(files));
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [onFilesSelected]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled]
  );

  const acceptFormats = UPLOAD_CONFIG.supportedFormats.join(",");

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`
          flex items-center justify-center w-full h-full min-h-[80px]
          border-2 border-dashed rounded-lg transition-all duration-200
          ${isDragging ? "border-primary bg-primary/5" : "border-foreground/20"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-foreground/40 hover:bg-foreground/5 cursor-pointer"}
          ${className}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptFormats}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Add more images"
        />
        <Upload className="h-6 w-6 text-foreground/40" />
      </button>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center
        p-8 border-2 border-dashed rounded-xl transition-all duration-200
        ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-foreground/20"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-foreground/40 hover:bg-foreground/5 cursor-pointer"}
        ${className}
      `}
      aria-label="Drop images here or click to select"
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptFormats}
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Select images to upload"
      />

      <div
        className={`
          p-4 rounded-full mb-4 transition-colors duration-200
          ${isDragging ? "bg-primary/10" : "bg-foreground/5"}
        `}
      >
        {isDragging ? (
          <Upload className="h-8 w-8 text-primary" />
        ) : (
          <Camera className="h-8 w-8 text-foreground/50" />
        )}
      </div>

      <p className="text-base font-medium text-foreground mb-1">
        {isDragging ? "Drop images here" : "Drag and drop images"}
      </p>
      <p className="text-sm text-foreground/60 mb-4">
        or click to select files
      </p>

      <div className="flex items-center gap-4 text-xs text-foreground/40">
        <span className="flex items-center gap-1">
          <ImageIcon className="h-3 w-3" />
          JPG, PNG, WebP
        </span>
        <span>Max {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB</span>
        <span>Up to {UPLOAD_CONFIG.maxImages} images</span>
      </div>

      <p className="text-xs text-foreground/40 mt-4">
        Tip: Press{" "}
        <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded text-foreground/60">
          Ctrl
        </kbd>
        +
        <kbd className="px-1.5 py-0.5 bg-foreground/10 rounded text-foreground/60">
          V
        </kbd>{" "}
        to paste from clipboard
      </p>
    </div>
  );
}
