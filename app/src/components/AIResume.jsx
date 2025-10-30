import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Reorder } from "framer-motion";
import {
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiUserLine,
  RiDeleteBinLine,
  RiQuestionLine,
  RiArrowUpSLine,
  RiEditLine,
  RiArrowUpDownFill,
  RiSparklingFill,
  RiArrowLeftLine,
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

export default function AIResume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  // const [activeSections, setActiveSections] = useState([
  //   "personal",
  //   "work",
  //   "education",
  // ]); // All sections open by default
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: "personal", name: "Personal Information", icon: RiUserLine },
    { id: "work", name: "Work Experience", icon: RiBriefcaseLine },
    { id: "education", name: "Education", icon: RiGraduationCapLine },
    {
      id: "skills",
      name: "Technical Skills",
      icon: () => (
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          psychology
        </span>
      ),
    },
  ]);
  const [editingFields, setEditingFields] = useState({}); // Track which fields are being edited
  const [hoveredResumeSection, setHoveredResumeSection] = useState(null);
  const [activeResumeSection, setActiveResumeSection] = useState(null);
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
    },
    work: [
      {
        id: 1,
        title: "Senior Full-Stack Developer",
        company: "Mandal Minds",
        startDate: "2021-01",
        endDate: "Present",
        description:
          "Led development of scalable web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality features.",
      },
      {
        id: 2,
        title: "Full-Stack Developer",
        company: "TechCorp Inc",
        startDate: "2019-06",
        endDate: "2020-12",
        description:
          "Developed and maintained web applications using modern JavaScript frameworks. Implemented RESTful APIs and integrated third-party services.",
      },
    ],
    education: {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      startYear: "2015",
      endYear: "2019",
      gpa: "3.8/4.0",
    },
    skills: {
      frontend: "React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS",
      backend: "Node.js, Express.js, Python, Django, RESTful APIs",
      database: "MongoDB, PostgreSQL, MySQL, Redis",
      tools: "Git, Docker, AWS, CI/CD, Agile/Scrum",
    },
  });

  // Track original resume content to only allow removal of AI-added skills
  const [originalResumeData] = useState({
    personal: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
    },
    work: [
      {
        id: 1,
        title: "Senior Full-Stack Developer",
        company: "Mandal Minds",
        startDate: "2021-01",
        endDate: "Present",
        description:
          "Led development of scalable web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality features.",
      },
      {
        id: 2,
        title: "Full-Stack Developer",
        company: "TechCorp Inc",
        startDate: "2019-06",
        endDate: "2020-12",
        description:
          "Developed and maintained web applications using modern JavaScript frameworks. Implemented RESTful APIs and integrated third-party services.",
      },
    ],
    education: {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      startYear: "2015",
      endYear: "2019",
      gpa: "3.8/4.0",
    },
    skills: {
      frontend: "React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS",
      backend: "Node.js, Express.js, Python, Django, RESTful APIs",
      database: "MongoDB, PostgreSQL, MySQL, Redis",
      tools: "Git, Docker, AWS, CI/CD, Agile/Scrum",
    },
  });

  // Track AI-suggested skills that have been added
  const [addedAISkills, setAddedAISkills] = useState([]);
  console.log("Added AI skills:", addedAISkills); // For debugging - remove in production
  const navigate = useNavigate();
  const location = useLocation();
  // const [matchedJD, setMatchedJD] = useState(null);

  useEffect(() => {
    // Check if we have resume data from navigation
    if (location.state?.resumeData) {
      // const { resumeData: navResumeData } = location.state;
      // setMatchedJD(navResumeData.matchedJD);
    }
  }, [location.state]);

  // Removed toggleSection - all sections stay open

  const toggleFieldEdit = (fieldId) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const updateResumeData = (section, field, value, index = null) => {
    setResumeData((prev) => {
      if (Array.isArray(prev[section]) && index !== null) {
        // Handle array sections like work experience
        const updatedArray = [...prev[section]];
        updatedArray[index] = {
          ...updatedArray[index],
          [field]: value,
        };
        return {
          ...prev,
          [section]: updatedArray,
        };
      } else {
        // Handle regular object sections
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      }
    });
  };

  // Render sections in order based on sidebar arrangement
  const renderResumeSection = (section) => {
    switch (section.id) {
      case "personal":
        return (
          <ResumeSectionWrapper
            key="personal"
            sectionId="personal"
            sectionName="Personal Information"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resumeData.personal.name}
              </h1>
              <p className="text-gray-600">
                {resumeData.personal.email} | {resumeData.personal.phone} |{" "}
                {resumeData.personal.location}
              </p>
            </div>
          </ResumeSectionWrapper>
        );
      case "work":
        return (
          <ResumeSectionWrapper
            key="work"
            sectionId="work"
            sectionName="Work Experience"
          >
            <div className="mb-8 relative">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                WORK EXPERIENCE
              </h2>
              {resumeData.work.map((workItem) => (
                <div key={workItem.id} className="mb-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {workItem.title}
                      </h3>
                      <p className="text-gray-700">{workItem.company}</p>
                    </div>
                    <p className="text-gray-600">
                      {workItem.startDate} - {workItem.endDate}
                    </p>
                  </div>
                  <div className="relative">
                    <p className="text-gray-700">{workItem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ResumeSectionWrapper>
        );
      case "education":
        return (
          <ResumeSectionWrapper
            key="education"
            sectionId="education"
            sectionName="Education"
          >
            <div className="mb-8 relative">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                EDUCATION
              </h2>
              <div className="mb-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {resumeData.education.degree}
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {resumeData.education.institution}
                    </p>
                  </div>
                  <p className="text-gray-600">
                    {resumeData.education.startYear} -{" "}
                    {resumeData.education.endYear}
                  </p>
                </div>
                <p className="text-gray-700">GPA: {resumeData.education.gpa}</p>
              </div>
            </div>
          </ResumeSectionWrapper>
        );
      case "skills":
        return (
          <ResumeSectionWrapper
            key="skills"
            sectionId="skills"
            sectionName="Technical Skills"
          >
            <div className="mb-8 relative">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                TECHNICAL SKILLS
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Frontend:
                  </h4>
                  <div className="relative">
                    <p className="text-gray-700">
                      {resumeData.skills.frontend}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold text-gray-900 mb-2">Backend:</h4>
                  <div className="relative">
                    <p className="text-gray-700">{resumeData.skills.backend}</p>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Database:
                  </h4>
                  <div className="relative">
                    <p className="text-gray-700">
                      {resumeData.skills.database}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold text-gray-900 mb-2">Tools:</h4>
                  <div className="relative">
                    <p className="text-gray-700">{resumeData.skills.tools}</p>
                  </div>
                </div>
              </div>
            </div>
          </ResumeSectionWrapper>
        );
      default:
        return null;
    }
  };


  // Clear active section highlighting after 3 seconds
  useEffect(() => {
    if (activeResumeSection) {
      const timer = setTimeout(() => {
        setActiveResumeSection(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeResumeSection]);

  // Function to extract only AI-added skills from text (not original resume skills)
  const extractSkillsFromText = (text, sectionId, field, index = null) => {
    // Get original text for comparison
    let originalText = "";
    if (sectionId === "work" && index !== null) {
      originalText = originalResumeData.work[index]?.[field] || "";
    } else if (sectionId === "education") {
      originalText = originalResumeData.education[field] || "";
    } else if (sectionId === "skills") {
      originalText = originalResumeData.skills[field] || "";
    } else if (sectionId === "personal") {
      originalText = originalResumeData.personal[field] || "";
    }

    // AI-suggested skills that can be removed
    const aiSkills = [
      "Microservices",
      "Kubernetes",
      "GraphQL",
      "DevOps",
      "AWS Lambda",
      "Next.js",
      "Terraform",
      "CI/CD pipelines",
      "microservices architecture",
      "Kubernetes orchestration",
      "serverless functions",
      "containerization",
      "cloud platforms",
    ];

    // Only return skills that:
    // 1. Are AI-suggested skills
    // 2. Are present in current text but NOT in original text
    const foundSkills = aiSkills.filter((skill) => {
      const inCurrentText = text.toLowerCase().includes(skill.toLowerCase());
      const inOriginalText = originalText
        .toLowerCase()
        .includes(skill.toLowerCase());
      return inCurrentText && !inOriginalText;
    });

    return foundSkills;
  };

  // Function to remove skill from text
  const removeSkillFromText = (
    text,
    skillToRemove,
    sectionId,
    field,
    index = null
  ) => {
    let newText = text;

    // Remove skill-specific phrases
    const skillPhrases = {
      Microservices: [
        "Designed and implemented microservices architecture",
        "microservices architecture",
        "microservices",
      ],
      Kubernetes: [
        "Deployed applications using Kubernetes orchestration",
        "Kubernetes orchestration",
        "Kubernetes",
      ],
      GraphQL: ["Built efficient APIs using GraphQL", "GraphQL"],
      "CI/CD": [
        "Implemented CI/CD pipelines for automated deployment",
        "CI/CD pipelines",
        "CI/CD",
      ],
      DevOps: [
        "Applied DevOps practices for streamlined development",
        "DevOps practices",
        "DevOps",
      ],
      Docker: ["Containerized applications using Docker", "Docker"],
      "AWS Lambda": [
        "Developed serverless functions with AWS Lambda",
        "AWS Lambda",
      ],
    };

    const phrasesToRemove = skillPhrases[skillToRemove] || [skillToRemove];

    phrasesToRemove.forEach((phrase) => {
      const regex = new RegExp(
        `\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi"
      );
      newText = newText.replace(regex, "");
    });

    // For skills section, also handle comma-separated removal
    if (sectionId === "skills") {
      // Remove skill with surrounding commas
      newText = newText.replace(
        new RegExp(
          `\\s*,\\s*${skillToRemove.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}\\s*,?`,
          "gi"
        ),
        ""
      );
      newText = newText.replace(
        new RegExp(
          `^\\s*${skillToRemove.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*,?`,
          "gi"
        ),
        ""
      );
      newText = newText.replace(
        new RegExp(
          `,\\s*${skillToRemove.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`,
          "gi"
        ),
        ""
      );
    }

    // Clean up extra spaces and punctuation
    newText = newText
      .replace(/\.\s*\./g, ".")
      .replace(/\s+/g, " ")
      .replace(/,\s*,/g, ",")
      .replace(/^,\s*/, "")
      .replace(/\s*,$/, "")
      .trim();

    // Update the resume data
    updateResumeData(sectionId, field, newText, index);
  };

  // Function to rephrase section content with AI (now handled per field)
  // const handleRephraseSection = (sectionId) => {
  //   // Simulate AI rephrasing - in real app this would call an AI API
  //   if (sectionId === "work") {
  //     resumeData.work.forEach((workItem, index) => {
  //       // Rephrase work descriptions with better grammar and flow
  //       const currentDesc = workItem.description;
  //       const rephrasedDesc = rephraseWithAI(currentDesc, "work-description");
  //       updateResumeData("work", "description", rephrasedDesc, index);
  //     });
  //   } else if (sectionId === "education") {
  //     const currentDegree = resumeData.education.degree;
  //     const rephrasedDegree = rephraseWithAI(currentDegree, "education-degree");
  //     updateResumeData("education", "degree", rephrasedDegree);
  //   }

  //   // Show feedback
  //   alert("Content rephrased with AI to improve grammar and flow!");
  // };

  // AI rephrasing function (simulated)
  const rephraseWithAI = (text, type) => {
    // Clean up text first - remove orphaned phrases and fix grammar
    let cleanedText = text;

    // Remove orphaned AI-added phrases that might be left after skill removal
    const orphanedPhrases = [
      /Designed and implemented\s*\./gi,
      /Deployed applications using\s*\./gi,
      /Built efficient APIs using\s*\./gi,
      /Implemented\s*pipelines for automated deployment\./gi,
      /Applied\s*practices for streamlined development\./gi,
      /Containerized applications using\s*\./gi,
      /Developed serverless functions with\s*\./gi,
    ];

    orphanedPhrases.forEach((phrase) => {
      cleanedText = cleanedText.replace(phrase, "");
    });

    // Fix grammar issues after removal
    cleanedText = cleanedText
      .replace(/\.\s*\./g, ".") // Remove double periods
      .replace(/\s+/g, " ") // Remove extra spaces
      .replace(/,\s*,/g, ",") // Remove double commas
      .replace(/\s*,\s*\./g, ".") // Fix comma before period
      .replace(/^\s*,\s*/, "") // Remove leading comma
      .replace(/\s*,$/, "") // Remove trailing comma
      .trim();

    if (type === "work-description") {
      // Improve grammar and flow while keeping remaining keywords
      if (cleanedText.includes("Microservices")) {
        cleanedText = cleanedText.replace(
          /Designed and implemented microservices architecture/gi,
          "Architected and deployed robust microservices solutions to enhance system scalability and maintainability"
        );
      }
      if (cleanedText.includes("Kubernetes")) {
        cleanedText = cleanedText.replace(
          /Deployed applications using Kubernetes orchestration/gi,
          "Orchestrated containerized applications using Kubernetes for improved deployment efficiency and resource management"
        );
      }
      if (cleanedText.includes("GraphQL")) {
        cleanedText = cleanedText.replace(
          /Built efficient APIs using GraphQL/gi,
          "Developed high-performance GraphQL APIs to optimize data fetching and improve client-server communication"
        );
      }

      // Ensure proper sentence structure
      if (cleanedText && !cleanedText.endsWith(".")) {
        cleanedText += ".";
      }
    }

    return cleanedText;
  };

  // Resume Section Wrapper Component
  const ResumeSectionWrapper = ({ sectionId, children }) => {
    const isHovered = hoveredResumeSection === sectionId;
    const isActive = activeResumeSection === sectionId;

    const handleSectionClick = () => {
      setActiveResumeSection(sectionId);
      // Scroll to section in sidebar
      setTimeout(() => {
        const sectionElement = document.getElementById(`section-${sectionId}`);
        if (sectionElement) {
          sectionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    };

    return (
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHoveredResumeSection(sectionId)}
        onMouseLeave={() => setHoveredResumeSection(null)}
        onClick={handleSectionClick}
      >
        {children}
        {isHovered && !isActive && (
          <>
            {/* Purple border overlay - doesn't affect layout */}
            <div className="absolute inset-0 border-2 border-purple-300 rounded-lg pointer-events-none"></div>
            {/* Edit badge */}
            <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs rounded-full font-medium z-10">
              Click to edit this section
            </div>
          </>
        )}
        {isActive && (
          <>
            {/* Active purple border - extends to accommodate overlay */}
            <div
              className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none"
              style={{ paddingTop: "40px" }}
            ></div>
            {/* Active edit badge */}
            <div className="absolute top-2 right-2 bg-purple-700 text-white px-2 py-1 text-xs rounded-full font-medium z-30">
              Editing mode active
            </div>
          </>
        )}
      </div>
    );
  };

  // AI Skill Suggestions based on field content
  const getAISuggestions = (fieldId, currentValue) => {
    // Simulate AI analysis based on JD requirements
    const jdRequiredSkills = {
      "work-description": [
        "Microservices",
        "Kubernetes",
        "GraphQL",
        "CI/CD",
        "DevOps",
        "Docker",
        "AWS Lambda",
      ],
      "work-title": ["Senior", "Lead", "Principal"],
      "work-company": [],
      "personal-name": [],
      "personal-email": [],
      "personal-phone": [],
      "personal-location": [],
      "edu-degree": ["Machine Learning", "Data Science", "Computer Science"],
      "edu-institution": [],
    };

    // Determine field type more accurately
    let fieldType = fieldId;
    if (fieldId.includes("work-description")) {
      fieldType = "work-description";
    } else if (fieldId.includes("work-title")) {
      fieldType = "work-title";
    } else if (fieldId.includes("work-company")) {
      fieldType = "work-company";
    }

    const requiredSkills = jdRequiredSkills[fieldType] || [];

    // Check which skills are missing from current text
    const currentText = currentValue.toLowerCase();
    const missingSkills = requiredSkills.filter(
      (skill) => !currentText.includes(skill.toLowerCase())
    );

    return missingSkills.slice(0, 3); // Return top 3 suggestions
  };

  // Enhanced Editable Field Component with inline text badges
  const EditableFieldWithBadges = ({
    fieldId,
    value,
    placeholder,
    type = "text",
    rows = 1,
    section,
    field,
    index = null,
    isHighlighted = false,
  }) => {
    const [hoveredField, setHoveredField] = useState(null);
    const isEditing = editingFields[fieldId];
    const aiSuggestions = getAISuggestions(fieldId, value);

    // Extract AI-added skills from the current value
    const aiAddedSkills = extractSkillsFromText(value, section, field, index);

    const handleValueChange = (newValue) => {
      if (section && field) {
        updateResumeData(section, field, newValue, index);
      }
      toggleFieldEdit(fieldId);
    };

    const addSuggestionToField = (suggestion) => {
      let newValue;

      if (fieldId.includes("work-description")) {
        // For work descriptions, add contextual sentence
        const contextualPhrases = {
          Microservices: "Designed and implemented microservices architecture",
          Kubernetes: "Deployed applications using Kubernetes orchestration",
          GraphQL: "Built efficient APIs using GraphQL",
          "CI/CD": "Implemented CI/CD pipelines for automated deployment",
          DevOps: "Applied DevOps practices for streamlined development",
          Docker: "Containerized applications using Docker",
          "AWS Lambda": "Developed serverless functions with AWS Lambda",
        };

        const phrase =
          contextualPhrases[suggestion] ||
          `Worked extensively with ${suggestion}`;
        newValue = value + (value.endsWith(".") ? " " : ". ") + `${phrase}.`;
      } else if (fieldId.includes("work-title")) {
        // For job titles, prepend the suggestion
        newValue = `${suggestion} ${value}`;
      } else {
        // Default behavior
        newValue = value + (value ? `, ${suggestion}` : suggestion);
      }

      if (section && field) {
        updateResumeData(section, field, newValue, index);

        // Track AI-added skill
        setAddedAISkills((prev) => [...prev, suggestion]);
      }
    };

    const removeSkillFromField = (skillToRemove) => {
      removeSkillFromText(value, skillToRemove, section, field, index);
    };

    // Function to render text with AI-added portions as badges
    const renderTextWithInlineBadges = () => {
      if (!value || aiAddedSkills.length === 0) {
        return <span className="text-gray-900">{value}</span>;
      }

      let processedText = value;
      const badges = [];

      // Find AI-added phrases and their positions
      const aiPhrases = {
        Microservices: ["microservices architecture", "Microservices"],
        Kubernetes: ["Kubernetes orchestration", "Kubernetes"],
        GraphQL: ["GraphQL", "Built efficient APIs using GraphQL"],
        "CI/CD": ["CI/CD pipelines", "CI/CD"],
        DevOps: ["DevOps practices", "DevOps"],
        Docker: ["Docker", "Containerized applications using Docker"],
        "AWS Lambda": ["AWS Lambda", "serverless functions with AWS Lambda"],
      };

      aiAddedSkills.forEach((skill) => {
        const phrases = aiPhrases[skill] || [skill];

        phrases.forEach((phrase) => {
          const regex = new RegExp(
            `\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
            "gi"
          );
          const matches = [...processedText.matchAll(regex)];

          matches.forEach((match) => {
            badges.push({
              skill,
              phrase: match[0],
              start: match.index,
              end: match.index + match[0].length,
            });
          });
        });
      });

      // Sort badges by position (reverse order for replacement)
      badges.sort((a, b) => b.start - a.start);

      // Replace text with badge elements
      badges.forEach(({ skill, phrase, start, end }) => {
        const beforeText = processedText.substring(0, start);
        const afterText = processedText.substring(end);

        const badgeHtml = `<span class="inline-badge" data-skill="${skill}" data-phrase="${phrase}">${phrase}</span>`;
        processedText = beforeText + badgeHtml + afterText;
      });

      return (
        <div
          className="text-gray-900"
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      );
    };

    if (isEditing) {
      if (type === "textarea") {
        return (
          <textarea
            rows={rows}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            autoFocus
            onBlur={(e) => handleValueChange(e.target.value)}
          />
        );
      }
      return (
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          autoFocus
          onBlur={(e) => handleValueChange(e.target.value)}
        />
      );
    }

    return (
      <div className="space-y-2">
        <div
          className={`relative w-full px-3 py-2 text-sm border rounded-lg cursor-pointer transition-colors ${
            isHighlighted
              ? "border-purple-300 bg-purple-50"
              : hoveredField === fieldId
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 bg-white"
          }`}
          onMouseEnter={() => setHoveredField(fieldId)}
          onMouseLeave={() => setHoveredField(null)}
          onClick={(e) => {
            // Handle clicks on inline badges
            const target = e.target.closest(".inline-badge");
            if (target) {
              e.stopPropagation();
              const skill = target.getAttribute("data-skill");
              if (skill) {
                removeSkillFromField(skill);
              }
            }
          }}
        >
          {/* Render text with inline badges */}
          {renderTextWithInlineBadges()}

          {hoveredField === fieldId && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {/* Rephrase badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Rephrase this specific field
                  const currentText = value;
                  const rephrasedText = rephraseWithAI(
                    currentText,
                    fieldId.includes("work-description")
                      ? "work-description"
                      : "default"
                  );
                  if (section && field) {
                    updateResumeData(section, field, rephrasedText, index);
                  }
                }}
                className="w-6 h-6 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                title="AI Rephrase content"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 12 }}
                >
                  auto_fix_high
                </span>
              </button>

              {/* Edit badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFieldEdit(fieldId);
                }}
                className="w-6 h-6 flex items-center justify-center bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                title="Edit this field"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 12 }}
                >
                  edit
                </span>
              </button>
            </div>
          )}
        </div>

        {/* AI Suggestions Badges */}
        {aiSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addSuggestionToField(suggestion)}
                className="group px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs rounded-md transition-colors flex items-center gap-1"
                title={`Add "${suggestion}" to this field`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 10 }}
                >
                  add
                </span>
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Add CSS for inline badges */}
        <style jsx>{`
          .inline-badge {
            background-color: #fef3c7;
            color: #92400e;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #fbbf24;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
          }
          .inline-badge:hover {
            background-color: #fde68a;
            border-color: #f59e0b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .inline-badge:hover::after {
            content: "delete";
            font-family: "Material Symbols Outlined";
            position: absolute;
            top: -10px;
            right: -10px;
            background: white;
            color: #ef4444;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border: 2px solid #ef4444;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20;
          }
        `}</style>
      </div>
    );
  };

  // Original Editable Field Component (for fields that don't need skill badges)
  const EditableField = ({
    fieldId,
    value,
    placeholder,
    type = "text",
    rows = 1,
    section,
    field,
    index = null,
    isHighlighted = false,
  }) => {
    const [hoveredField, setHoveredField] = useState(null);
    const isEditing = editingFields[fieldId];
    const aiSuggestions = getAISuggestions(fieldId, value);

    const handleValueChange = (newValue) => {
      if (section && field) {
        updateResumeData(section, field, newValue, index);
      }
      toggleFieldEdit(fieldId);
    };

    const addSuggestionToField = (suggestion) => {
      let newValue;

      if (fieldId.includes("work-description")) {
        // For work descriptions, add contextual sentence
        const contextualPhrases = {
          Microservices: "Designed and implemented microservices architecture",
          Kubernetes: "Deployed applications using Kubernetes orchestration",
          GraphQL: "Built efficient APIs using GraphQL",
          "CI/CD": "Implemented CI/CD pipelines for automated deployment",
          DevOps: "Applied DevOps practices for streamlined development",
          Docker: "Containerized applications using Docker",
          "AWS Lambda": "Developed serverless functions with AWS Lambda",
        };

        const phrase =
          contextualPhrases[suggestion] ||
          `Worked extensively with ${suggestion}`;
        newValue = value + (value.endsWith(".") ? " " : ". ") + `${phrase}.`;
      } else if (fieldId.includes("work-title")) {
        // For job titles, prepend the suggestion
        newValue = `${suggestion} ${value}`;
      } else {
        // Default behavior
        newValue = value + (value ? ` ${suggestion}` : suggestion);
      }

      if (section && field) {
        updateResumeData(section, field, newValue, index);

        // Track AI-added skill
        setAddedAISkills((prev) => [...prev, suggestion]);
      }
    };

    if (isEditing) {
      if (type === "textarea") {
        return (
          <textarea
            rows={rows}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            autoFocus
            onBlur={(e) => handleValueChange(e.target.value)}
          />
        );
      }
      return (
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          autoFocus
          onBlur={(e) => handleValueChange(e.target.value)}
        />
      );
    }

    return (
      <div className="space-y-2">
        <div
          className={`relative w-full px-3 py-2 text-sm border rounded-lg cursor-pointer transition-colors ${
            isHighlighted
              ? "border-purple-300 bg-purple-50"
              : hoveredField === fieldId
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 bg-white"
          }`}
          onMouseEnter={() => setHoveredField(fieldId)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <span className="text-gray-900">{value}</span>
          {hoveredField === fieldId && (
            <button
              onClick={() => toggleFieldEdit(fieldId)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "16px",
                  fontVariationSettings:
                    '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 16',
                }}
              >
                edit
              </span>
            </button>
          )}
        </div>

        {/* AI Suggestions Badges */}
        {aiSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addSuggestionToField(suggestion)}
                className="group px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs rounded-md transition-colors flex items-center gap-1"
                title={`Add "${suggestion}" to this field`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 10 }}
                >
                  add
                </span>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSectionForm = (sectionId) => {
    const isHighlighted = activeResumeSection === sectionId;

    switch (sectionId) {
      case "personal":
        return (
          <div
            id="section-personal"
            className="mt-3 p-4 bg-white rounded-xl shadow-lg"
          >
            <div className="space-y-3">
              <EditableField
                fieldId="personal-name"
                value={resumeData.personal.name}
                placeholder="Full Name"
                section="personal"
                field="name"
                isHighlighted={isHighlighted}
              />
              <EditableField
                fieldId="personal-email"
                value={resumeData.personal.email}
                placeholder="Email"
                type="email"
                section="personal"
                field="email"
                isHighlighted={isHighlighted}
              />
              <EditableField
                fieldId="personal-phone"
                value={resumeData.personal.phone}
                placeholder="Phone"
                type="tel"
                section="personal"
                field="phone"
                isHighlighted={isHighlighted}
              />
              <EditableField
                fieldId="personal-location"
                value={resumeData.personal.location}
                placeholder="Location"
                section="personal"
                field="location"
                isHighlighted={isHighlighted}
              />
            </div>
          </div>
        );
      case "work":
        return (
          <div id="section-work" className="mt-3 space-y-4">
            {resumeData.work.map((workItem, workIndex) => (
              <div
                key={workItem.id}
                className="p-4 bg-white rounded-xl shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Work Experience {workIndex + 1}
                  </h4>
                  <div className="text-gray-400">
                    <RiArrowUpDownFill size={16} />
                  </div>
                </div>
                <div className="space-y-3">
                  <EditableField
                    fieldId={`work-title-${workIndex}`}
                    value={workItem.title}
                    placeholder="Job Title"
                    section="work"
                    field="title"
                    index={workIndex}
                    isHighlighted={isHighlighted}
                  />
                  <EditableField
                    fieldId={`work-company-${workIndex}`}
                    value={workItem.company}
                    placeholder="Company"
                    section="work"
                    field="company"
                    index={workIndex}
                    isHighlighted={isHighlighted}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <EditableField
                      fieldId={`work-start-${workIndex}`}
                      value={workItem.startDate}
                      placeholder="Start Date"
                      type="month"
                      section="work"
                      field="startDate"
                      index={workIndex}
                      isHighlighted={isHighlighted}
                    />
                    <EditableField
                      fieldId={`work-end-${workIndex}`}
                      value={workItem.endDate}
                      placeholder="End Date"
                      section="work"
                      field="endDate"
                      index={workIndex}
                      isHighlighted={isHighlighted}
                    />
                  </div>
                  <EditableFieldWithBadges
                    fieldId={`work-description-${workIndex}`}
                    value={workItem.description}
                    placeholder="Description"
                    type="textarea"
                    rows={3}
                    section="work"
                    field="description"
                    index={workIndex}
                    isHighlighted={isHighlighted}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case "education":
        return (
          <div
            id="section-education"
            className="mt-3 p-4 bg-white rounded-xl shadow-lg"
          >
            <div className="space-y-3">
              <EditableField
                fieldId="edu-degree"
                value={resumeData.education.degree}
                placeholder="Degree"
                section="education"
                field="degree"
                isHighlighted={isHighlighted}
              />
              <EditableField
                fieldId="edu-institution"
                value={resumeData.education.institution}
                placeholder="Institution"
                section="education"
                field="institution"
                isHighlighted={isHighlighted}
              />
              <div className="grid grid-cols-2 gap-2">
                <EditableField
                  fieldId="edu-start"
                  value={resumeData.education.startYear}
                  placeholder="Start Year"
                  type="number"
                  section="education"
                  field="startYear"
                  isHighlighted={isHighlighted}
                />
                <EditableField
                  fieldId="edu-end"
                  value={resumeData.education.endYear}
                  placeholder="End Year"
                  type="number"
                  section="education"
                  field="endYear"
                  isHighlighted={isHighlighted}
                />
              </div>
              <EditableField
                fieldId="edu-gpa"
                value={resumeData.education.gpa}
                placeholder="GPA (Optional)"
                section="education"
                field="gpa"
                isHighlighted={isHighlighted}
              />
            </div>
          </div>
        );
      case "skills":
        return (
          <div
            id="section-skills"
            className="mt-3 p-4 bg-white rounded-xl shadow-lg"
          >
            <div className="space-y-4">
              {/* Current Resume Skills */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Current Skills
                </h4>
                <div className="space-y-3">
                  {/* Frontend */}
                  <EditableFieldWithBadges
                    fieldId="skills-frontend"
                    value={resumeData.skills.frontend}
                    placeholder="Frontend Skills"
                    section="skills"
                    field="frontend"
                    isHighlighted={isHighlighted}
                  />
                  {/* Backend */}
                  <EditableFieldWithBadges
                    fieldId="skills-backend"
                    value={resumeData.skills.backend}
                    placeholder="Backend Skills"
                    section="skills"
                    field="backend"
                    isHighlighted={isHighlighted}
                  />
                  {/* Database */}
                  <EditableFieldWithBadges
                    fieldId="skills-database"
                    value={resumeData.skills.database}
                    placeholder="Database Skills"
                    section="skills"
                    field="database"
                    isHighlighted={isHighlighted}
                  />
                  {/* Tools */}
                  <EditableFieldWithBadges
                    fieldId="skills-tools"
                    value={resumeData.skills.tools}
                    placeholder="Tools & Technologies"
                    section="skills"
                    field="tools"
                    isHighlighted={isHighlighted}
                  />
                </div>
              </div>

              {/* AI Recommended Skills */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  AI Recommendations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Microservices",
                    "Kubernetes",
                    "GraphQL",
                    "Next.js",
                    "Terraform",
                  ].map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Add skill to appropriate category
                        const newSkills =
                          resumeData.skills.tools + `, ${skill}`;
                        updateResumeData("skills", "tools", newSkills);

                        // Track AI-added skill
                        setAddedAISkills((prev) => [...prev, skill]);
                      }}
                      className="group px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs rounded-md transition-colors flex items-center gap-1"
                      title={`Add ${skill} to your resume`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 12 }}
                      >
                        add
                      </span>
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on job requirements analysis
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <div
        className="flex flex-col md:flex-row w-full"
        style={{ height: "100vh" }}
      >
        {/* First Sidebar - Navigation */}
        <div
          className={`${
            firstSidebarOpen ? "w-52" : "w-16"
          } bg-white transition-all duration-300 flex-shrink-0 h-auto md:h-full hidden md:flex`}
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
                } py-2 text-purple-600 bg-gray-50 rounded-md w-full transition-colors`}
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
        <div className="w-full md:w-1/5 lg:w-[30%] bg-white border-t md:border-t-0 md:border-l border-gray-200 flex-shrink-0 h-1/2 md:h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div
              className="px-4 border-b border-gray-200 flex items-center justify-between"
              style={{ height: "65px" }}
            >
              <h2 className="text-base font-bold text-gray-900">
                AI Resume Optimizer
              </h2>
              <button
                onClick={() => navigate("/manage-jds")}
                className="flex items-center justify-center p-2 text-gray-900 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to JDs"
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
            </div>

            {/* Sections */}
            <Reorder.Group
              axis="y"
              values={sections}
              onReorder={setSections}
              className="flex-1 p-4 space-y-4 overflow-y-auto"
            >
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    className="mb-4"
                    dragListener={false}
                  >
                    {/* Header Section - Always Active */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Icon size={16} />
                        <span>{section.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded">
                          <RiQuestionLine size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded cursor-move">
                          <RiArrowUpDownFill size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-red-600 hover:bg-white p-1 rounded">
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Form Section - Always Visible */}
                    {renderSectionForm(section.id)}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        </div>

        {/* Main Content - Resume Display */}
        <div className="flex-1 w-full md:w-4/5 lg:w-[70%] flex flex-col overflow-hidden h-1/2 md:h-full">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {/* Plain Resume Box */}
              <div
                className="bg-white rounded-lg p-12 min-h-[11in] shadow-sm"
                style={{ width: "8.5in" }}
              >
                {/* Render sections in the order defined by sidebar */}
                {sections.map((section) => renderResumeSection(section))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <span
                  className="material-symbols-outlined text-purple-600"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  auto_awesome
                </span>
                <span className="text-gray-900 font-medium">AI Interview</span>
              </button>
              <button
                onClick={() => {
                  navigate("/manage-jds");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  description
                </span>
                <span className="text-gray-900 font-medium">Manage JDs</span>
              </button>
              <button
                onClick={() => {
                  navigate("/manage-resume");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  content_copy
                </span>
                <span className="text-gray-900 font-medium">Manage Resume</span>
              </button>
              <button
                onClick={() => {
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-purple-50 text-left"
              >
                <span
                  className="material-symbols-outlined text-purple-600"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  edit_document
                </span>
                <span className="text-gray-900 font-medium">
                  AI Resume Optimizer (Current)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
