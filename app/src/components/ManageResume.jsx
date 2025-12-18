import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiUser3Fill,
  RiFileTextLine,
  RiUploadLine,
  RiFileCopyLine,
  RiFileList3Line,
  RiAddLine,
  RiCloseLine,
  RiLogoutBoxLine,
  RiEditLine,
  RiSparklingFill,
  RiFolder6Fill,
  RiLinkM,
  RiCheckboxMultipleLine,
  RiCodeSSlashLine,
  RiEyeLine,
} from "@remixicon/react";
import logoSvg from "../assets/logo.svg";
import "material-symbols/outlined.css";

export default function ManageResume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [connectJobModal, setConnectJobModal] = useState(null);
  const [jdContent, setJdContent] = useState("");
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareJDContent, setCompareJDContent] = useState("");
  const [analyzingResumes, setAnalyzingResumes] = useState([]);
  const [analyzeModalOpen, setAnalyzeModalOpen] = useState(false);
  const [selectedResumeForAnalysis, setSelectedResumeForAnalysis] =
    useState(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  
  // Inspect Element Feature
  const [inspectMode, setInspectMode] = useState(false);
  const [inspectData, setInspectData] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tooltipPinned, setTooltipPinned] = useState(false);
  const inspectRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Load Resumes - in real app this would be from API
    setResumes([]);
  }, []);

  const handleAnalyze = (resume) => {
    setSelectedResumeForAnalysis(resume);
    setAnalyzeModalOpen(true);
  };

  const handleEditResume = (resume) => {
    // Navigate to edit resume page
    navigate("/edit-resume", { state: { resume } });
  };

  const handleUploadResume = () => {
    // Add dummy resume to the list
    const dummyResume = {
      id: Date.now(),
      resumeName: "Untitled Resume",
      matchedJob: null,
      match: null,
      created: new Date().toISOString().split("T")[0],
      lastEdited: new Date().toISOString().split("T")[0],
    };
    setResumes([...resumes, dummyResume]);
    setIsUploadModalOpen(false);
  };

  const toggleResumeSelection = (id) => {
    setSelectedResumes((prev) =>
      prev.includes(id)
        ? prev.filter((resumeId) => resumeId !== id)
        : [...prev, id]
    );
  };

  const handleCompareSelected = () => {
    if (selectedResumes.length === 0) {
      alert("Please select at least one resume");
      return;
    }
    setCompareModalOpen(true);
    setCompareJDContent("");
  };

  const handleCompareAnalyze = () => {
    if (!compareJDContent.trim()) {
      alert("Please enter a job description");
      return;
    }

    // Close modal immediately
    setCompareModalOpen(false);
    setCompareJDContent("");

    // Start analyzing - show spinners
    setAnalyzingResumes(selectedResumes);

    // Simulate analysis for each selected resume
    selectedResumes.forEach((resumeId, index) => {
      setTimeout(() => {
        const matchScore = Math.floor(Math.random() * 30) + 70; // Random score 70-100
        const companyName = "TechCorp Inc"; // In real app, extract from JD
        setResumes((prevResumes) =>
          prevResumes.map((resume) =>
            resume.id === resumeId
              ? {
                  ...resume,
                  matchedJob: companyName,
                  match: matchScore,
                }
              : resume
          )
        );

        // Remove from analyzing list
        setAnalyzingResumes((prev) => prev.filter((id) => id !== resumeId));

        // Exit compare mode when all done
        if (index === selectedResumes.length - 1) {
          setTimeout(() => {
            setIsCompareMode(false);
            setSelectedResumes([]);
          }, 500);
        }
      }, 1000 + index * 500); // Stagger the results
    });
  };

  const handleConnectJob = (resumeId) => {
    setConnectJobModal(resumeId);
    setJdContent("");
  };

  const handleAnalyzeWithJD = () => {
    if (!jdContent.trim()) {
      alert("Please enter a job description");
      return;
    }

    // Update the resume with matched job and score
    const matchScore = Math.floor(Math.random() * 30) + 70; // Random score 70-100
    const companyName = "Mandal Minds"; // In real app, extract from JD
    setResumes(
      resumes.map((resume) =>
        resume.id === connectJobModal
          ? {
              ...resume,
              matchedJob: companyName,
              match: matchScore,
            }
          : resume
      )
    );
    setConnectJobModal(null);
    setJdContent("");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Inspect Element Functions
  const componentCodeMap = {
    'upload-resume-btn': {
      name: '📤 Upload Resume Button',
      jsx: `<button
  onClick={() => setIsUploadModalOpen(true)}
  className="flex flex-col items-center p-6 bg-white rounded-xl transition-all group"
>
  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
    <RiUploadLine size={28} className="text-blue-600" />
  </div>
  <span className="text-sm font-medium text-gray-900">
    Upload Resume
  </span>
</button>`,
      css: `.upload-btn {
  @apply flex flex-col items-center p-6 bg-white rounded-xl transition-all;
}
.upload-btn:hover .icon-container {
  @apply scale-110;
}`,
      description: 'Interactive upload button with hover animation and icon'
    },
    'new-resume-btn': {
      name: '✨ New Resume Button',
      jsx: `<button className="flex flex-col items-center p-6 bg-white rounded-xl transition-all group">
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
    <RiAddLine size={28} className="text-green-600" />
  </div>
  <span className="text-sm font-medium text-gray-900">
    New Resume
  </span>
</button>`,
      css: `.new-resume-btn {
  @apply flex flex-col items-center p-6 bg-white rounded-xl transition-all;
}`,
      description: 'Button to create a new resume with green accent'
    },
    'page-title': {
      name: '📋 Page Title',
      jsx: `<h1 className="text-base font-bold text-gray-900">Manage Resume</h1>`,
      css: `.page-title {
  @apply text-base font-bold text-gray-900;
}`,
      description: 'Main page heading'
    }
  };

  const handleInspectHover = (e, componentId) => {
    if (!inspectMode || tooltipPinned) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const code = componentCodeMap[componentId];
    
    if (code) {
      setInspectData(code);
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleInspectLeave = () => {
    if (!inspectMode || tooltipPinned) return;
    // Don't hide immediately - let user move to tooltip
  };

  const handleInspectClick = (e, componentId) => {
    if (!inspectMode) return;
    
    const code = componentCodeMap[componentId];
    if (code) {
      setInspectData(code);
      setTooltipPinned(true);
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const closeTooltip = () => {
    setInspectData(null);
    setTooltipPinned(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const toggleInspectMode = () => {
    setInspectMode(!inspectMode);
    setInspectData(null);
    setTooltipPinned(false);
  };

  // Close tooltip on Escape key or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && inspectData) {
        closeTooltip();
      }
    };

    const handleClickOutside = (e) => {
      if (inspectData && tooltipPinned && !e.target.closest('.inspect-tooltip')) {
        closeTooltip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [inspectData, tooltipPinned]);

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="flex w-full" style={{ height: "100vh" }}>
        {/* First Sidebar - Always Visible */}
        <div
          className={`${
            firstSidebarOpen ? "w-52" : "w-16"
          } bg-white transition-all duration-300 flex-shrink-0 h-full`}
        >
          <div className="flex flex-col h-full">
            {/* Logo and Toggle */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {firstSidebarOpen && (
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => setLogoModalOpen(true)}
                  >
                    <img
                      src={logoSvg}
                      alt="Mandal Minds Logo"
                      className="w-8 h-6"
                    />
                    <span className="font-semibold text-gray-900">
                      Mandal Minds
                    </span>
                  </div>
                )}
                {!firstSidebarOpen && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer relative overflow-hidden"
                    onMouseEnter={() => setIsLogoHovered(true)}
                    onMouseLeave={() => setIsLogoHovered(false)}
                    onClick={() => setFirstSidebarOpen(true)}
                  >
                    {isLogoHovered ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-gray-600"
                          style={{ fontSize: 20 }}
                        >
                          dock_to_right
                        </span>
                      </div>
                    ) : (
                      <img
                        src={logoSvg}
                        alt="Mandal Minds Logo"
                        className="w-8 h-6"
                      />
                    )}
                  </div>
                )}
                {firstSidebarOpen && (
                  <button
                    onClick={() => setFirstSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 20 }}
                    >
                      dock_to_left
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-2">
              <button
                onClick={() => navigate("/resume")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 hover:bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#5b748e",
                    }}
                  >
                    auto_awesome
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">AI Interview</span>
                )}
              </button>

              <button
                onClick={() => navigate("/get-vetted")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 hover:bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#7c00ff",
                    }}
                  >
                    verified_user
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">Get Vetted</span>
                )}
              </button>

              <a
                href="#"
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 bg-gray-50 rounded-3xl transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#7c00ff",
                      filter: "drop-shadow(0 4px 12px rgba(124, 0, 255, 0.3)) drop-shadow(inset 0 1px 0 rgba(255, 255, 255, 0.25))",
                    }}
                  >
                    content_copy
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">Manage Resume</span>
                )}
              </a>

              <button
                onClick={() => navigate("/manage-jds")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 hover:bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#5b748e",
                    }}
                  >
                    description
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">Manage JDs</span>
                )}
              </button>
            </nav>

            {/* User Profile - Bottom */}
            <div className="p-3 border-t border-gray-200">
              {firstSidebarOpen ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-purple-600"
                      style={{
                        fontSize: "18px",
                        fontVariationSettings:
                          '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 18',
                      }}
                    >
                      person
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-700 truncate">
                      Designer
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                  title="Logout"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                    }}
                  >
                    logout
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-6">
          {/* Page Title */}
          <div className="mb-6 flex items-center justify-between">
            <h1 
              className="text-base font-bold text-gray-900"
              onMouseEnter={(e) => handleInspectHover(e, 'page-title')}
              onMouseLeave={handleInspectLeave}
              onClick={(e) => handleInspectClick(e, 'page-title')}
              style={{ 
                cursor: inspectMode ? 'pointer' : 'default'
              }}
            >
              Manage Resume
            </h1>
            
            {/* Inspect Mode Toggle */}
            <button
              onClick={toggleInspectMode}
              className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                inspectMode 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              title={inspectMode ? 'Exit Inspect Mode' : 'Toggle Inspect Mode'}
            >
              <RiCodeSSlashLine size={14} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {resumes.length === 0 ? (
                // Empty State
                <div className="flex items-center justify-center w-full" style={{ minHeight: "calc(100vh - 200px)" }}>
                  <div className="max-w-2xl w-full mx-auto">
                    <div className="bg-white rounded-3xl p-1.5" style={{ minHeight: "390px" }}>
                      <div className="text-center h-full">
                        {/* Light Gray Gradient Container - Everything inside here */}
                        <div 
                          className="rounded-2xl p-8 border border-gray-200"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(249, 250, 251, 0.15), rgba(243, 244, 246, 0.15))'
                          }}
                        >
                          {/* Heading inside the gray container */}
                          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Your Resume Hub
                          </h2>
                          
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-3xl p-12"
                            style={{
                              borderStyle: 'dashed',
                            }}
                          >
                            {/* Three Tilted JD Images */}
                            <div className="mb-6 flex justify-center items-center relative" style={{ height: '120px' }}>
                              {/* Left tilted image */}
                              <img 
                                src="/jdm.png" 
                                alt="File upload" 
                                className="w-20 h-24 object-contain absolute"
                                style={{
                                  transform: 'rotate(-15deg) translateX(-70px)',
                                  zIndex: 1,
                                  mixBlendMode: 'multiply',
                                }}
                              />
                              {/* Center image */}
                              <img 
                                src="/jdm.png" 
                                alt="File upload" 
                                className="w-24 h-28 object-contain relative"
                                style={{
                                  zIndex: 3,
                                  mixBlendMode: 'multiply',
                                }}
                              />
                              {/* Right tilted image */}
                              <img 
                                src="/jdm.png" 
                                alt="File upload" 
                                className="w-20 h-24 object-contain absolute"
                                style={{
                                  transform: 'rotate(15deg) translateX(70px)',
                                  zIndex: 2,
                                  mixBlendMode: 'multiply',
                                }}
                              />
                            </div>
                            
                            {/* Main Text */}
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              Drag and drop resume files to upload
                            </p>
                            
                            {/* Subtext */}
                            <p className="text-sm text-gray-600 mb-6">
                              Supported formats: PDF, DOC, DOCX • Max file size: 10MB
                            </p>
                            
                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium"
                              >
                                <RiUploadLine size={16} />
                                <span>Upload Resume</span>
                              </button>
                              <button
                                onClick={() => handleUploadResume()}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium"
                              >
                                <RiAddLine size={16} />
                                <span>New Resume</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Populated State - Table View
                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        All Files
                      </h2>
                      {!isCompareMode && (
                        <button
                          onClick={() => setIsCompareMode(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-3xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                        >
                          <RiCheckboxMultipleLine size={16} />
                          <span>Compare Multiple</span>
                        </button>
                      )}
                    </div>

                    {/* Compare Mode Controls */}
                    {isCompareMode && (
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-sm text-gray-900">
                          {selectedResumes.length} selected
                        </span>
                        <button
                          onClick={handleCompareSelected}
                          disabled={selectedResumes.length === 0}
                          className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:border-gray-200 rounded-3xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm disabled:shadow-none"
                        >
                          Compare Selected
                        </button>
                        <button
                          onClick={() => {
                            setIsCompareMode(false);
                            setSelectedResumes([]);
                          }}
                          className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-3xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Resume Table */}
                  <div className="bg-white rounded-3xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white border-b border-gray-200">
                          {isCompareMode && (
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-purple-600 border-gray-300 rounded focus:ring-purple-600"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedResumes(
                                      resumes.map((r) => r.id)
                                    );
                                  } else {
                                    setSelectedResumes([]);
                                  }
                                }}
                              />
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Resume
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Matched Job
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Match
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Last Edited
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumes.map((resume, index) => {
                          return (
                          <tr
                            key={resume.id}
                            className="transition-colors"
                            style={{
                              backgroundColor: index % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.3)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : 'rgba(249, 250, 251, 0.3)';
                            }}
                          >
                            {isCompareMode && (
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedResumes.includes(resume.id)}
                                  onChange={() =>
                                    toggleResumeSelection(resume.id)
                                  }
                                  className="w-4 h-4 accent-purple-600 border-gray-300 rounded focus:ring-purple-600"
                                />
                              </td>
                            )}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src="/jdm.png" 
                                  alt={resume.resumeName} 
                                  className="w-12 h-12 object-contain"
                                />
                                <span className="text-sm font-medium text-gray-900">
                                  {resume.resumeName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {resume.matchedJob ? (
                                <button className="flex items-center gap-1.5 text-sm text-gray-900 hover:text-purple-600">
                                  <RiLinkM size={14} />
                                  <span>{resume.matchedJob}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleConnectJob(resume.id)}
                                  className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700"
                                >
                                  <RiLinkM size={14} />
                                  <span>Connect Job</span>
                                </button>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {analyzingResumes.includes(resume.id) ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs text-gray-900">
                                    Analyzing
                                  </span>
                                </div>
                              ) : resume.matchedJob ? (
                                <div
                                  className={`text-sm font-semibold ${getScoreColor(
                                    resume.match
                                  )}`}
                                >
                                  {resume.match}%
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900">—</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {formatDate(resume.created)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {formatDate(resume.lastEdited)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleAnalyze(resume)}
                                  disabled={!resume.matchedJob}
                                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-3xl text-sm font-medium transition-all ${
                                    resume.matchedJob
                                      ? "bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  <span
                                    className={`material-symbols-outlined ${
                                      resume.matchedJob ? "text-purple-600" : "text-gray-400"
                                    }`}
                                    style={{
                                      fontSize: "16px",
                                      fontVariationSettings:
                                        '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 16',
                                    }}
                                  >
                                    auto_awesome
                                  </span>
                                  <span className="text-gray-900">Analyze</span>
                                </button>
                                <button
                                  onClick={() => handleEditResume(resume)}
                                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-3xl text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                                >
                                  <span
                                    className="material-symbols-outlined text-purple-600"
                                    style={{
                                      fontSize: "16px",
                                      fontVariationSettings:
                                        '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 16',
                                    }}
                                  >
                                    edit_square
                                  </span>
                                  <span className="text-gray-900">Edit</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-1.5 max-w-2xl w-full mx-4" style={{ minHeight: "390px" }}>
            <div className="text-center h-full">
              {/* Light Gray Gradient Container - Everything inside here */}
              <div 
                className="rounded-2xl p-8 border border-gray-200"
                style={{
                  background: 'linear-gradient(to bottom, rgba(249, 250, 251, 0.15), rgba(243, 244, 246, 0.15))'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Upload Resume
                  </h3>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
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

                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  {/* Upload Image */}
                  <div className="mb-6 flex justify-center">
                    <img 
                      src="/uplaod.png" 
                      alt="Upload files" 
                      className="w-40 h-40 object-contain"
                      style={{
                        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))'
                      }}
                    />
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to browse
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                  <button className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium">
                    Browse Files
                  </button>
                </div>

                <div className="mt-4">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">
                    Recent Uploads
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "Senior_FE_Resume.pdf", img: "/fileimage.png" },
                      { name: "Backend_Engineer_Resume.docx", img: "/fileimage1.png" },
                      { name: "Fullstack_Resume.pdf", img: "/fileimage2.png" },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-1 bg-gray-50 rounded-2xl"
                        style={{
                          backgroundColor: 'rgba(249, 250, 251, 0.9)'
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

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUploadResume}
                    className="flex-1 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-3xl transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-3xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Job Modal */}
      {connectJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connect Job Description
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jdContent}
                onChange={(e) => setJdContent(e.target.value)}
                placeholder="Paste the job description here..."
                rows={8}
                className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAnalyzeWithJD}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                <RiSparklingFill size={16} />
                <span>Analyze</span>
              </button>
              <button
                onClick={() => {
                  setConnectJobModal(null);
                  setJdContent("");
                }}
                className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Multiple Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compare Resumes with Job Description
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Comparing {selectedResumes.length} resume
              {selectedResumes.length > 1 ? "s" : ""} against this job
              description
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={compareJDContent}
                onChange={(e) => setCompareJDContent(e.target.value)}
                placeholder="Paste the job description here..."
                rows={8}
                className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCompareAnalyze}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] font-medium"
              >
                <RiSparklingFill size={20} />
                <span>Analyze All</span>
              </button>
              <button
                onClick={() => {
                  setCompareModalOpen(false);
                  setCompareJDContent("");
                }}
                className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analyze Modal */}
      {analyzeModalOpen && selectedResumeForAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analyze Resume
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Resume:</strong> {selectedResumeForAnalysis.resumeName}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Matched Job:</strong>{" "}
                {selectedResumeForAnalysis.matchedJob || "Not connected"}
              </p>
              {selectedResumeForAnalysis.matchedJob && (
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Current Match Score:</strong>{" "}
                  <span
                    className={`font-semibold ${getScoreColor(
                      selectedResumeForAnalysis.match
                    )}`}
                  >
                    {selectedResumeForAnalysis.match}%
                  </span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log(
                    "Starting analysis for:",
                    selectedResumeForAnalysis
                  );
                  setAnalyzeModalOpen(false);
                  setSelectedResumeForAnalysis(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] font-medium"
              >
                <RiSparklingFill size={20} />
                <span>Start Analysis</span>
              </button>
              <button
                onClick={() => {
                  setAnalyzeModalOpen(false);
                  setSelectedResumeForAnalysis(null);
                }}
                className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Modal - Navigation */}
      {logoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Navigate To
              </h3>
              <button
                onClick={() => setLogoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-gray-900 font-medium">Landing Page</span>
              </button>
              <button
                onClick={() => {
                  navigate("/resume");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <RiSparklingFill size={16} className="text-purple-600" />
                <span className="text-gray-900 font-medium">AI Interview</span>
              </button>
              <button
                onClick={() => {
                  navigate("/manage-jds");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <RiFileList3Line size={16} />
                <span className="text-gray-900 font-medium">Manage JDs</span>
              </button>
              <button
                onClick={() => {
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-purple-50 text-left"
              >
                <RiFileCopyLine size={16} className="text-purple-600" />
                <span className="text-gray-900 font-medium">
                  Manage Resume (Current)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Element Tooltip */}
      {inspectMode && inspectData && (
        <div
          className="inspect-tooltip fixed z-[9999] bg-black text-white rounded-lg shadow-xl max-w-lg pointer-events-auto"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y - 5,
            transform: mousePosition.x > window.innerWidth - 400 ? 'translateX(-100%) translateX(-30px)' : 'none',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onMouseLeave={() => {
            if (!tooltipPinned) {
              setInspectData(null);
            }
          }}
        >
          {/* Header with Badge and Close Button */}
          <div className="flex items-center justify-between p-3">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white text-gray-900">
              {inspectData.name}
            </span>
            <button
              onClick={closeTooltip}
              className="flex items-center justify-center w-6 h-6 bg-gray-800 hover:bg-gray-700 text-white rounded-3xl transition-colors duration-200"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Code Content */}
          <div 
            className="p-3 max-h-60 overflow-y-auto cursor-pointer hover:bg-gray-900 transition-colors duration-200"
            onClick={() => copyToClipboard(inspectData.jsx)}
            title="Click to copy code"
          >
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-tight">
              <code>{inspectData.jsx}</code>
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
