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
import Sidebar from "./Sidebar";

export default function ResumeEditor() {
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
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-3xl transition-colors"
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
    <div className="h-screen flex" style={{ backgroundColor: "#fcfcfb" }}>
      <div className="flex w-full" style={{ height: "100vh" }}>
        {/* First Sidebar - Always Visible */}
        <Sidebar activeItem="get-vetted" />

        {/* Main Content - Removed */}
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
                className="w-full px-4 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
                className="flex-1 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] flex items-center justify-center space-x-2 group"
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
                className="px-4 py-2 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
