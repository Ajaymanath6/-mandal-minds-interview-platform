import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "material-symbols/outlined.css";
import { CloudUpload } from "@carbon/icons-react";

export default function FileUploadModal({ isOpen, onClose, onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFileUpload(files);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const processFileUpload = (files) => {
    const fileArray = Array.from(files);
    
    // If onFileUpload callback is provided, process the first file
    if (onFileUpload && fileArray.length > 0) {
      const file = fileArray[0];
      // For text files, read the content
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          onFileUpload(file, text);
        };
        reader.readAsText(file);
      } else {
        // For PDF/DOCX, simulate text extraction or pass file directly
        onFileUpload(file, null);
      }
    }

    onClose();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFileUpload(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-50 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with back arrow and title */}
        <div className="flex flex-col gap-2 px-6 py-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-full w-fit"
            style={{
              background: "unset",
              backgroundColor: "transparent",
              color: "#7c00ff",
              boxSizing: "content-box",
            }}
            aria-label="Go back"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 24, color: "#7c00ff" }}
            >
              west
            </span>
            <span
              className="text-sm font-medium"
              style={{
                fontFamily: "Body Font",
                fontWeight: 500,
                color: "#7c00ff",
              }}
            >
              Back
            </span>
          </button>
          <h2
            className="text-lg font-semibold"
            style={{
              fontFamily: "Body Font",
              fontWeight: 600,
              color: "#575757",
            }}
          >
            Upload Files
          </h2>
        </div>

        {/* Upload area */}
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 ${
              isDragging ? "border-gray-400" : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CloudUpload
              className="mb-4"
              style={{ fontSize: 40, color: "#9CA3AF" }}
            />
            <p
              className="text-sm font-medium"
              style={{
                fontFamily: "Body Font",
                fontWeight: 500,
                color: "#000000",
              }}
            >
              job description
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

