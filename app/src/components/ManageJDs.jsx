import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiNotification3Line,
  RiUser3Fill,
  RiMenuLine,
  RiFileTextLine,
  RiUploadLine,
  RiFileCopyLine,
  RiFileList3Line,
  RiBookmarkLine,
  RiAddLine,
  RiCloseLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiMoreLine,
  RiBarChartBoxLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiCheckboxMultipleLine,
  RiArrowLeftLine,
  RiStarLine,
  RiRobotLine,
  RiEditLine,
  RiSparklingFill,
} from "@remixicon/react";
import logoSvg from "../assets/logo.svg";
import "material-symbols/outlined.css";

// Add Google Fonts Material Icons
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
link.rel = "stylesheet";
if (!document.head.querySelector('link[href*="material+symbols"]')) {
  document.head.appendChild(link);
}

// Sample Resume data - in real app this would come from API
const SAMPLE_RESUMES = [
  {
    id: 1,
    resumeName: "Frontend Developer Resume",
    created: "2024-01-15",
    lastEdited: "2024-01-20",
  },
  {
    id: 2,
    resumeName: "Full-Stack Developer Resume",
    created: "2024-01-10",
    lastEdited: "2024-01-18",
  },
  {
    id: 3,
    resumeName: "Backend Developer Resume",
    created: "2024-01-08",
    lastEdited: "2024-01-15",
  },
];

// Sample JD data - in real app this would come from API
const SAMPLE_JDS = [
  {
    id: 1,
    jobTitle: "Full-Stack Developer",
    companyName: "Mandal Minds",
    dateAdded: "2024-01-15",
    matchScore: 87,
    description: `We are looking for a skilled Full-Stack Developer to join our team at Mandal Minds. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Design and develop scalable web applications using React, Node.js, and MongoDB
• Collaborate with cross-functional teams to define, design, and ship new features
• Write clean, maintainable, and efficient code following best practices
• Implement responsive UI/UX designs and ensure cross-browser compatibility
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Debug and troubleshoot issues across the full stack
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• 3+ years of experience in full-stack development
• Proficiency in JavaScript, HTML5, CSS3, and modern frameworks (React, Vue.js, or Angular)
• Strong backend development skills with Node.js, Express.js, or similar
• Experience with databases (MongoDB, PostgreSQL, or MySQL)
• Knowledge of RESTful APIs and GraphQL
• Familiarity with version control systems (Git)
• Understanding of cloud platforms (AWS, Azure, or GCP)
• Experience with containerization (Docker) and CI/CD pipelines

Preferred Qualifications:
• Bachelor's degree in Computer Science or related field
• Experience with TypeScript and modern build tools (Webpack, Vite)
• Knowledge of microservices architecture
• Familiarity with testing frameworks (Jest, Cypress)
• Understanding of Agile/Scrum methodologies

What We Offer:
• Competitive salary and equity package
• Flexible work arrangements (remote/hybrid)
• Professional development opportunities
• Health, dental, and vision insurance
• 401(k) with company matching
• Unlimited PTO policy`,
  },
  {
    id: 2,
    jobTitle: "Full-Stack Developer",
    companyName: "TechCorp Inc",
    dateAdded: "2024-01-12",
    matchScore: 92,
    description: `We are looking for a skilled Full-Stack Developer to join our team at TechCorp Inc. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Design and develop scalable web applications using React, Node.js, and PostgreSQL
• Collaborate with product managers and designers to implement new features
• Write clean, maintainable, and efficient code following best practices
• Implement responsive UI/UX designs and ensure cross-browser compatibility
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Debug and troubleshoot issues across the full stack
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• 4+ years of experience in full-stack development
• Proficiency in JavaScript, TypeScript, HTML5, CSS3, and React
• Strong backend development skills with Node.js and Express.js
• Experience with PostgreSQL and database optimization
• Knowledge of RESTful APIs and GraphQL
• Familiarity with version control systems (Git)
• Understanding of cloud platforms (AWS preferred)
• Experience with containerization (Docker) and Kubernetes`,
  },
  {
    id: 3,
    jobTitle: "Full-Stack Developer",
    companyName: "DataFlow Solutions",
    dateAdded: "2024-01-10",
    matchScore: 78,
    description: `We are looking for a skilled Full-Stack Developer to join our team at DataFlow Solutions. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Design and develop scalable web applications using Vue.js, Python, and MySQL
• Work closely with data scientists to implement data visualization features
• Write clean, maintainable, and efficient code following best practices
• Implement responsive UI/UX designs and ensure cross-browser compatibility
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Debug and troubleshoot issues across the full stack
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• 2+ years of experience in full-stack development
• Proficiency in JavaScript, HTML5, CSS3, and Vue.js
• Strong backend development skills with Python and Django/Flask
• Experience with MySQL and database design
• Knowledge of RESTful APIs
• Familiarity with version control systems (Git)
• Understanding of data visualization libraries (D3.js, Chart.js)
• Experience with Python data libraries (Pandas, NumPy)`,
  },
];

export default function ManageJDs() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [jds, setJds] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedJDs, setSelectedJDs] = useState([]);
  const navigate = useNavigate();
  const [isTableView, setIsTableView] = useState(false);
  const [isUploadView, setIsUploadView] = useState(false);
  const [newJD, setNewJD] = useState({
    jobTitle: "",
    companyName: "",
    description: "",
  });
  const [resumeSelectionModal, setResumeSelectionModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [singleAnalyzeModal, setSingleAnalyzeModal] = useState(false);
  const [singleJDToAnalyze, setSingleJDToAnalyze] = useState(null);
  const [editJDModal, setEditJDModal] = useState(false);
  const [selectedJDForEdit, setSelectedJDForEdit] = useState(null);
  const [analyzingJDs, setAnalyzingJDs] = useState([]);

  useEffect(() => {
    // Load JDs - in real app this would be from API
    setJds(SAMPLE_JDS);
  }, []);

  const handleAnalyze = (jd) => {
    setSingleJDToAnalyze(jd);
    setSingleAnalyzeModal(true);
    setSelectedResume(null);
  };

  const handleSingleAnalysis = () => {
    if (!selectedResume || !singleJDToAnalyze) {
      alert("Please select a resume");
      return;
    }

    // Close modal and start analyzing
    setSingleAnalyzeModal(false);
    setAnalyzingJDs([singleJDToAnalyze.id]);

    // Simulate analysis with spinner (3 seconds)
    setTimeout(() => {
      const matchScore = Math.floor(Math.random() * 30) + 70; // Random score 70-100

      // Update the JD with match results
      setJds((prevJds) =>
        prevJds.map((jd) =>
          jd.id === singleJDToAnalyze.id
            ? {
                ...jd,
                matchedResume: selectedResume.resumeName,
                matchScore: matchScore,
              }
            : jd
        )
      );

      // Remove from analyzing list
      setAnalyzingJDs([]);
    }, 3000);

    setSelectedResume(null);
    setSingleJDToAnalyze(null);
  };

  const handleCompareSelected = () => {
    if (selectedJDs.length > 0) {
      setResumeSelectionModal(true);
    } else {
      alert("Please select at least one JD to compare");
    }
  };

  const handleResumeSelection = (resume) => {
    setSelectedResume(resume);
  };

  const handleStartAnalysis = () => {
    if (!selectedResume) {
      alert("Please select a resume");
      return;
    }

    setResumeSelectionModal(false);

    // Simulate analysis for each selected JD
    const results = selectedJDs.map((jdId) => {
      const jd = jds.find((j) => j.id === jdId);
      const matchScore = Math.floor(Math.random() * 30) + 70; // Random score 70-100
      return {
        jdId: jd.id,
        jobTitle: jd.jobTitle,
        companyName: jd.companyName,
        matchScore: matchScore,
        resumeName: selectedResume.resumeName,
      };
    });

    // Update JDs with match results
    setJds((prevJds) =>
      prevJds.map((jd) => {
        const result = results.find((r) => r.jdId === jd.id);
        if (result) {
          return {
            ...jd,
            matchedResume: result.resumeName,
            matchScore: result.matchScore,
          };
        }
        return jd;
      })
    );

    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);

    setAnalysisResults(results);
    setShowResults(true);

    // Reset compare mode
    setIsCompareMode(false);
    setSelectedJDs([]);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const toggleJDSelection = (id) => {
    setSelectedJDs((prev) =>
      prev.includes(id) ? prev.filter((jdId) => jdId !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSaveJD = () => {
    if (!newJD.jobTitle || !newJD.companyName || !newJD.description) {
      alert("Please fill in all fields");
      return;
    }

    const jdToAdd = {
      id: Date.now(),
      jobTitle: newJD.jobTitle,
      companyName: newJD.companyName,
      dateAdded: new Date().toISOString().split("T")[0],
      matchScore: Math.floor(Math.random() * 20) + 75, // Random score 75-95
      description: newJD.description,
    };

    setJds([...jds, jdToAdd]);
    setNewJD({ jobTitle: "", companyName: "", description: "" });
    setIsTableView(false);
  };

  const handleUpdateJD = () => {
    if (
      !selectedJDForEdit.jobTitle ||
      !selectedJDForEdit.companyName ||
      !selectedJDForEdit.description
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Update the JD in the list
    setJds((prevJds) =>
      prevJds.map((jd) =>
        jd.id === selectedJDForEdit.id
          ? {
              ...jd,
              jobTitle: selectedJDForEdit.jobTitle,
              companyName: selectedJDForEdit.companyName,
              description: selectedJDForEdit.description,
            }
          : jd
      )
    );

    setEditJDModal(false);
    setSelectedJDForEdit(null);
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
                  <div className="flex items-center space-x-2">
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

              <a
                href="#"
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md transition-colors`}
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
              </a>

              <button
                onClick={() => navigate("/manage-resume")}
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
                  content_copy
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Manage Resume</span>
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
                  description
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Manage JDs</span>
                )}
              </a>
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
            <h1 className="text-base font-bold text-gray-900">
              Manage Job Descriptions
            </h1>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Empty State - Always Show */}
              {!isTableView && !isUploadView && (
                <div className="flex items-center justify-center mb-8">
                  <div className="max-w-6xl w-full">
                    {/* White Box Container */}
                    <div
                      className="bg-white rounded-lg p-10"
                      style={{ minHeight: "390px" }}
                    >
                      {/* Default Empty State */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <span
                            className="material-symbols-outlined text-purple-600"
                            style={{
                              fontSize: "32px",
                              fontVariationSettings:
                                '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 32',
                            }}
                          >
                            description
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          Your Job Description Hub
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Start by adding a JD manually or uploading a JD file.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                              setIsTableView(true);
                              setIsUploadView(false);
                            }}
                            className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <RiAddLine size={20} />
                            <span>Add JD</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsUploadView(true);
                              setIsTableView(false);
                            }}
                            className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <RiUploadLine size={20} />
                            <span>Upload JD</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isTableView && (
                // Add JD Input Area
                <div className="flex items-center justify-center mb-8">
                  <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-lg p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Add Job Description
                        </h3>
                        <button
                          onClick={() => setIsTableView(false)}
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

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={newJD.jobTitle}
                            onChange={(e) =>
                              setNewJD({ ...newJD, jobTitle: e.target.value })
                            }
                            placeholder="e.g., Senior Full-Stack Developer"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={newJD.companyName}
                            onChange={(e) =>
                              setNewJD({
                                ...newJD,
                                companyName: e.target.value,
                              })
                            }
                            placeholder="e.g., Mandal Minds"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description
                          </label>
                          <textarea
                            rows={6}
                            value={newJD.description}
                            onChange={(e) =>
                              setNewJD({
                                ...newJD,
                                description: e.target.value,
                              })
                            }
                            placeholder="Paste the complete job description here..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveJD}
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                          >
                            Save JD
                          </button>
                          <button
                            onClick={() => {
                              setIsTableView(false);
                              setNewJD({
                                jobTitle: "",
                                companyName: "",
                                description: "",
                              });
                            }}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isUploadView && (
                // Upload JD Area
                <div className="flex items-center justify-center mb-8">
                  <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-lg p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Upload Job Description
                        </h3>
                        <button
                          onClick={() => setIsUploadView(false)}
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

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-400 transition-colors cursor-pointer">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <RiUploadLine size={32} className="text-purple-600" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Drop files here or click to browse
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Supported formats: PDF, DOCX, TXT
                        </p>
                        <button className="px-6 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                          Browse Files
                        </button>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Recent Uploads
                        </h4>
                        <div className="space-y-2">
                          {[
                            "Senior_FE_JD.pdf",
                            "Backend_Engineer_JD.docx",
                            "Fullstack_JD.txt",
                          ].map((name) => (
                            <div
                              key={name}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="material-symbols-outlined text-gray-600"
                                  style={{ fontSize: 20 }}
                                >
                                  description
                                </span>
                                <div className="text-sm text-gray-900">
                                  {name}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                Just now
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All Files Section */}
              {jds.length > 0 && (
                <div>
                  {/* Header Actions */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        All Files
                      </h2>

                      <div className="flex items-center space-x-3">
                        {!isCompareMode && (
                          <button
                            onClick={() => setIsCompareMode(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <RiCheckboxMultipleLine size={16} />
                            <span>Compare Multiple</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsTableView(true);
                            setIsUploadView(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RiAddLine size={16} />
                          <span>Add New JD</span>
                        </button>
                      </div>
                    </div>

                    {/* Compare Mode Controls - Second Line */}
                    {isCompareMode && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {selectedJDs.length} selected
                        </span>
                        <button
                          onClick={handleCompareSelected}
                          disabled={selectedJDs.length === 0}
                          className="px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 disabled:text-gray-400 disabled:border-gray-200 rounded-lg transition-colors text-sm"
                        >
                          Compare Selected
                        </button>
                        <button
                          onClick={() => {
                            setIsCompareMode(false);
                            setSelectedJDs([]);
                          }}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* JD Table */}
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white border-b border-gray-200">
                          {isCompareMode && (
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-purple-600 border-gray-300 rounded focus:ring-purple-600"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedJDs(jds.map((jd) => jd.id));
                                  } else {
                                    setSelectedJDs([]);
                                  }
                                }}
                              />
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Last Updated
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Match
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {jds.map((jd, index) => (
                          <tr
                            key={jd.id}
                            className={
                              index % 2 === 0
                                ? "bg-white hover:bg-gray-100"
                                : "bg-gray-50 hover:bg-gray-100"
                            }
                          >
                            {isCompareMode && (
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedJDs.includes(jd.id)}
                                  onChange={() => toggleJDSelection(jd.id)}
                                  className="w-4 h-4 accent-purple-600 border-gray-300 rounded focus:ring-purple-600"
                                />
                              </td>
                            )}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <RiFileTextLine
                                  size={18}
                                  className="text-gray-400"
                                />
                                <span className="text-sm font-medium text-gray-900">
                                  {jd.jobTitle}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {jd.companyName}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {formatDate(jd.dateAdded)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {analyzingJDs.includes(jd.id) ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs text-gray-500">
                                    Analyzing
                                  </span>
                                </div>
                              ) : jd.matchedResume ? (
                                <div className="text-sm">
                                  <div className="font-medium text-gray-900">
                                    {jd.matchedResume}
                                  </div>
                                  <div
                                    className={`text-sm font-semibold ${getScoreColor(
                                      jd.matchScore
                                    )}`}
                                  >
                                    {jd.matchScore}%
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">—</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleAnalyze(jd)}
                                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                                >
                                  <RiSparklingFill
                                    size={16}
                                    className="text-purple-600"
                                  />
                                  <span>Analysis</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedJDForEdit(jd);
                                    setEditJDModal(true);
                                  }}
                                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                                >
                                  <span
                                    className="material-symbols-outlined"
                                    style={{
                                      fontSize: "16px",
                                      fontVariationSettings:
                                        '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 16',
                                    }}
                                  >
                                    edit
                                  </span>
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

      {/* Resume Selection Modal */}
      {resumeSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Resume to Compare Against
              </h3>
              <button
                onClick={() => {
                  setResumeSelectionModal(false);
                  setSelectedResume(null);
                }}
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

            <p className="text-sm text-gray-600 mb-4">
              Comparing {selectedJDs.length} JD
              {selectedJDs.length > 1 ? "s" : ""} against selected resume
            </p>

            <div className="space-y-3 mb-6">
              {SAMPLE_RESUMES.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleResumeSelection(resume)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedResume?.id === resume.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {resume.resumeName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Last edited: {formatDate(resume.lastEdited)}
                      </p>
                    </div>
                    {selectedResume?.id === resume.id && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartAnalysis}
                disabled={!selectedResume}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  selectedResume
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <RiSparklingFill size={20} />
                <span>Analyze All JDs</span>
              </button>
              <button
                onClick={() => {
                  setResumeSelectionModal(false);
                  setSelectedResume(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Results
              </h3>
              <button
                onClick={() => {
                  setShowResults(false);
                  setAnalysisResults([]);
                  setSelectedResume(null);
                }}
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

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Resume Analyzed:
              </h4>
              <p className="text-gray-700">{analysisResults[0]?.resumeName}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3">
                JD Match Scores (Ranked by Best Match)
              </h4>
              <div className="space-y-3">
                {analysisResults.map((result, index) => (
                  <div
                    key={result.jdId}
                    onClick={() => setSelectedResultIndex(index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedResultIndex === index
                        ? "border-purple-500 bg-purple-50"
                        : index === 0
                        ? "border-green-300 bg-green-50 hover:bg-green-100"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Best Match
                            </span>
                          )}
                          {selectedResultIndex === index && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                              Selected
                            </span>
                          )}
                          <h5 className="font-medium text-gray-900">
                            {result.jobTitle}
                          </h5>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.companyName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(
                            result.matchScore
                          )}`}
                        >
                          {result.matchScore}%
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const selectedMatch = analysisResults[selectedResultIndex];
                  console.log("Proceeding with selected match:", selectedMatch);
                  // In real app: navigate to detailed analysis or application page
                  setShowResults(false);
                  setAnalysisResults([]);
                  setSelectedResume(null);
                  setSelectedResultIndex(0);
                }}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Proceed with Selected
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setAnalysisResults([]);
                  setSelectedResume(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single JD Analysis Modal */}
      {singleAnalyzeModal && singleJDToAnalyze && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Analyze Job Description
              </h3>
              <button
                onClick={() => {
                  setSingleAnalyzeModal(false);
                  setSingleJDToAnalyze(null);
                  setSelectedResume(null);
                }}
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

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Job Description:
              </h4>
              <p className="font-medium text-gray-900">
                {singleJDToAnalyze.jobTitle}
              </p>
              <p className="text-sm text-gray-600">
                {singleJDToAnalyze.companyName}
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select a resume to compare against this job description
            </p>

            <div className="space-y-3 mb-6">
              {SAMPLE_RESUMES.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleResumeSelection(resume)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedResume?.id === resume.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {resume.resumeName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Last edited: {formatDate(resume.lastEdited)}
                      </p>
                    </div>
                    {selectedResume?.id === resume.id && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSingleAnalysis}
                disabled={!selectedResume}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  selectedResume
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <RiSparklingFill size={20} />
                <span>Analyze</span>
              </button>
              <button
                onClick={() => {
                  setSingleAnalyzeModal(false);
                  setSingleJDToAnalyze(null);
                  setSelectedResume(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit JD Modal */}
      {editJDModal && selectedJDForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Job Description
              </h3>
              <button
                onClick={() => {
                  setEditJDModal(false);
                  setSelectedJDForEdit(null);
                }}
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={selectedJDForEdit.jobTitle}
                  onChange={(e) =>
                    setSelectedJDForEdit({
                      ...selectedJDForEdit,
                      jobTitle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={selectedJDForEdit.companyName}
                  onChange={(e) =>
                    setSelectedJDForEdit({
                      ...selectedJDForEdit,
                      companyName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  rows={8}
                  value={selectedJDForEdit.description}
                  onChange={(e) =>
                    setSelectedJDForEdit({
                      ...selectedJDForEdit,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateJD}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Update JD
                </button>
                <button
                  onClick={() => {
                    setEditJDModal(false);
                    setSelectedJDForEdit(null);
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
