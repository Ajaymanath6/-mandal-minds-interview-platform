import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiFileTextLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiSaveLine,
  RiCloseLine,
  RiSearchLine,
} from "@remixicon/react";
import { IbmWatsonDiscovery, Chat, IbmWatsonOpenscale } from "@carbon/icons-react";
import FileUploadModal from "./FileUploadModal";
import "material-symbols/outlined.css";

export default function AISearchBar({
  onCompare,
  onSaveJD,
  onJDUploaded,
  externalJDFile,
}) {
  const [activeTab, setActiveTab] = useState("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [jdUploadStatus, setJdUploadStatus] = useState("idle"); // idle, uploading, loaded
  const [jdImage, setJdImage] = useState(null);
  const [jdFileName, setJdFileName] = useState(null);
  const textareaRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    {
      id: "upload",
      label: "AI job Search",
      icon: IbmWatsonDiscovery,
    },
    {
      id: "analyze",
      label: "Chat with Resume",
      icon: Chat,
      disabled: false,
    },
    {
      id: "interview",
      label: "AI Interview",
      icon: IbmWatsonOpenscale,
      disabled: false,
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Trigger comparison
    if (onCompare) {
      onCompare(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFileSelect = (file) => {
    setJdUploadStatus("uploading");
    setJdImage("/jd1.png");
    setJdFileName(file.name);

    // Simulate file processing (2-3 seconds)
    setTimeout(() => {
      setJdUploadStatus("loaded");
      // Extract text from file (simulate for now)
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setSearchQuery(text);
        if (onCompare) {
          onCompare(text);
        }
        if (onJDUploaded) {
          onJDUploaded(text, file.name);
        }
      };
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else {
        // For PDF/DOCX, simulate text extraction
        setTimeout(() => {
          const simulatedText = `Job Description extracted from ${file.name}`;
          setSearchQuery(simulatedText);
          if (onCompare) {
            onCompare(simulatedText);
          }
          if (onJDUploaded) {
            onJDUploaded(simulatedText, file.name);
          }
        }, 500);
      }
    }, 2000);
  };


  const handleRemoveJD = () => {
    setJdUploadStatus("idle");
    setJdImage(null);
    setJdFileName(null);
    setSearchQuery("");
  };

  // Handle drag and drop for Chat with Resume tab and AI Interview tab
  const handleDragOver = (e) => {
    if (activeTab === "analyze" || activeTab === "interview") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    if (activeTab === "analyze" || activeTab === "interview") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    if (activeTab === "analyze" || activeTab === "interview") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleFileInput = (e) => {
    if ((activeTab === "analyze" || activeTab === "interview") && e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Update placeholder based on active tab
  const getPlaceholder = () => {
    if (jdUploadStatus === "loaded") {
      return "JD uploaded successfully! Now upload your resume or select from existing resumes to start interview.";
    }
    
    if (activeTab === "upload") {
      // AI job Search tab
      return "Search for keywords, product design, frontend developer...";
    }
    
    if (activeTab === "analyze") {
      // Chat with Resume tab
      return "Ask questions about your resume or get analysis...";
    }
    
    if (activeTab === "interview") {
      // AI Interview tab
      return "Paste job description here or upload JD file to start AI interview...";
    }
    
    return "Paste job description here or upload JD file...";
  };

  // Handle external JD file uploads
  useEffect(() => {
    if (externalJDFile) {
      handleFileSelect(externalJDFile);
      // Reset external file after processing to allow re-uploads
      // Note: The parent component should reset this
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalJDFile]);

  useEffect(() => {
    if ((activeTab === "upload" || activeTab === "interview") && jdUploadStatus === "idle") {
      const textarea = textareaRef.current;
      if (textarea) {
        const pasteHandler = (e) => {
          if ((activeTab === "upload" || activeTab === "interview") && jdUploadStatus === "idle") {
            const pastedText = e.clipboardData.getText();
            if (pastedText.trim()) {
              setJdUploadStatus("uploading");
              setJdImage("/jd1.png");
              setJdFileName("Pasted JD");
              
              setTimeout(() => {
                setJdUploadStatus("loaded");
                setSearchQuery(pastedText);
                if (onCompare) {
                  onCompare(pastedText);
                }
                if (onJDUploaded) {
                  onJDUploaded(pastedText, "Pasted JD");
                }
              }, 2000);
            }
          }
        };
        textarea.addEventListener("paste", pasteHandler);
        return () => {
          textarea.removeEventListener("paste", pasteHandler);
        };
      }
    }
  }, [activeTab, jdUploadStatus, onCompare, onJDUploaded]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Bar Container */}
      <div className="bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] shadow-sm pt-[23px] pb-[23px] px-6">
        {/* Tabs - Inside search bar at the top */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled === true;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (!isDisabled) {
                    setActiveTab(tab.id);
                  }
                }}
                disabled={isDisabled}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isDisabled
                    ? "bg-transparent text-[#A5A5A5] cursor-not-allowed opacity-50"
                    : isActive
                    ? "bg-[#0A0A0A] text-white shadow-md"
                    : "bg-[#E5E5E5] text-[#1A1A1A] hover:bg-[#E5E5E5]"
                }`}
                title={isDisabled ? "Please upload JD first" : ""}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
        {/* Search Input Area */}
        <div 
          className="relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          
          {/* JD Image Preview with Loading Spinner */}
          {jdUploadStatus !== "idle" && jdImage && (
            <div className="absolute inset-0 bg-white rounded-lg flex items-end justify-center z-10 px-4 pb-4">
              <div className="flex items-end gap-3">
                <div className="relative overflow-hidden" style={{ maxHeight: '120px' }}>
                  <img
                    src={jdImage}
                    alt="JD Preview"
                    className="max-w-full max-h-[120px] object-cover object-bottom rounded-lg"
                    style={{ objectPosition: 'center bottom' }}
                  />
                  {/* Loading Spinner Overlay */}
                  {jdUploadStatus === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      </div>
                    </div>
                  )}
                  {/* Remove button when loaded */}
                  {jdUploadStatus === "loaded" && (
                    <button
                      onClick={handleRemoveJD}
                      className="absolute top-2 right-2 w-8 h-8 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Remove JD"
                    >
                      <RiCloseLine size={16} />
                    </button>
                  )}
                </div>
                {/* Document Name Display - Aligned to bottom of image */}
                {jdFileName && (
                  <div className="flex items-center gap-2">
                    {jdUploadStatus === "loaded" && (
                      <span
                        className="material-symbols-outlined flex-shrink-0"
                        style={{
                          fontSize: 20,
                          color: "#22c55e",
                          fontVariationSettings: '"FILL" 1',
                        }}
                      >
                        check_circle
                      </span>
                    )}
                    <p className="text-sm font-normal text-[#1A1A1A] truncate max-w-[120px]" title={jdFileName}>
                      {jdFileName.length > 8 ? `${jdFileName.substring(0, 8)}...` : jdFileName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Dotted border overlay for Chat with Resume tab */}
          {activeTab === "analyze" && jdUploadStatus === "idle" && (
            <div 
              className="absolute inset-0 border-2 border-dashed rounded-lg z-10 flex items-center justify-center transition-colors bg-white"
              style={{
                borderColor: isDragging ? '#E5E5E5' : '#E5E5E5'
              }}
            >
              <div className="text-center">
                <p className="text-base font-medium">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                  >
                    Select
                  </button> or drop files here
                </p>
                <input
                  type="file"
                  id="resume-file-input"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
            </div>
          )}
          
          {/* Dotted border overlay for AI Interview tab */}
          {activeTab === "interview" && jdUploadStatus === "idle" && (
            <div 
              className="absolute inset-0 border-2 border-dashed rounded-lg z-10 flex items-center justify-center transition-colors bg-white"
              style={{
                borderColor: isDragging ? '#E5E5E5' : '#E5E5E5'
              }}
            >
              <div className="text-center">
                <p className="text-base font-medium">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                  >
                    Select
                  </button> JD or <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                  >
                    upload
                  </button> JD or write JD copy paste JD to text area
                </p>
                <input
                  type="file"
                  id="interview-file-input"
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            className={`w-full min-h-[140px] px-6 py-4 pr-16 text-gray-900 bg-white border rounded-lg focus:outline-none resize-none placeholder:text-[#A5A5A5] text-base m-0 hover:bg-[#F5F5F5] ${
              jdUploadStatus !== "idle" ? "opacity-0 pointer-events-none" : ""
            } ${(activeTab === "analyze" || activeTab === "interview") && jdUploadStatus === "idle" ? "opacity-0 pointer-events-none" : ""}`}
            rows={5}
            disabled={jdUploadStatus === "uploading"}
            style={{ marginLeft: 0, marginRight: 0, marginTop: 0, borderColor: '#E5E5E5' }}
          />
          
          {/* Save Job Button - Left Bottom Corner (only show when JD is loaded, but not in Chat with Resume tab) */}
          {jdUploadStatus === "loaded" && activeTab !== "analyze" && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                style={{ boxSizing: 'content-box' }}
                onClick={() => {
                  if (searchQuery.trim() && onSaveJD) {
                    onSaveJD(searchQuery);
                  }
                }}
                aria-label="Save Job"
              >
                <RiSaveLine size={18} />
                <span>Save Job</span>
              </button>
            </div>
          )}
          {/* Proceed Button (only show when JD is loaded) */}
          {jdUploadStatus === "loaded" && (
            <button
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-lg transition-colors hover:bg-[#1A1A1A] shadow-md z-20"
              onClick={() => {
                navigate("/edit-resume");
              }}
              aria-label="Proceed"
            >
              <span className="text-sm font-medium">Proceed</span>
              <RiArrowRightLine size={18} />
            </button>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={(file, text) => {
          handleFileSelect(file);
        }}
      />
    </div>
  );
}

