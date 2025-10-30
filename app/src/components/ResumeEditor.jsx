import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  RiArrowRightLine,
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

export default function ResumeEditor() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Resume form data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    summary: "",
    experience: [
      {
        id: 1,
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: [
      {
        id: 1,
        degree: "",
        school: "",
        graduationYear: "",
        gpa: "",
      },
    ],
    skills: {
      technical: [],
      soft: [],
    },
    projects: [
      {
        id: 1,
        name: "",
        description: "",
        technologies: [],
        link: "",
      },
    ],
  });

  const [matchedJD, setMatchedJD] = useState(null);
  const [showResumeForm, setShowResumeForm] = useState(false);

  useEffect(() => {
    // Check if we have resume data from navigation
    if (location.state?.resumeData) {
      const { resumeData: navResumeData } = location.state;
      setMatchedJD(navResumeData.matchedJD);
      setShowResumeForm(true);

      // Load existing resume data (in real app, fetch from API)
      setResumeData({
        ...resumeData,
        personalInfo: {
          ...resumeData.personalInfo,
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
        },
        summary:
          "Experienced full-stack developer with 5+ years of experience in building scalable web applications.",
        experience: [
          {
            id: 1,
            jobTitle: "Senior Full-Stack Developer",
            company: "Mandal Minds",
            startDate: "2021-01",
            endDate: "",
            current: true,
            description:
              "Led development of scalable web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality features.",
          },
        ],
        skills: {
          technical: ["React", "Node.js", "JavaScript", "Python", "MongoDB"],
          soft: ["Leadership", "Communication", "Problem Solving"],
        },
      });
    }
  }, [location.state]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      created: new Date().toISOString().split("T")[0],
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setCreateFolderModal(false);
  };

  // Skill analysis based on JD requirements
  const analyzeSkillGaps = (currentSkills, fieldType) => {
    if (!matchedJD) return { missing: [], suggestions: [], warnings: [] };

    // Sample JD requirements (in real app, this would come from AI analysis)
    const jdRequirements = {
      technical: [
        "React",
        "Node.js",
        "TypeScript",
        "AWS",
        "Docker",
        "GraphQL",
        "PostgreSQL",
        "Redis",
      ],
      soft: [
        "Leadership",
        "Communication",
        "Problem Solving",
        "Team Collaboration",
        "Project Management",
      ],
      experience: [
        "Full-stack development",
        "Microservices",
        "CI/CD",
        "Agile methodology",
      ],
    };

    const userSkills = currentSkills.map((skill) => skill.toLowerCase());
    const requiredSkills = jdRequirements[fieldType] || [];

    const missing = requiredSkills.filter(
      (skill) =>
        !userSkills.some((userSkill) => userSkill.includes(skill.toLowerCase()))
    );

    const suggestions = missing.slice(0, 3); // Top 3 missing skills
    const warnings = missing.length > 3 ? missing.slice(3) : [];

    return { missing, suggestions, warnings };
  };

  const SkillAnalysisCard = ({ fieldName, currentSkills, fieldType }) => {
    const analysis = analyzeSkillGaps(currentSkills, fieldType);

    if (analysis.suggestions.length === 0 && analysis.warnings.length === 0) {
      return (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-green-600"
              style={{ fontSize: 16 }}
            >
              check_circle
            </span>
            <span className="text-sm font-medium text-green-800">
              Great! Your {fieldName} aligns well with the JD
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        {analysis.suggestions.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 mb-2">
              <span
                className="material-symbols-outlined text-blue-600"
                style={{ fontSize: 16 }}
              >
                lightbulb
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  AI Suggestions for {fieldName}
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  Based on the JD for {matchedJD?.title} at {matchedJD?.company}
                </p>
                <div className="flex flex-wrap gap-1">
                  {analysis.suggestions.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Add skill to resume
                        if (fieldType === "technical") {
                          setResumeData((prev) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              technical: [...prev.skills.technical, skill],
                            },
                          }));
                        }
                      }}
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-md transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {analysis.warnings.length > 0 && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <span
                className="material-symbols-outlined text-amber-600"
                style={{ fontSize: 16 }}
              >
                warning
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Skills Gap Warning
                </p>
                <p className="text-xs text-amber-700 mb-2">
                  Consider learning these skills before applying:{" "}
                  {analysis.warnings.join(", ")}
                </p>
                <button className="text-xs text-amber-800 underline hover:no-underline">
                  View learning resources →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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

        {/* Second Sidebar - Resume Sections */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Resume Sections</h2>
            </div>

            {/* Resume Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Personal Information Section */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gray-600" style={{ fontSize: 18 }}>
                      person
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800">Personal Information</h3>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Name: {resumeData.personalInfo.fullName}</p>
                    <p>Email: {resumeData.personalInfo.email}</p>
                    <p>Phone: {resumeData.personalInfo.phone}</p>
                  </div>
                </div>

                {/* Professional Summary Section */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gray-600" style={{ fontSize: 18 }}>
                      description
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800">Professional Summary</h3>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p className="line-clamp-3">{resumeData.summary}</p>
                  </div>
                </div>

                {/* Work Experience Section */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gray-600" style={{ fontSize: 18 }}>
                      work
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800">Work Experience</h3>
                  </div>
                  <div className="space-y-2">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="text-xs text-gray-600">
                        <p className="font-medium">{exp.jobTitle}</p>
                        <p>{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Skills Section */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gray-600" style={{ fontSize: 18 }}>
                      psychology
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800">Technical Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.technical.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-gray-900">
                Resume Editor
              </h1>
              {matchedJD && (
                <div className="text-sm text-gray-600">
                  Editing for:{" "}
                  <span className="font-medium">{matchedJD.title}</span> at{" "}
                  <span className="font-medium">{matchedJD.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Always show resume form */}
          {true && (
            /* Resume Form */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              fullName: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              phone: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              location: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Professional Summary
                  </h2>
                  <textarea
                    rows={4}
                    value={resumeData.summary}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Write a compelling summary of your professional background..."
                  />
                  <SkillAnalysisCard
                    fieldName="Professional Summary"
                    currentSkills={resumeData.summary
                      .split(" ")
                      .filter((word) => word.length > 3)}
                    fieldType="experience"
                  />
                </div>

                {/* Technical Skills */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical Skills
                  </h2>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              setResumeData((prev) => ({
                                ...prev,
                                skills: {
                                  ...prev.skills,
                                  technical: prev.skills.technical.filter(
                                    (_, i) => i !== index
                                  ),
                                },
                              }));
                            }}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a technical skill (press Enter)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          setResumeData((prev) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              technical: [
                                ...prev.skills.technical,
                                e.target.value.trim(),
                              ],
                            },
                          }));
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                  <SkillAnalysisCard
                    fieldName="Technical Skills"
                    currentSkills={resumeData.skills.technical}
                    fieldType="technical"
                  />
                </div>

                {/* Work Experience */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Work Experience
                  </h2>
                  {resumeData.experience.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="space-y-4 pb-6 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].jobTitle = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                experience: newExp,
                              }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].company = e.target.value;
                              setResumeData((prev) => ({
                                ...prev,
                                experience: newExp,
                              }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].description = e.target.value;
                            setResumeData((prev) => ({
                              ...prev,
                              experience: newExp,
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                      <SkillAnalysisCard
                        fieldName="Work Experience"
                        currentSkills={exp.description
                          .split(" ")
                          .filter((word) => word.length > 3)}
                        fieldType="experience"
                      />
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="bg-white rounded-lg p-6">
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">
                      Save Resume
                    </button>
                    <button
                      onClick={() => navigate("/manage-jds")}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back to JDs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <RiEditLine size={32} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Resume Editor
                </h2>
                <p className="text-gray-600 mb-6">
                  Create and organize your resume outlines in folders.
                </p>
                <button
                  onClick={() => setShowResumeForm(true)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      {createFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => setCreateFolderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings:
                      '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  arrow_back
                </span>
              </button>
              <span className="text-sm text-gray-600">Back</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Folder
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>Create</span>
                <RiArrowRightLine
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={() => {
                  setCreateFolderModal(false);
                  setNewFolderName("");
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
