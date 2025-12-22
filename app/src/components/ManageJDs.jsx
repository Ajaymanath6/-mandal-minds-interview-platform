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
import Sidebar from "./Sidebar";

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
  const [suggestedMatch, setSuggestedMatch] = useState(null);
  const [isAnalyzingNew, setIsAnalyzingNew] = useState(false);

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

    // Automatically analyze against all resumes and suggest best match
    setIsAnalyzingNew(true);

    setTimeout(() => {
      // Find best matching resume (highest score)
      const resumeMatches = SAMPLE_RESUMES.map((resume) => ({
        ...resume,
        matchScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100
        jdId: jdToAdd.id,
        jdTitle: jdToAdd.jobTitle,
        jdCompany: jdToAdd.companyName,
      }));

      // Sort by match score and get the best one
      resumeMatches.sort((a, b) => b.matchScore - a.matchScore);
      const bestMatch = resumeMatches[0];

      setSuggestedMatch(bestMatch);
      setIsAnalyzingNew(false);

      // Update the JD with the best match
      setJds((prevJds) =>
        prevJds.map((jd) =>
          jd.id === jdToAdd.id
            ? {
                ...jd,
                matchedResume: bestMatch.resumeName,
                matchScore: bestMatch.matchScore,
              }
            : jd
        )
      );
    }, 2000); // 2 second analysis simulation
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
    <div className="h-screen flex" style={{ backgroundColor: "#fcfcfb" }}>
      <div className="flex w-full" style={{ height: "100vh" }}>
        {/* First Sidebar - Always Visible */}
        <Sidebar activeItem="manage-jds" />

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
                      className="bg-white rounded-2xl p-1.5"
                      style={{ minHeight: "390px" }}
                    >
                      {/* Default Empty State */}
                      <div className="text-center">
                        {/* Light Gray Gradient Container - Everything inside here */}
                        <div
                          className="rounded-2xl p-8 border border-gray-200"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(249, 250, 251, 0.15), rgba(243, 244, 246, 0.15))",
                          }}
                        >
                          {/* Heading inside the gray container */}
                          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Your Job Description Hub
                          </h2>

                          <div
                            className="border-2 border-dashed border-gray-300 rounded-3xl p-12"
                            style={{
                              borderStyle: "dashed",
                            }}
                          >
                            {/* Three Tilted JD Images */}
                            <div
                              className="mb-6 flex justify-center items-center relative"
                              style={{ height: "120px" }}
                            >
                              {/* Left tilted image */}
                              <img
                                src="/jdm.png"
                                alt="File upload"
                                className="w-20 h-24 object-contain absolute"
                                style={{
                                  transform: "rotate(-15deg) translateX(-70px)",
                                  zIndex: 1,
                                  mixBlendMode: "multiply",
                                }}
                              />
                              {/* Center image */}
                              <img
                                src="/jdm.png"
                                alt="File upload"
                                className="w-24 h-28 object-contain relative"
                                style={{
                                  zIndex: 3,
                                  mixBlendMode: "multiply",
                                }}
                              />
                              {/* Right tilted image */}
                              <img
                                src="/jdm.png"
                                alt="File upload"
                                className="w-20 h-24 object-contain absolute"
                                style={{
                                  transform: "rotate(15deg) translateX(70px)",
                                  zIndex: 2,
                                  mixBlendMode: "multiply",
                                }}
                              />
                            </div>

                            {/* Main Text */}
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              Drag and drop JD files to upload
                            </p>

                            {/* Subtext */}
                            <p className="text-sm text-gray-600 mb-6">
                              Supported formats: PDF, DOCX, TXT • Max file size:
                              10MB
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={() => {
                                  setIsUploadView(true);
                                  setIsTableView(false);
                                }}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium"
                              >
                                <RiUploadLine size={16} />
                                <span>Upload JD</span>
                              </button>
                              <button
                                onClick={() => {
                                  setIsTableView(true);
                                  setIsUploadView(false);
                                }}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium"
                              >
                                <RiAddLine size={16} />
                                <span>Add JD</span>
                              </button>
                            </div>
                          </div>
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
                            className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
                            className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
                            className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] resize-none"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveJD}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-2xl transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] text-sm font-medium"
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
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium"
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
                  <div className="max-w-6xl w-full">
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

                          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            {/* Upload Image */}
                            <div className="mb-6 flex justify-center">
                              <img
                                src="/uplaod.png"
                                alt="Upload files"
                                className="w-40 h-40 object-contain"
                                style={{
                                  filter:
                                    "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))",
                                }}
                              />
                            </div>

                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                              Drop files here or click to browse
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Supported formats: PDF, DOCX, TXT
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
              )}

              {/* AI Suggestion Card - Above All Files */}
              {(suggestedMatch || isAnalyzingNew) && (
                <div className="mb-8 w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <RiSparklingFill size={20} className="text-purple-600" />
                    <h2 className="text-base font-semibold text-gray-900">
                      AI Suggested Match
                    </h2>
                  </div>

                  {isAnalyzingNew ? (
                    <div className="bg-white rounded-lg p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Analyzing your JD against available resumes...
                          </p>
                          <p className="text-sm text-gray-600">
                            Finding the best match for you
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 relative">
                      {/* Resume Preview Layout */}
                      <div className="flex gap-4">
                        {/* Left: Resume Content Preview */}
                        <div className="flex-1">
                          {/* Header Section - Like Resume */}
                          <div className="text-center mb-3 pb-2 border-b border-gray-300">
                            <h2 className="text-lg font-bold text-black mb-1">
                              John Doe
                            </h2>
                            <p className="text-xs text-black">
                              Designer | +1 (555) 123-4567 | San Francisco, CA
                            </p>
                          </div>

                          {/* Work Experience Section */}
                          <div>
                            <h3 className="text-xs font-semibold text-black mb-2 uppercase tracking-wide">
                              WORK EXPERIENCE
                            </h3>
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-black text-sm">
                                    Backend Developer Resume
                                  </h4>
                                  <p className="text-xs text-black">
                                    Mandal Minds
                                  </p>
                                </div>
                                <span className="text-xs text-black">
                                  2021-01 - Present
                                </span>
                              </div>
                              <p className="text-xs text-black leading-relaxed line-clamp-2">
                                Led development of scalable web applications
                                using React and Node.js. Collaborated with
                                cross-functional teams to deliver high-quality
                                features and ensure optimal performance across
                                multiple platforms and devices.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Close Button Only */}
                        <div className="flex items-start">
                          <button
                            onClick={() => setSuggestedMatch(null)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Dismiss suggestion"
                          >
                            <span
                              className="material-symbols-outlined text-gray-400"
                              style={{ fontSize: 16 }}
                            >
                              close
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons at Bottom */}
                      <div className="mt-4 pt-3 border-t border-gray-300">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              navigate("/resume");
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] font-medium"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 16 }}
                            >
                              auto_awesome
                            </span>
                            <span>Take Interview</span>
                          </button>

                          <button
                            onClick={() => {
                              // Navigate to AI resume optimizer with this resume data
                              navigate("/ai-resume", {
                                state: {
                                  resumeData: {
                                    id: suggestedMatch?.id,
                                    resumeName: suggestedMatch?.resumeName,
                                    matchedJD: {
                                      title: suggestedMatch?.jdTitle,
                                      company: suggestedMatch?.jdCompany,
                                    },
                                  },
                                },
                              });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-black rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] font-medium"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 16 }}
                            >
                              edit_note
                            </span>
                            <span>Smart Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                            className="flex items-center space-x-2 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
                          className="flex items-center space-x-2 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                        >
                          <RiAddLine size={16} />
                          <span>Add New JD</span>
                        </button>
                      </div>
                    </div>

                    {/* Compare Mode Controls - Second Line */}
                    {isCompareMode && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {selectedJDs.length} selected
                        </span>
                        <button
                          onClick={handleCompareSelected}
                          disabled={selectedJDs.length === 0}
                          className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:border-gray-200 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm disabled:shadow-none"
                        >
                          Compare Selected
                        </button>
                        <button
                          onClick={() => {
                            setIsCompareMode(false);
                            setSelectedJDs([]);
                          }}
                          className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm"
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
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
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
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Last Updated
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Match
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {jds.map((jd, index) => {
                          return (
                            <tr
                              key={jd.id}
                              className="transition-colors"
                              style={{
                                backgroundColor:
                                  index % 2 === 0
                                    ? "white"
                                    : "rgba(249, 250, 251, 0.3)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "rgba(249, 250, 251, 0.5)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  index % 2 === 0
                                    ? "white"
                                    : "rgba(249, 250, 251, 0.3)";
                              }}
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
                                  <img
                                    src="/jdm.png"
                                    alt={jd.jobTitle}
                                    className="w-8 h-8 object-contain"
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
                                <div className="text-sm text-gray-900">
                                  {formatDate(jd.dateAdded)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {analyzingJDs.includes(jd.id) ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-gray-900">
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
                                  <div className="text-sm text-gray-900">—</div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleAnalyze(jd)}
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                                  >
                                    <span
                                      className="material-symbols-outlined text-purple-600"
                                      style={{
                                        fontSize: "16px",
                                        fontVariationSettings:
                                          '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 16',
                                      }}
                                    >
                                      auto_awesome
                                    </span>
                                    <span className="text-gray-900">
                                      Analysis
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedJDForEdit(jd);
                                      setEditJDModal(true);
                                    }}
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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

      {/* Resume Selection Modal */}
      {resumeSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-6xl w-full mx-4">
            <div
              className="bg-white rounded-2xl p-1.5"
              style={{ minHeight: "390px" }}
            >
              <div className="text-center">
                {/* Light Gray Gradient Container - Everything inside here */}
                <div
                  className="rounded-2xl p-8 border border-gray-200 relative"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(249, 250, 251, 0.15), rgba(243, 244, 246, 0.15))",
                  }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Select Resume to Compare Against
                    </h3>
                    <button
                      onClick={() => {
                        setResumeSelectionModal(false);
                        setSelectedResume(null);
                      }}
                      className="absolute right-8 top-8 text-gray-500 hover:text-gray-700"
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

                  <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center mb-6">
                    {/* Scan Image */}
                    <div className="mb-4 flex justify-center">
                      <div className="w-48 h-28 overflow-hidden">
                        <img
                          src="/jdscan1.png"
                          alt="Scan and compare"
                          className="w-48 h-48 object-contain"
                          style={{
                            filter:
                              "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))",
                            transform: "translateY(-15%)",
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Comparing {selectedJDs.length} JD
                      {selectedJDs.length > 1 ? "s" : ""} against selected
                      resume
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Select a resume from the list below to compare your
                      selected job descriptions
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {SAMPLE_RESUMES.map((resume, index) => {
                      const fileImages = [
                        "/fileimage.png",
                        "/fileimage1.png",
                        "/fileimage2.png",
                      ];
                      const fileImage = fileImages[index % fileImages.length];

                      return (
                        <div
                          key={resume.id}
                          onClick={() => handleResumeSelection(resume)}
                          className={`rounded-2xl cursor-pointer transition-colors ${
                            selectedResume?.id === resume.id
                              ? "border border-purple-400"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              selectedResume?.id === resume.id
                                ? "rgba(249, 250, 251, 0.3)"
                                : "transparent",
                            borderWidth:
                              selectedResume?.id === resume.id ? "1px" : "0px",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedResume?.id !== resume.id) {
                              e.currentTarget.style.backgroundColor =
                                "rgba(249, 250, 251, 0.5)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedResume?.id !== resume.id) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            } else {
                              e.currentTarget.style.backgroundColor =
                                "rgba(249, 250, 251, 0.3)";
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 py-2 px-3">
                            <img
                              src={fileImage}
                              alt={resume.resumeName}
                              className="w-12 h-12 object-contain"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-900">
                                {resume.resumeName}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-900">
                                  Last edited: {formatDate(resume.lastEdited)}
                                </span>
                                {selectedResume?.id === resume.id && (
                                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      ✓
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleStartAnalysis}
                      disabled={!selectedResume}
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all font-medium text-sm ${
                        selectedResume
                          ? "bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <RiSparklingFill size={16} />
                      <span>Analyze All JDs</span>
                    </button>
                    <button
                      onClick={() => {
                        setResumeSelectionModal(false);
                        setSelectedResume(null);
                      }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-2xl transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
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
                className="flex-1 px-6 py-3 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] font-medium"
              >
                Proceed with Selected
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setAnalysisResults([]);
                  setSelectedResume(null);
                }}
                className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${
                  selectedResume
                    ? "bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
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
                className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
                  className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
                  className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
                  className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateJD}
                  className="flex-1 px-6 py-3 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
                >
                  Update JD
                </button>
                <button
                  onClick={() => {
                    setEditJDModal(false);
                    setSelectedJDForEdit(null);
                  }}
                  className="px-6 py-3 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
