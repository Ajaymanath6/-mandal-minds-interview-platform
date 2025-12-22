import { useState, useRef } from "react";
import { RiUploadLine } from "@remixicon/react";

export default function JDUploadModal({ isOpen, onClose, onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const validExtensions = [".pdf", ".docx", ".doc", ".txt"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      alert("Please upload a valid file (PDF, DOCX, or TXT)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Call the callback with the file
    if (onFileUpload) {
      onFileUpload(file);
    }
    onClose();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-6xl w-full mx-4">
        <div
          className="bg-white rounded-2xl p-1.5"
          style={{ minHeight: "390px" }}
        >
          <div className="text-center">
            {/* Light Gray Gradient Container - Everything inside here */}
            <div
              className="rounded-2xl p-8 border border-gray-200"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(249, 250, 251, 0.15), rgba(243, 244, 246, 0.15))",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  <span className="text-purple-600">Upload</span> Job Description
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                    }}
                  >
                    close
                  </span>
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-colors cursor-pointer bg-white ${
                  isDragging
                    ? "border-purple-600 bg-white"
                    : "border-purple-400 hover:border-purple-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />

                {/* Upload Image */}
                <div className="mb-6 flex justify-center">
                  <img
                    src="/uplaod.png"
                    alt="Upload files"
                    className="w-40 h-40 object-contain"
                    style={{
                      filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))",
                    }}
                  />
                </div>

                <h4 className="text-lg font-medium mb-2">
                  Drop files here or click to <span className="text-purple-600">browse</span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Supported formats: PDF, DOCX, TXT • Max file size: 10MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  <span className="font-semibold">Select</span> Files
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Recent Uploads
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      name: "Senior_FE_JD.pdf",
                      img: "/fileimage.png",
                    },
                    {
                      name: "Backend_Engineer_JD.docx",
                      img: "/fileimage1.png",
                    },
                    {
                      name: "Fullstack_JD.txt",
                      img: "/fileimage2.png",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-1 bg-gray-50 rounded-2xl"
                      style={{
                        backgroundColor: "rgba(249, 250, 251, 0.9)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div className="text-sm text-gray-900 font-medium">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-xs text-gray-900 font-medium">
                        Just now
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

