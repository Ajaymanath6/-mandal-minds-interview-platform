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

export default function EditResume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Resume form data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "",
      portfolio: ""
    },
    summary: "Experienced full-stack developer with 5+ years of experience in building scalable web applications.",
    experience: [
      {
        id: 1,
        jobTitle: "Senior Full-Stack Developer",
        company: "Mandal Minds",
        startDate: "2021-01",
        endDate: "",
        current: true,
        description: "Developed and maintained web applications using modern JavaScript frameworks. Implemented RESTful APIs and integrated third-party services."
      }
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Computer Science",
        school: "University of California",
        graduationYear: "2019",
        gpa: "3.8"
      }
    ],
    skills: {
      technical: ["React", "Node.js", "JavaScript", "Python", "MongoDB"],
      soft: ["Leadership", "Communication", "Problem Solving"]
    },
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with React and Node.js",
        technologies: ["React", "Node.js", "MongoDB"],
        link: "https://github.com/johndoe/ecommerce"
      }
    ]
  });
  
  const [matchedJD, setMatchedJD] = useState(null);
  const [activeSection, setActiveSection] = useState("personalInfo");

  useEffect(() => {
    // Check if we have resume data from navigation
    if (location.state?.resumeData) {
      const { resumeData: navResumeData } = location.state;
      setMatchedJD(navResumeData.matchedJD);
    }
  }, [location.state]);

  // AI Analysis for missing skills/keywords
  const getAIRecommendations = (currentText, fieldType) => {
    if (!matchedJD) return [];

    // Sample JD requirements based on field type
    const jdRequirements = {
      experience: ["microservices", "Docker", "Kubernetes", "CI/CD", "AWS", "GraphQL", "TypeScript"],
      technical: ["TypeScript", "AWS", "Docker", "GraphQL", "PostgreSQL", "Redis", "Kubernetes"],
      summary: ["leadership", "team collaboration", "agile methodology", "project management"]
    };

    const requirements = jdRequirements[fieldType] || [];
    const currentTextLower = currentText.toLowerCase();
    
    return requirements.filter(skill => 
      !currentTextLower.includes(skill.toLowerCase())
    ).slice(0, 4); // Show top 4 missing skills
  };

  // AI Badge Component
  const AIBadge = ({ skill, onAdd, tooltip }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative inline-block">
        <button
          onClick={() => onAdd(skill)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-md transition-colors border border-blue-200"
        >
          <span className="text-blue-600">+</span>
          <span>{skill}</span>
        </button>
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  // Add skill to experience description
  const addSkillToExperience = (experienceId, skill) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === experienceId 
          ? { ...exp, description: `${exp.description} Utilized ${skill} for enhanced performance and scalability.` }
          : exp
      )
    }));
  };

  // Add skill to technical skills
  const addTechnicalSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: [...prev.skills.technical, skill]
      }
    }));
  };

  // Add keyword to summary
  const addToSummary = (keyword) => {
    setResumeData(prev => ({
      ...prev,
      summary: `${prev.summary} Experienced in ${keyword} and modern development practices.`
    }));
  };

  const sections = [
    { id: "personalInfo", name: "Personal Information", icon: "person" },
    { id: "summary", name: "Professional Summary", icon: "description" },
    { id: "experience", name: "Work Experience", icon: "work" },
    { id: "skills", name: "Skills", icon: "psychology" },
    { id: "education", name: "Education", icon: "school" },
    { id: "projects", name: "Projects", icon: "code" },
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="flex w-full" style={{ height: "100vh" }}>
        {/* First Sidebar - Navigation */}
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

        {/* Second Sidebar - Resume Sections & AI Recommendations */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <RiSparklingFill size={20} className="text-purple-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  AI-Enhanced Resume
                </h2>
              </div>
              {matchedJD && (
                <p className="text-xs text-gray-600">
                  Optimizing for: <span className="font-medium">{matchedJD.title}</span> at <span className="font-medium">{matchedJD.company}</span>
                </p>
              )}
            </div>

            {/* Resume Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Section Navigation */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Resume Sections</h3>
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                          activeSection === section.id
                            ? "bg-purple-100 text-purple-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18 }}
                        >
                          {section.icon}
                        </span>
                        <span className="text-sm">{section.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technical Skills Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Technical Skills</h3>
                  
                  {/* Current Skills */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Current Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommended Skills */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">AI Recommendations:</p>
                    <div className="flex flex-wrap gap-1">
                      {getAIRecommendations(resumeData.skills.technical.join(" "), "technical").map((skill, index) => (
                        <AIBadge
                          key={index}
                          skill={skill}
                          onAdd={addTechnicalSkill}
                          tooltip="Add to technical skills"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Experience Enhancement</h3>
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-800 mb-2">{exp.jobTitle}</p>
                      <p className="text-xs text-gray-600 mb-2">Missing keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {getAIRecommendations(exp.description, "experience").map((skill, skillIndex) => (
                          <AIBadge
                            key={skillIndex}
                            skill={skill}
                            onAdd={(skill) => addSkillToExperience(exp.id, skill)}
                            tooltip="Add to experience description"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Summary Enhancement</h3>
                  <div className="flex flex-wrap gap-1">
                    {getAIRecommendations(resumeData.summary, "summary").map((keyword, index) => (
                      <AIBadge
                        key={index}
                        skill={keyword}
                        onAdd={addToSummary}
                        tooltip="Add to professional summary"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Resume Form */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-gray-900">Edit Resume</h1>
              <button
                onClick={() => navigate("/manage-jds")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <RiArrowLeftLine size={16} />
                <span>Back to JDs</span>
              </button>
            </div>
          </div>

          {/* Resume Form */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {activeSection === "personalInfo" && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "summary" && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h2>
                  <textarea
                    rows={6}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Write a compelling summary of your professional background..."
                  />
                  
                  {/* AI Recommendations for Summary */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">AI Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {getAIRecommendations(resumeData.summary, "summary").map((keyword, index) => (
                        <AIBadge
                          key={index}
                          skill={keyword}
                          onAdd={addToSummary}
                          tooltip="Click to add to summary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "experience" && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-4 pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].jobTitle = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: newExp }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].company = e.target.value;
                              setResumeData(prev => ({ ...prev, experience: newExp }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={4}
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].description = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                        
                        {/* AI Recommendations for this experience */}
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">AI Suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {getAIRecommendations(exp.description, "experience").map((skill, skillIndex) => (
                              <AIBadge
                                key={skillIndex}
                                skill={skill}
                                onAdd={(skill) => addSkillToExperience(exp.id, skill)}
                                tooltip="Click to add to description"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "skills" && (
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h2>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              setResumeData(prev => ({
                                ...prev,
                                skills: {
                                  ...prev.skills,
                                  technical: prev.skills.technical.filter((_, i) => i !== index)
                                }
                              }));
                            }}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    {/* AI Recommendations */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">AI Recommendations:</p>
                      <div className="flex flex-wrap gap-2">
                        {getAIRecommendations(resumeData.skills.technical.join(" "), "technical").map((skill, index) => (
                          <AIBadge
                            key={index}
                            skill={skill}
                            onAdd={addTechnicalSkill}
                            tooltip="Click to add skill"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Add a technical skill (press Enter)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addTechnicalSkill(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 bg-white rounded-lg p-6">
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
        </div>
      </div>
    </div>
  );
}