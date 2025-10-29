import { useState, useEffect } from "react";
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
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  auto_awesome
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">AI Interview</span>
                )}
              </button>

              <button
                onClick={() => navigate("/resume-editor")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  edit_document
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Resume Editor</span>
                )}
              </button>

              <a
                href="#"
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-purple-600 bg-gray-50 rounded-md transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  content_copy
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Manage Resume</span>
                )}
              </a>

              <button
                onClick={() => navigate("/manage-jds")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  description
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Manage JDs</span>
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
                    <p className="text-xs text-gray-500 truncate">
                      john.doe@example.com
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
          <div className="mb-6">
            <h1 className="text-base font-bold text-gray-900">Manage Resume</h1>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Action Buttons */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                  {/* Upload Resume Button */}
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex flex-col items-center p-6 bg-white rounded-xl transition-all group"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <RiUploadLine size={28} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Upload Resume
                    </span>
                  </button>

                  {/* New Resume Button */}
                  <button className="flex flex-col items-center p-6 bg-white rounded-xl transition-all group">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <RiAddLine size={28} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      New Resume
                    </span>
                  </button>
                </div>
              </div>

              {resumes.length === 0 ? (
                // Empty State
                <div className="flex items-center justify-center h-64">
                  <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-lg p-8 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <RiFileCopyLine size={32} className="text-purple-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        No Resumes Yet
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Create your first resume to get started with AI-powered
                        optimization.
                      </p>
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
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RiCheckboxMultipleLine size={16} />
                          <span>Compare Multiple</span>
                        </button>
                      )}
                    </div>

                    {/* Compare Mode Controls */}
                    {isCompareMode && (
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-sm text-gray-600">
                          {selectedResumes.length} selected
                        </span>
                        <button
                          onClick={handleCompareSelected}
                          disabled={selectedResumes.length === 0}
                          className="px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 disabled:text-gray-400 disabled:border-gray-200 rounded-lg transition-colors text-sm"
                        >
                          Compare Selected
                        </button>
                        <button
                          onClick={() => {
                            setIsCompareMode(false);
                            setSelectedResumes([]);
                          }}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Resume Table */}
                  <div className="bg-white rounded-lg overflow-hidden">
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
                        {resumes.map((resume) => (
                          <tr
                            key={resume.id}
                            className="bg-white hover:bg-gray-50/80 border-b border-gray-200"
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
                                <RiFolder6Fill
                                  size={18}
                                  className="text-gray-900"
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
                                  <span className="text-xs text-gray-500">
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
                                <div className="text-sm text-gray-400">—</div>
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
                                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
                                    resume.matchedJob
                                      ? "border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50"
                                      : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  <RiSparklingFill
                                    size={16}
                                    className={
                                      resume.matchedJob
                                        ? "text-purple-600"
                                        : "text-gray-400"
                                    }
                                  />
                                  <span>Analyze</span>
                                </button>
                                <button
                                  onClick={() => handleEditResume(resume)}
                                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                                >
                                  <RiEditLine size={16} />
                                  <span>Edit</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Resume
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <RiUploadLine size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drop your resume here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF, DOC, DOCX files
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUploadResume}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                OK
              </button>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAnalyzeWithJD}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RiSparklingFill size={16} />
                <span>Analyze</span>
              </button>
              <button
                onClick={() => {
                  setConnectJobModal(null);
                  setJdContent("");
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCompareAnalyze}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                <RiSparklingFill size={20} />
                <span>Analyze All</span>
              </button>
              <button
                onClick={() => {
                  setCompareModalOpen(false);
                  setCompareJDContent("");
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
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
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                <RiSparklingFill size={20} />
                <span>Start Analysis</span>
              </button>
              <button
                onClick={() => {
                  setAnalyzeModalOpen(false);
                  setSelectedResumeForAnalysis(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
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
    </div>
  );
}
