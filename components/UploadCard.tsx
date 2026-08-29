"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { Upload, X } from "lucide-react";
import { FileImage } from "lucide-react";
import Image from "next/image";

interface UploadCardProps {
  title: string;
  value: File | null;
  onChange: (file: File | null) => void;
}

export default function UploadCard({
  title,
  value,
  onChange,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFile = async (file: File) => {
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

    if (file.type === "application/pdf") {
      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const buf = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: buf,
      }).promise;

      setPageCount(pdf.numPages);
    } else {
      setPageCount(null);
    }

    onChange(file);
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
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-3 border-dashed transition ${isDragging
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
          <div className="flex bg-gray-200 items-start gap-2 p-3 px-6 rounded-lg text-center lg:w-[350px] relative">
            {value.type === "application/pdf" ? (
              <Image src="/file-pdf.svg" className="h-10 w-10" width={50} height={50} alt="" />
            ) : (
              <FileImage className="h-10 w-10" />
            )}
            <div className="flex flex-col gap-2 text-center items-center w-full ">
              <p className="lg:max-w-[180px] max-w-[120px] font-semibold truncate text-sm lg:text-lg  text-gray-900">
                {value.name}
              </p>

              <p className="text-xs text-gray-500 text-center">
                {(value.size / (1024 * 1024)).toFixed(1)} MB <span className={`${value.type === "application/pdf" ? "" : "hidden"}`}> • {pageCount} page<span className={`${pageCount && pageCount > 1 ? "" : "hidden"}`}>s</span></span>
              </p>
            </div>
            <button onClick={()=>onChange(null)} className="p-1 text-white rounded-full font-bold absolute bg-neutral-900 -right-1 -top-2">
              <X size={12} color="#fff"/>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl font-semibold bg-gray-200">
              <Upload size={24} />
            </div>

            <div>
              <p className="text-xl font-semibold capitalize text-gray-900">
                Upload <span className="text-orange-400">{title}</span>
              </p>
            </div>

            <p className="text-sm text-gray-400 ">
              Max 10MB
            </p>
          </div>
        )}
      </label>
    </div>
  );
}