import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Reorder, useDragControls } from "framer-motion";
import {
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiUserLine,
  RiDeleteBinLine,
  RiArrowUpDownFill,
} from "@remixicon/react";
import Sidebar from "./Sidebar";
import AISidebar from "./AISidebar";
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
  const [collapsedSections, setCollapsedSections] = useState(new Set()); // Track collapsed sections
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
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        institution: "Stanford University",
        startYear: "2015",
        endYear: "2019",
        gpa: "3.8/4.0",
      },
    ],
    skills: {
      frontend: "React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS",
      backend: "Node.js, Express.js, Python, Django, RESTful APIs",
      database: "MongoDB, PostgreSQL, MySQL, Redis",
      tools: "Git, Docker, AWS, CI/CD, Agile/Scrum",
    },
  });

  // Track AI-suggested skills that have been added
  const [addedAISkills, setAddedAISkills] = useState([]);
  // Track field-specific AI additions with their exact text and position
  const [fieldAIAdditions, setFieldAIAdditions] = useState({});
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
        // Handle array sections like work experience and education
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

  // Handler to add new entry to a section
  const handleAddEntry = (sectionId) => {
    setResumeData((prev) => {
      if (sectionId === "work") {
        // Add new work experience entry
        const maxId =
          prev.work.length > 0 ? Math.max(...prev.work.map((w) => w.id)) : 0;
        const newWorkEntry = {
          id: maxId + 1,
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        };
        return {
          ...prev,
          work: [...prev.work, newWorkEntry],
        };
      } else if (sectionId === "education") {
        // Add new education entry
        const maxId =
          prev.education.length > 0
            ? Math.max(...prev.education.map((e) => e.id))
            : 0;
        const newEducationEntry = {
          id: maxId + 1,
          degree: "",
          institution: "",
          startYear: "",
          endYear: "",
          gpa: "",
        };
        return {
          ...prev,
          education: [...prev.education, newEducationEntry],
        };
      }
      // For other sections (personal, skills), don't add duplicates
      return prev;
    });
  };

  // Handler to reorder work experience items
  const handleReorderWork = (newOrder) => {
    setResumeData((prev) => ({
      ...prev,
      work: newOrder,
    }));
  };

  // Handler to delete work experience item
  const handleDeleteWork = (workId) => {
    setResumeData((prev) => ({
      ...prev,
      work: prev.work.filter((item) => item.id !== workId),
    }));
  };

  // Handler to reorder education items
  const handleReorderEducation = (newOrder) => {
    setResumeData((prev) => ({
      ...prev,
      education: newOrder,
    }));
  };

  // Handler to delete education item
  const handleDeleteEducation = (eduId) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== eduId),
    }));
  };

  // Handler to toggle section collapse
  const handleToggleCollapse = (sectionId) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
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
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                {resumeData.personal.name}
              </h1>
              <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
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
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                WORK EXPERIENCE
              </h2>
              {resumeData.work.map((workItem) => (
                <div key={workItem.id} className="mb-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        {workItem.title}
                      </h3>
                      <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>{workItem.company}</p>
                    </div>
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      {workItem.startDate} - {workItem.endDate}
                    </p>
                  </div>
                  <div className="relative">
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>{workItem.description}</p>
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
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                EDUCATION
              </h2>
              {resumeData.education.map((eduItem) => (
                <div key={eduItem.id} className="mb-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="relative">
                        <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                          {eduItem.degree}
                        </h3>
                      </div>
                      <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>{eduItem.institution}</p>
                    </div>
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      {eduItem.startYear} - {eduItem.endYear}
                    </p>
                  </div>
                  {eduItem.gpa && (
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>GPA: {eduItem.gpa}</p>
                  )}
                </div>
              ))}
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
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                TECHNICAL SKILLS
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                    Frontend:
                  </h4>
                  <div className="relative">
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      {resumeData.skills.frontend}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>Backend:</h4>
                  <div className="relative">
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>{resumeData.skills.backend}</p>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                    Database:
                  </h4>
                  <div className="relative">
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      {resumeData.skills.database}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>Tools:</h4>
                  <div className="relative">
                    <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>{resumeData.skills.tools}</p>
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
            <div className="absolute top-2 right-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white px-3 py-[5px] text-[13px] rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold leading-[1.2] whitespace-nowrap z-10">
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
            <div className="absolute top-2 right-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white px-3 py-[5px] text-[13px] rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold leading-[1.2] whitespace-nowrap z-30">
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
    hideAISuggestions = false,
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
      let addedText = suggestion; // Track the exact text that was added

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
        addedText = phrase;
        newValue = value + (value.endsWith(".") ? " " : ". ") + `${phrase}.`;
      } else if (fieldId.includes("work-title")) {
        // For job titles, prepend the suggestion
        addedText = suggestion;
        newValue = `${suggestion} ${value}`;
      } else {
        // Default behavior
        addedText = suggestion;
        newValue = value + (value ? `, ${suggestion}` : suggestion);
      }

      if (section && field) {
        updateResumeData(section, field, newValue, index);

        // Track AI-added skill globally
        setAddedAISkills((prev) => [...prev, suggestion]);

        // Track field-specific AI addition
        setFieldAIAdditions((prev) => ({
          ...prev,
          [fieldId]: [
            ...(prev[fieldId] || []),
            { text: addedText, suggestion },
          ],
        }));
      }
    };

    const removeSkillFromField = (skillToRemove) => {
      removeSkillFromText(value, skillToRemove, section, field, index);

      // Also remove from field-specific tracking
      setFieldAIAdditions((prev) => ({
        ...prev,
        [fieldId]: (prev[fieldId] || []).filter(
          (addition) => addition.suggestion !== skillToRemove
        ),
      }));
    };

    // Function to render text with AI-added portions as badges
    const renderTextWithInlineBadges = () => {
      const fieldAdditions = fieldAIAdditions[fieldId] || [];

      if (!value || fieldAdditions.length === 0) {
        return (
          <span className="text-gray-900">
            {value || (
              <span className="text-gray-400 italic">{placeholder}</span>
            )}
          </span>
        );
      }

      let processedText = value;
      const badges = [];

      // Find all AI-added text in the current field value
      fieldAdditions.forEach((addition) => {
        const { text, suggestion } = addition;

        // Escape special regex characters
        const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\b${escapedText}\\b`, "gi");
        const matches = [...processedText.matchAll(regex)];

        matches.forEach((match) => {
          badges.push({
            skill: suggestion,
            phrase: match[0],
            start: match.index,
            end: match.index + match[0].length,
          });
        });
      });

      // Sort badges by position (reverse order for replacement)
      badges.sort((a, b) => b.start - a.start);

      // Replace text with badge elements
      badges.forEach(({ skill, phrase, start, end }) => {
        const beforeText = processedText.substring(0, start);
        const afterText = processedText.substring(end);

        const badgeHtml = `<button class="inline-badge" data-skill="${skill}" data-phrase="${phrase}">${phrase}</button>`;
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
            className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
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
          className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
          autoFocus
          onBlur={(e) => handleValueChange(e.target.value)}
        />
      );
    }

    return (
      <div className="space-y-2">
        <div
          className={`relative w-full px-3 py-2 text-sm border rounded-lg cursor-pointer transition-colors min-h-[2.5rem] ${
            isHighlighted
              ? "border-purple-300 bg-purple-50"
              : hoveredField === fieldId
              ? "border-gray-300 bg-[#F5F5F5]"
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
            <div
              className={`absolute right-2 flex gap-1 ${
                type === "textarea" ? "bottom-2" : "top-1/2 -translate-y-1/2"
              }`}
            >
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
                className="w-8 h-8 flex items-center justify-center bg-[#f59e0b] text-white rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all hover:opacity-90"
                title="AI Rephrase content"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
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
                className="w-8 h-8 flex items-center justify-center bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:opacity-90"
                title="Edit this field"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                >
                  edit
                </span>
              </button>
            </div>
          )}
        </div>

        {/* AI Suggestions Badges */}
        {!hideAISuggestions && aiSuggestions.length > 0 && (
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
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            gap: 2px;
          }
          .inline-badge:hover {
            background-color: #fde68a;
            border-color: #f59e0b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .inline-badge:hover::after {
            content: "close";
            font-family: "Material Symbols Outlined";
            position: absolute;
            top: -8px;
            right: -8px;
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
      let addedText = suggestion; // Track the exact text that was added

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
        addedText = phrase;
        newValue = value + (value.endsWith(".") ? " " : ". ") + `${phrase}.`;
      } else if (fieldId.includes("work-title")) {
        // For job titles, prepend the suggestion
        addedText = suggestion;
        newValue = `${suggestion} ${value}`;
      } else {
        // Default behavior
        addedText = suggestion;
        newValue = value + (value ? ` ${suggestion}` : suggestion);
      }

      if (section && field) {
        updateResumeData(section, field, newValue, index);

        // Track AI-added skill globally
        setAddedAISkills((prev) => [...prev, suggestion]);

        // Track field-specific AI addition
        setFieldAIAdditions((prev) => ({
          ...prev,
          [fieldId]: [
            ...(prev[fieldId] || []),
            { text: addedText, suggestion },
          ],
        }));
      }
    };

    if (isEditing) {
      if (type === "textarea") {
        return (
          <textarea
            rows={rows}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
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
          className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
          autoFocus
          onBlur={(e) => handleValueChange(e.target.value)}
        />
      );
    }

    return (
      <div className="space-y-2">
        <div
          className={`relative w-full px-3 py-2 text-sm border rounded-lg cursor-pointer transition-colors min-h-[2.5rem] ${
            isHighlighted
              ? "border-purple-300 bg-purple-50"
              : hoveredField === fieldId
              ? "border-gray-300 bg-[#F5F5F5]"
              : "border-gray-300 bg-white"
          }`}
          onMouseEnter={() => setHoveredField(fieldId)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <span className="text-gray-900">
            {value || (
              <span className="text-gray-400 italic">{placeholder}</span>
            )}
          </span>
          {hoveredField === fieldId && (
            <button
              onClick={() => toggleFieldEdit(fieldId)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:opacity-90"
              title="Edit this field"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
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

  // Work Item Component for Draggable Work Experience
  const WorkItem = ({ workItem, workIndex, isHighlighted }) => {
    const dragControls = useDragControls();
    const isEmpty =
      !workItem.title && !workItem.company && !workItem.description;

    return (
      <Reorder.Item
        key={workItem.id}
        value={workItem}
        className="mb-4"
        dragListener={false}
        dragControls={dragControls}
        layout
      >
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              Work Experience {workIndex + 1}
            </h4>
            <div className="flex items-center gap-2">
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-grab"
                onPointerDown={(e) => {
                  e.preventDefault();
                  dragControls.start(e);
                }}
                title="Drag to reorder"
              >
                <RiArrowUpDownFill size={16} />
              </button>
              <button
                onClick={() => handleDeleteWork(workItem.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete this work experience"
              >
                <RiDeleteBinLine size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <EditableFieldWithBadges
              fieldId={`work-title-${workIndex}`}
              value={workItem.title}
              placeholder="Job Title"
              section="work"
              field="title"
              index={workIndex}
              isHighlighted={isHighlighted}
              hideAISuggestions={isEmpty}
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
              hideAISuggestions={isEmpty}
            />
          </div>
        </div>
      </Reorder.Item>
    );
  };

  // Education Item Component for Draggable Education
  const EducationItem = ({ eduItem, eduIndex, isHighlighted }) => {
    const dragControls = useDragControls();

    return (
      <Reorder.Item
        key={eduItem.id}
        value={eduItem}
        className="mb-4"
        dragListener={false}
        dragControls={dragControls}
        layout
      >
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              Education {eduIndex + 1}
            </h4>
            <div className="flex items-center gap-2">
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-grab"
                onPointerDown={(e) => {
                  e.preventDefault();
                  dragControls.start(e);
                }}
                title="Drag to reorder"
              >
                <RiArrowUpDownFill size={16} />
              </button>
              <button
                onClick={() => handleDeleteEducation(eduItem.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete this education entry"
              >
                <RiDeleteBinLine size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <EditableField
              fieldId={`edu-degree-${eduIndex}`}
              value={eduItem.degree}
              placeholder="Degree"
              section="education"
              field="degree"
              index={eduIndex}
              isHighlighted={isHighlighted}
            />
            <EditableField
              fieldId={`edu-institution-${eduIndex}`}
              value={eduItem.institution}
              placeholder="Institution"
              section="education"
              field="institution"
              index={eduIndex}
              isHighlighted={isHighlighted}
            />
            <div className="grid grid-cols-2 gap-2">
              <EditableField
                fieldId={`edu-start-${eduIndex}`}
                value={eduItem.startYear}
                placeholder="Start Year"
                type="number"
                section="education"
                field="startYear"
                index={eduIndex}
                isHighlighted={isHighlighted}
              />
              <EditableField
                fieldId={`edu-end-${eduIndex}`}
                value={eduItem.endYear}
                placeholder="End Year"
                type="number"
                section="education"
                field="endYear"
                index={eduIndex}
                isHighlighted={isHighlighted}
              />
            </div>
            <EditableField
              fieldId={`edu-gpa-${eduIndex}`}
              value={eduItem.gpa}
              placeholder="GPA (Optional)"
              section="education"
              field="gpa"
              index={eduIndex}
              isHighlighted={isHighlighted}
            />
          </div>
        </div>
      </Reorder.Item>
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
            <Reorder.Group
              axis="y"
              values={resumeData.work}
              onReorder={handleReorderWork}
              className="space-y-4"
              layout
            >
              {resumeData.work.map((workItem, workIndex) => (
                <WorkItem
                  key={workItem.id}
                  workItem={workItem}
                  workIndex={workIndex}
                  isHighlighted={isHighlighted}
                />
              ))}
            </Reorder.Group>
          </div>
        );
      case "education":
        return (
          <div id="section-education" className="mt-3 space-y-4">
            <Reorder.Group
              axis="y"
              values={resumeData.education}
              onReorder={handleReorderEducation}
              className="space-y-4"
              layout
            >
              {resumeData.education.map((eduItem, eduIndex) => (
                <EducationItem
                  key={eduItem.id}
                  eduItem={eduItem}
                  eduIndex={eduIndex}
                  isHighlighted={isHighlighted}
                />
              ))}
            </Reorder.Group>
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
                <h4 className="text-sm font-medium text-gray-900 mb-2">
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
        <div className="hidden md:flex">
          <Sidebar activeItem="get-vetted" />
        </div>

        {/* Second Sidebar - Resume Sections */}
        <AISidebar
          sections={sections}
          setSections={setSections}
          resumeData={resumeData}
          editingFields={editingFields}
          toggleFieldEdit={toggleFieldEdit}
          updateResumeData={updateResumeData}
          activeResumeSection={activeResumeSection}
          collapsedSections={collapsedSections}
          handleToggleCollapse={handleToggleCollapse}
          handleAddEntry={handleAddEntry}
          renderSectionForm={renderSectionForm}
        />

        {/* Main Content - Resume Display */}
        <div className="flex-1 w-full md:w-4/5 lg:w-[70%] flex flex-col overflow-hidden h-1/2 md:h-full">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {/* Plain Resume Box */}
              <div
                className="bg-white rounded-lg p-12 min-h-[11in] shadow-sm"
                style={{ width: "8.5in", fontFamily: 'Open Sans', color: '#1A1A1A' }}
              >
                {/* Render sections in the order defined by sidebar */}
                {sections.map((section) => renderResumeSection(section))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
