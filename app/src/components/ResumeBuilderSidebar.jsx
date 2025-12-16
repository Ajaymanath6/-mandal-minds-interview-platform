import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "material-symbols/outlined.css";
import { CloudUpload } from "@carbon/icons-react";
import UploadStatusModal from "./UploadStatusModal";

export default function ResumeBuilderSidebar({
  isOpen,
  onToggle,
  onJDUploaded,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState([]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const fileInputRef = useRef(null);

  // Calculate dropdown position based on button position
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom + 8,
        left: buttonRect.left,
      });
    }
  };

  // Update position when dropdown opens or window resizes
  useEffect(() => {
    if (isDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
    }

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    if (newState) {
      // Small delay to ensure button position is calculated correctly
      setTimeout(() => {
        updateDropdownPosition();
      }, 0);
    }
  };

  // Random name for the child file
  const childFileName = "Document_Resume_2024";

  // File upload handlers
  const processFileUpload = (files) => {
    const fileArray = Array.from(files);
    const newUploads = fileArray.map((file, index) => ({
      id: Date.now() + index,
      fileName: file.name,
      status: "uploading",
      file: file,
    }));

    // Add new uploads to the list
    setUploads((prev) => [...prev, ...newUploads]);

    // If onJDUploaded callback is provided, process the first file as JD
    if (onJDUploaded && fileArray.length > 0) {
      const jdFile = fileArray[0];
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        onJDUploaded(jdFile, text);
      };
      if (jdFile.type === "text/plain") {
        reader.readAsText(jdFile);
      } else {
        // For PDF/DOCX, simulate text extraction
        setTimeout(() => {
          const simulatedText = `Job Description extracted from ${jdFile.name}`;
          onJDUploaded(jdFile, simulatedText);
        }, 500);
      }
    }

    // Simulate upload process
    newUploads.forEach((upload) => {
      // Simulate upload delay (2-4 seconds)
      const uploadTime = 2000 + Math.random() * 2000;
      setTimeout(() => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: "completed" } : u
          )
        );
      }, uploadTime);
    });

    setIsUploadModalOpen(false);
  };

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

  return (
    <>
      {/* Second Sidebar - Job Description Input */}
      <div
        className={`${
          isOpen ? "w-[220px]" : "w-12 md:w-0"
        } bg-white transition-all duration-300 ${
          isOpen ? "" : "md:hidden"
        } flex-shrink-0 h-full border-r border-[#E5E5E5]`}
      >
        <div className="w-[220px] flex flex-col h-full">
          {/* Empty content area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 relative">
            {/* Add Files Button */}
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-[6px] transition-colors border bg-white hover:bg-white"
              style={{
                color: '#575757',
                borderColor: '#E5E5E5',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                add
              </span>
              <span className="text-sm font-medium">Add Files</span>
            </button>

            {/* Dropdown Menu - Rendered via Portal to avoid overflow clipping */}
            {isDropdownOpen &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className="fixed bg-white rounded-[6px] border z-[9999] min-w-[320px]"
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    borderColor: "#E5E5E5",
                    boxShadow: "0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A",
                  }}
                >
                <div className="py-2">
                  {/* Upload JD from URL */}
                  <button
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-[#F5F5F5] transition-colors group"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span
                      className="material-symbols-outlined mr-3 flex-shrink-0"
                      style={{ fontSize: 20, color: "#575757" }}
                    >
                      link
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 500,
                          color: "#575757",
                        }}
                      >
                        Upload JD from URL
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        Import job description from URL
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined ml-2 flex-shrink-0"
                      style={{ fontSize: 18, color: "#9CA3AF" }}
                    >
                      chevron_right
                    </span>
                  </button>

                  {/* Search Job Postings Online */}
                  <button
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-[#F5F5F5] transition-colors group"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span
                      className="material-symbols-outlined mr-3 flex-shrink-0"
                      style={{ fontSize: 20, color: "#575757" }}
                    >
                      search
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 500,
                          color: "#575757",
                        }}
                      >
                        Search Job Postings Online
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        Search job postings across the web
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined ml-2 flex-shrink-0"
                      style={{ fontSize: 18, color: "#9CA3AF" }}
                    >
                      chevron_right
                    </span>
                  </button>

                  {/* Upload Resume/JD File */}
                  <button
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-[#F5F5F5] transition-colors group"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsUploadModalOpen(true);
                    }}
                  >
                    <span
                      className="material-symbols-outlined mr-3 flex-shrink-0"
                      style={{ fontSize: 20, color: "#575757" }}
                    >
                      upload_file
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 500,
                          color: "#575757",
                        }}
                      >
                        Upload Resume/JD File
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        Import PDF, DOCX formats
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined ml-2 flex-shrink-0"
                      style={{ fontSize: 18, color: "#9CA3AF" }}
                    >
                      chevron_right
                    </span>
                  </button>

                  {/* Import from LinkedIn */}
                  <button
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-[#F5F5F5] transition-colors group"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span
                      className="material-symbols-outlined mr-3 flex-shrink-0"
                      style={{ fontSize: 20, color: "#575757" }}
                    >
                      work
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 500,
                          color: "#575757",
                        }}
                      >
                        Import from LinkedIn
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        Import resume or job posting from LinkedIn
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined ml-2 flex-shrink-0"
                      style={{ fontSize: 18, color: "#9CA3AF" }}
                    >
                      chevron_right
                    </span>
                  </button>

                  {/* Add JD/Resume Manually */}
                  <button
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-[#F5F5F5] transition-colors group"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span
                      className="material-symbols-outlined mr-3 flex-shrink-0"
                      style={{ fontSize: 20, color: "#575757" }}
                    >
                      edit_note
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 500,
                          color: "#575757",
                        }}
                      >
                        Add JD/Resume Manually
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          fontFamily: "Body Font",
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        Create job description or resume manually
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined ml-2 flex-shrink-0"
                      style={{ fontSize: 18, color: "#9CA3AF" }}
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>,
              document.body
            )}

            {/* Upload Modal */}
            {isUploadModalOpen &&
              createPortal(
                <div
                  className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setIsUploadModalOpen(false);
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
                        onClick={() => setIsUploadModalOpen(false)}
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
                        accept=".pdf,.docx"
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
              )}

            {/* File Options */}
            <div className="space-y-1">
              <button
                className="w-full flex items-center gap-2 pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] transition-colors border-0 hover:bg-[#F5F5F5]"
                style={{
                  fontFamily: "Body Font",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#575757",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: "#575757" }}
                >
                  folder
                </span>
                <span>All files</span>
              </button>
              <button
                className="w-full flex items-center gap-2 pt-1 pr-2 pb-1 pl-8 text-gray-900 rounded-[12px] transition-colors border-0 hover:bg-[#F5F5F5]"
                style={{
                  fontFamily: "Body Font",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#575757",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: "#575757" }}
                >
                  description
                </span>
                <span className="truncate">{childFileName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collapse button for second sidebar when closed - Always visible on laptop */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="w-12 md:w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 mb-8 flex-shrink-0"
          title="Show Resume Builder"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20 }}
          >
            dock_to_right
          </span>
        </button>
      )}

      {/* Upload Status Modal */}
      <UploadStatusModal
        uploads={uploads}
        onClose={() => setUploads([])}
        onCollapse={() => {
          // Handle collapse state if needed
        }}
      />
    </>
  );
}

