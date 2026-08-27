"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { UploadedFile } from "@/types/assessment";

interface UploadCardProps {
  title: string;
  description: string;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
}

export default function UploadCard({
  title,
  description,
  value,
  onChange,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, PNG, or JPG file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    onChange({
      file,
      previewUrl,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
          isDragging
            ? "border-black bg-gray-50"
            : "border-gray-300 hover:border-gray-500"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleInputChange}
          className="hidden"
        />

        {value ? (
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              📄
            </div>

            <p className="max-w-xs truncate text-sm font-medium text-gray-900">
              {value.file.name}
            </p>

            <p className="text-xs text-gray-500">
              Click to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              ↑
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Drop your file here
              </p>

              <p className="mt-1 text-xs text-gray-500">
                or click to browse
              </p>
            </div>

            <p className="text-xs text-gray-400">
              PDF, PNG or JPG
            </p>
          </div>
        )}
      </label>
    </div>
  );
}