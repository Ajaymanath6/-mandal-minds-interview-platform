import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reorder, useDragControls } from "framer-motion";
import {
  RiDeleteBinLine,
  RiQuestionLine,
  RiArrowUpDownFill,
} from "@remixicon/react";
import { DocumentPdf, Document, CircleDash } from "@carbon/icons-react";
import AISidebar from "./AISidebar";
import "material-symbols/outlined.css";

export default function SummaryEdit({
  fileType,
  activeTab,
  setActiveTab,
  sections,
  setSections,
  resumeData,
  editingFields,
  toggleFieldEdit,
  updateResumeData,
  handleAddEntry,
  handleDeleteWork,
  activeResumeSection,
}) {
  const navigate = useNavigate();
  const [matchScore, setMatchScore] = useState(null);
  const [initialScore, setInitialScore] = useState(null); // Store initial score when entering AI Resume tab
  
  // AI-related state for tracking suggestions and additions
  const [_addedAISkills, setAddedAISkills] = useState([]); // Track AI-added skills (for future use)
  const [fieldAIAdditions, setFieldAIAdditions] = useState({});
  const [jdText, setJdText] = useState(""); // Store JD text for AI analysis
  
  // Calculate current match score based on resume data and JD
  // This recalculates whenever resumeData or jdText changes
  const calculateCurrentScore = () => {
    if (!jdText || !jdText.trim() || !matchScore) return matchScore;
    
    // Simple scoring algorithm based on keyword matches
    const jdLower = jdText.toLowerCase();
    let matchedKeywords = 0;
    
    // Keywords to look for
    const keywords = [
      "microservices", "kubernetes", "graphql", "ci/cd", "devops", "docker",
      "aws lambda", "next.js", "terraform", "typescript", "python", "react",
      "node.js", "mongodb", "postgresql", "redis", "aws", "azure", "gcp"
    ];
    
    // Check resume content for keywords
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    keywords.forEach(keyword => {
      if (jdLower.includes(keyword) && resumeText.includes(keyword)) {
        matchedKeywords++;
      }
    });
    
    // Base score from initial match, plus improvement from added keywords
    const baseScore = matchScore || 60;
    const improvement = (matchedKeywords / keywords.length) * 40; // Up to 40% improvement
    const calculatedScore = Math.min(100, Math.floor(baseScore + improvement));
    
    return calculatedScore;
  };
  
  // Recalculate score when resumeData or jdText changes
  const currentScore = calculateCurrentScore();
  const scoreChange = initialScore !== null && currentScore !== null ? currentScore - initialScore : 0;
  
  // Track initial score when entering AI Resume tab
  useEffect(() => {
    if (activeTab === "ai-resume" && matchScore !== null && initialScore === null) {
      setInitialScore(matchScore);
    }
    if (activeTab !== "ai-resume") {
      setInitialScore(null);
    }
  }, [activeTab, matchScore, initialScore]);
  
  // Get score color and title
  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // green
    if (score >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };
  
  const getScoreTitle = (score) => {
    if (score >= 80) return "Strong Match!";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  // Editable Field Component
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

    const handleValueChange = (newValue) => {
      if (section && field) {
        updateResumeData(section, field, newValue, index);
      }
      toggleFieldEdit(fieldId);
    };

    if (isEditing) {
      if (type === "textarea") {
        return (
          <textarea
            rows={rows}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
            style={{ fontFamily: 'IBM Plex Sans' }}
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
          style={{ fontFamily: 'IBM Plex Sans' }}
          autoFocus
          onBlur={(e) => handleValueChange(e.target.value)}
        />
      );
    }

    return (
      <div
        className={`relative w-full px-3 py-2 text-sm border rounded-lg cursor-pointer transition-colors min-h-[2.5rem] flex items-center ${
          isHighlighted
            ? "border-purple-300 bg-purple-50"
            : hoveredField === fieldId
            ? "border-gray-300 bg-[#F5F5F5]"
            : "border-gray-300 bg-white"
        }`}
        onMouseEnter={() => setHoveredField(fieldId)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <span style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>{value}</span>
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
    );
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

  // AI rephrasing function
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

  // AI Skill Suggestions based on field content and JD (matching AIResume.jsx logic)
  const getAISuggestions = (fieldId, currentValue) => {
    // Determine field type more accurately
    let fieldType = fieldId;
    if (fieldId.includes("work-description")) {
      fieldType = "work-description";
    } else if (fieldId.includes("work-title")) {
      fieldType = "work-title";
    } else if (fieldId.includes("work-company")) {
      fieldType = "work-company";
    } else if (fieldId.includes("skills")) {
      fieldType = "skills";
    } else if (fieldId.includes("edu-degree")) {
      fieldType = "edu-degree";
    }

    // Default suggestions based on field type (like AIResume.jsx)
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
      "edu-degree": ["Machine Learning", "Data Science", "Computer Science"],
      "skills": [
        "Microservices",
        "Kubernetes",
        "GraphQL",
        "CI/CD",
        "DevOps",
        "Docker",
        "AWS Lambda",
        "Next.js",
        "Terraform",
        "TypeScript",
      ],
    };

    let requiredSkills = jdRequiredSkills[fieldType] || [];

    // If JD text exists, analyze it and extract skills
    if (jdText && jdText.trim()) {
      const jdLower = jdText.toLowerCase();
      
      // Extended list of skills to look for in JD
      const allSkills = [
        "Microservices",
        "Kubernetes",
        "GraphQL",
        "CI/CD",
        "DevOps",
        "Docker",
        "AWS Lambda",
        "Next.js",
        "Terraform",
        "TypeScript",
        "Python",
        "React",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "AWS",
        "Azure",
        "GCP",
        "Senior",
        "Lead",
        "Principal",
        "Machine Learning",
        "Data Science",
        "Computer Science",
      ];

      // Get skills mentioned in JD
      const jdMentionedSkills = allSkills.filter((skill) =>
        jdLower.includes(skill.toLowerCase())
      );

      // For work descriptions, prioritize technical skills from JD
      if (fieldType === "work-description") {
        const workDescSkills = [
          "Microservices",
          "Kubernetes",
          "GraphQL",
          "CI/CD",
          "DevOps",
          "Docker",
          "AWS Lambda",
        ];
        requiredSkills = workDescSkills.filter((skill) =>
          jdLower.includes(skill.toLowerCase())
        );
        // If no JD skills found, use defaults
        if (requiredSkills.length === 0) {
          requiredSkills = workDescSkills;
        }
      } else if (fieldType === "work-title") {
        const titleSkills = ["Senior", "Lead", "Principal"];
        requiredSkills = titleSkills.filter((skill) =>
          jdLower.includes(skill.toLowerCase())
        );
        if (requiredSkills.length === 0) {
          requiredSkills = titleSkills;
        }
      } else if (fieldType === "skills") {
        // For skills section, use all JD mentioned skills
        requiredSkills = jdMentionedSkills.length > 0 ? jdMentionedSkills : requiredSkills;
      } else {
        // For other fields, use JD mentioned skills if available
        requiredSkills = jdMentionedSkills.length > 0 ? jdMentionedSkills : requiredSkills;
      }
    }

    // Check which skills are missing from current text
    const currentText = (currentValue || "").toLowerCase();
    const missingSkills = requiredSkills.filter(
      (skill) => !currentText.includes(skill.toLowerCase())
    );

    // Always return top 3 suggestions (or all if less than 3)
    // If no missing skills but we have required skills, still show them (user might want to add emphasis)
    if (missingSkills.length === 0 && requiredSkills.length > 0) {
      // Return first 3 required skills even if they're in the text (for emphasis/context)
      return requiredSkills.slice(0, 3);
    }
    
    return missingSkills.slice(0, 3);
  };

  // Enhanced Editable Field Component with inline text badges and AI features
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
          <span style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
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
          style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}
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
            style={{ fontFamily: 'IBM Plex Sans' }}
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
          style={{ fontFamily: 'IBM Plex Sans' }}
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

        {/* AI Suggestions Badges - Always visible when suggestions exist */}
        {!hideAISuggestions && aiSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {aiSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => addSuggestionToField(suggestion)}
                className="group px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs rounded-md transition-colors flex items-center gap-1 font-medium shadow-sm"
                title={`Add "${suggestion}" to this field`}
                style={{ fontFamily: 'IBM Plex Sans' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 12, fontWeight: 'bold' }}
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

  // Section Item Component (needed for useDragControls hook)
  const SectionItem = ({ section, renderSectionForm }) => {
    const Icon = section.icon;
    const dragControls = useDragControls();

    return (
      <Reorder.Item
        key={section.id}
        value={section}
        className="mb-4"
        dragListener={false}
        dragControls={dragControls}
      >
        {/* Header Section - Always Active */}
        <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: '#F5F5F5', color: '#1A1A1A' }}>
          <div className="flex items-center space-x-3">
            <Icon size={16} style={{ color: '#575757' }} />
            <span style={{ fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.03em' }}>{section.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded">
              <RiQuestionLine size={16} style={{ color: '#575757' }} />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded cursor-move"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <RiArrowUpDownFill size={16} style={{ color: '#575757' }} />
            </button>
            <button className="text-gray-500 hover:text-red-600 hover:bg-white p-1 rounded">
              <RiDeleteBinLine size={16} style={{ color: '#575757' }} />
            </button>
          </div>
        </div>

        {/* Form Section - Always Visible */}
        {renderSectionForm(section.id)}
      </Reorder.Item>
    );
  };

  // Compare Resume Content Component
  const CompareResumeContent = ({ setMatchScore: setMatchScoreProp }) => {
    const [localJdText, setLocalJdText] = useState(jdText || "");
    const [isScanning, setIsScanning] = useState(false);
    const updateMatchScore = setMatchScoreProp || setMatchScore;

    const handleTextChange = (e) => {
      const text = e.target.value;
      setLocalJdText(text);
      setJdText(text); // Update parent state for AI analysis
      // Reset match score if text is cleared
      if (!text.trim()) {
        updateMatchScore(null);
        setIsScanning(false);
      }
    };

    const handleKeyDown = (e) => {
      // When Enter is pressed (without Shift), trigger comparison
      if (e.key === 'Enter' && !e.shiftKey && localJdText.trim() && !isScanning && (matchScore === null || !matchScore)) {
        e.preventDefault();
        startScanning();
      }
    };

    const startScanning = () => {
      if (!localJdText.trim() || isScanning) return;
      
      setIsScanning(true);
      updateMatchScore(null);

      // Simulate scanning process (10 seconds)
      setTimeout(() => {
        // Calculate match score (dummy calculation)
        const calculatedScore = Math.floor(60 + Math.random() * 30); // 60-90%
        updateMatchScore(calculatedScore);
        setIsScanning(false);
      }, 10000);
    };

    const getMatchTitle = (score) => {
      if (score >= 80) return "You're a Strong Candidate!";
      if (score >= 60) return "A Promising Match!";
      return "Room for Improvement";
    };

    const getMatchColor = (score) => {
      if (score >= 80) return "#10b981"; // green
      if (score >= 60) return "#f59e0b"; // amber
      return "#ef4444"; // red
    };

    return (
      <div className="p-4 space-y-4">
        {/* Job Description Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: '#F5F5F5', color: '#1A1A1A' }}>
            <div className="flex items-center space-x-3">
              <span style={{ fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.03em' }}>Job Description (JD)</span>
            </div>
          </div>
          <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: '#fcfcfb', border: 'none', boxShadow: 'none' }}>
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={localJdText}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste or upload Job Description here to compare with your resume..."
                  rows={8}
                  className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border rounded-lg focus:outline-none focus:border-[#a854ff] transition-all placeholder:text-[#80868b]"
                  style={{ 
                    fontFamily: 'IBM Plex Sans', 
                    borderColor: '#E5E5E5', 
                    backgroundColor: '#ffffff',
                    opacity: isScanning ? 0.5 : 1
                  }}
                  disabled={isScanning}
                />
                {/* Spinner overlay on textarea - CircleDash icon only */}
                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <CircleDash size={32} className="animate-spin mb-3" style={{ color: '#7c00ff' }} />
                    <p style={{ 
                      fontFamily: 'IBM Plex Sans', 
                      fontSize: '10px', 
                      color: '#575757',
                      textAlign: 'center'
                    }}>
                      Scanning resume against JD
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Section - Show below textarea after scanning completes */}
        {matchScore !== null && !isScanning && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: '#F5F5F5', color: '#1A1A1A' }}>
              <div className="flex items-center space-x-3">
                <span style={{ fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.03em' }}>Overall Match Score</span>
              </div>
            </div>
            <div className="mt-3 p-4 bg-white rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Circular Progress */}
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#F5F5F5"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={getMatchColor(matchScore)}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - matchScore / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: getMatchColor(matchScore), fontFamily: 'IBM Plex Sans' }}>
                        {matchScore}%
                      </div>
                      <div className="text-xs" style={{ color: '#575757', fontFamily: 'IBM Plex Sans' }}>
                        Match
                      </div>
                    </div>
                  </div>
                </div>
                {/* Qualitative Title */}
                <h3 className="text-lg font-semibold text-center" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                  {getMatchTitle(matchScore)}
                </h3>
                {/* Smart Edit Resume Button */}
                <button
                  onClick={() => setActiveTab("ai-resume")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:opacity-90"
                  style={{ fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: '14px', marginTop: '16px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    auto_fix_high
                  </span>
                  Smart Edit Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Summarise Resume Content Component
  const SummariseResumeContent = ({ resumeData }) => {
    const summaryText = `Results-driven ${resumeData.work[0]?.title || 'professional'} with ${resumeData.work.length || 1}+ years of experience in React and Node.js. Proven ability to ${resumeData.work[0]?.description?.split('.')[0] || 'lead development of scalable web applications'}, seeking to leverage expertise in full-stack development to contribute to a dynamic team.`;

    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
            Resume Summary
          </h3>
          <div className="space-y-4">
            {/* Professional Summary Section */}
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>Professional Summary:</h4>
              <p style={{ color: '#1A1A1A', lineHeight: '1.6', fontFamily: 'IBM Plex Sans' }}>
                {summaryText}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>Education:</h4>
              <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                {resumeData.education.degree} from {resumeData.education.institution} ({resumeData.education.startYear} - {resumeData.education.endYear})
                {resumeData.education.gpa && `, GPA: ${resumeData.education.gpa}`}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>Key Skills:</h4>
              <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                React, Node.js, TypeScript, MongoDB, PostgreSQL, AWS, Docker
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>Contact Information:</h4>
              <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                {resumeData.personal.email} | {resumeData.personal.phone} | {resumeData.personal.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Use handleAddEntry from props, or provide a default no-op function
  const addEntryHandler = handleAddEntry || (() => {});

  const renderSectionForm = (sectionId, useAI = false) => {
    const isHighlighted = activeResumeSection === sectionId;
    const FieldComponent = useAI ? EditableFieldWithBadges : EditableField;

    switch (sectionId) {
      case "personal":
        return (
          <div
            id="section-personal"
            className="mt-3 p-4 bg-white rounded-xl shadow-lg"
          >
            <div className="space-y-3">
              <FieldComponent
                fieldId="personal-name"
                value={resumeData.personal.name}
                placeholder="Full Name"
                section="personal"
                field="name"
                isHighlighted={isHighlighted}
              />
              <FieldComponent
                fieldId="personal-email"
                value={resumeData.personal.email}
                placeholder="Email"
                type="email"
                section="personal"
                field="email"
                isHighlighted={isHighlighted}
              />
              <FieldComponent
                fieldId="personal-phone"
                value={resumeData.personal.phone}
                placeholder="Phone"
                type="tel"
                section="personal"
                field="phone"
                isHighlighted={isHighlighted}
              />
              <FieldComponent
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
            {resumeData.work.map((workItem, workIndex) => {
              return (
                <div
                  key={workItem.id}
                  className="p-4 bg-white rounded-xl shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                      Work Experience {workIndex + 1}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteWork && handleDeleteWork(workItem.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete this work experience"
                      >
                        <RiDeleteBinLine size={16} style={{ color: '#575757' }} />
                      </button>
                      <div className="text-gray-400">
                        <RiArrowUpDownFill size={16} style={{ color: '#575757' }} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <FieldComponent
                      fieldId={`work-title-${workIndex}`}
                      value={workItem.title}
                      placeholder="Job Title"
                      section="work"
                      field="title"
                      index={workIndex}
                      isHighlighted={isHighlighted}
                    />
                    <FieldComponent
                      fieldId={`work-company-${workIndex}`}
                      value={workItem.company}
                      placeholder="Company"
                      section="work"
                      field="company"
                      index={workIndex}
                      isHighlighted={isHighlighted}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FieldComponent
                        fieldId={`work-start-${workIndex}`}
                        value={workItem.startDate}
                        placeholder="Start Date"
                        type="month"
                        section="work"
                        field="startDate"
                        index={workIndex}
                        isHighlighted={isHighlighted}
                      />
                      <FieldComponent
                        fieldId={`work-end-${workIndex}`}
                        value={workItem.endDate}
                        placeholder="End Date"
                        section="work"
                        field="endDate"
                        index={workIndex}
                        isHighlighted={isHighlighted}
                      />
                    </div>
                    <FieldComponent
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
              );
            })}
          </div>
        );
      case "education":
        return (
          <div
            id="section-education"
            className="mt-3 p-4 bg-white rounded-xl shadow-lg"
          >
            <div className="space-y-3">
              <FieldComponent
                fieldId="edu-degree"
                value={resumeData.education.degree}
                placeholder="Degree"
                section="education"
                field="degree"
                isHighlighted={isHighlighted}
              />
              <FieldComponent
                fieldId="edu-institution"
                value={resumeData.education.institution}
                placeholder="Institution"
                section="education"
                field="institution"
                isHighlighted={isHighlighted}
              />
              <div className="grid grid-cols-2 gap-2">
                <FieldComponent
                  fieldId="edu-start"
                  value={resumeData.education.startYear}
                  placeholder="Start Year"
                  type="number"
                  section="education"
                  field="startYear"
                  isHighlighted={isHighlighted}
                />
                <FieldComponent
                  fieldId="edu-end"
                  value={resumeData.education.endYear}
                  placeholder="End Year"
                  type="number"
                  section="education"
                  field="endYear"
                  isHighlighted={isHighlighted}
                />
              </div>
              <FieldComponent
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
        // Only show skills section if resumeData has skills
        if (!resumeData.skills) return null;
        return (
          <div
            id="section-skills"
            className="mt-3 p-4 bg-white rounded-xl shadow-lg"
          >
            <div className="space-y-4">
              {/* Current Resume Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                  Current Skills
                </h4>
                <div className="space-y-3">
                  {/* Frontend */}
                  {resumeData.skills.frontend && (
                    <FieldComponent
                      fieldId="skills-frontend"
                      value={resumeData.skills.frontend}
                      placeholder="Frontend Skills"
                      section="skills"
                      field="frontend"
                      isHighlighted={isHighlighted}
                    />
                  )}
                  {/* Backend */}
                  {resumeData.skills.backend && (
                    <FieldComponent
                      fieldId="skills-backend"
                      value={resumeData.skills.backend}
                      placeholder="Backend Skills"
                      section="skills"
                      field="backend"
                      isHighlighted={isHighlighted}
                    />
                  )}
                  {/* Database */}
                  {resumeData.skills.database && (
                    <FieldComponent
                      fieldId="skills-database"
                      value={resumeData.skills.database}
                      placeholder="Database Skills"
                      section="skills"
                      field="database"
                      isHighlighted={isHighlighted}
                    />
                  )}
                  {/* Tools */}
                  {resumeData.skills.tools && (
                    <FieldComponent
                      fieldId="skills-tools"
                      value={resumeData.skills.tools}
                      placeholder="Tools & Technologies"
                      section="skills"
                      field="tools"
                      isHighlighted={isHighlighted}
                    />
                  )}
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
    <div className="w-full md:w-1/5 lg:w-[30%] bg-white flex-shrink-0 h-1/2 md:h-full" style={{ minWidth: '320px' }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className="px-4 border-b border-gray-200 flex items-center justify-between"
          style={{ height: "65px" }}
        >
          <div className="flex items-center gap-2">
            {fileType === 'pdf' ? (
              <DocumentPdf size={20} style={{ color: '#575757' }} />
            ) : (
              <Document size={20} style={{ color: '#575757' }} />
            )}
            <h2 className="text-base font-bold" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
              {fileType === 'pdf' ? 'PDF View' : 'Word Document'}
            </h2>
          </div>
          <button
            onClick={() => navigate("/manage-resume")}
            className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5]"
            title="Back to Resume List"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "20px",
                color: "#575757",
                fontVariationSettings:
                  '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20',
              }}
            >
              arrow_back
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-4 pb-4">
          <div className="flex gap-2 overflow-x-auto" style={{ minWidth: 0, flexWrap: 'nowrap' }}>
            <button
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SummaryEdit.jsx:414',message:'Tab button clicked',data:{tab:'edit-resume',currentTab:activeTab},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
                setActiveTab("edit-resume");
              }}
              className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium flex-shrink-0"
              style={{
                padding: "4px 6px",
                borderRadius: "10px",
                fontFamily: "IBM Plex Sans",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.03em",
                color: "#1A1A1A",
                backgroundColor: activeTab === "edit-resume" ? "#F5F5F5" : "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Edit Resume
            </button>
            <button
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SummaryEdit.jsx:432',message:'Tab button clicked',data:{tab:'summarise',currentTab:activeTab},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
                setActiveTab("summarise");
              }}
              className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium flex-shrink-0"
              style={{
                padding: "4px 6px",
                borderRadius: "10px",
                fontFamily: "IBM Plex Sans",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.03em",
                color: "#1A1A1A",
                backgroundColor: activeTab === "summarise" ? "#F5F5F5" : "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Summarise
            </button>
            <button
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SummaryEdit.jsx:449',message:'Tab button clicked',data:{tab:'compare-resume',currentTab:activeTab},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
                setActiveTab("compare-resume");
              }}
              className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium flex-shrink-0"
              style={{
                padding: "4px 6px",
                borderRadius: "10px",
                fontFamily: "IBM Plex Sans",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.03em",
                color: "#1A1A1A",
                backgroundColor: activeTab === "compare-resume" ? "#F5F5F5" : "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Compare Resume
            </button>
            {matchScore !== null && (
              <button
                onClick={() => {
                  setActiveTab("ai-resume");
                }}
                className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium flex-shrink-0"
                style={{
                  padding: "4px 6px",
                  borderRadius: "10px",
                  fontFamily: "IBM Plex Sans",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#1A1A1A",
                  backgroundColor: activeTab === "ai-resume" ? "#F5F5F5" : "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                AI Resume
              </button>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          {activeTab === "edit-resume" && (
            <div className="p-4 space-y-4">
              <Reorder.Group
                axis="y"
                values={sections}
                onReorder={setSections}
                className="space-y-4"
              >
                {sections.map((section) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    renderSectionForm={renderSectionForm}
                  />
                ))}
              </Reorder.Group>
            </div>
          )}

          {activeTab === "compare-resume" && (
            <CompareResumeContent setMatchScore={setMatchScore} />
          )}

          {activeTab === "summarise" && (
            <SummariseResumeContent resumeData={resumeData} />
          )}

          {activeTab === "ai-resume" && (
            <div className="w-full h-full">
              <AISidebar
                sections={sections}
                setSections={setSections}
                resumeData={resumeData}
                editingFields={editingFields}
                toggleFieldEdit={toggleFieldEdit}
                updateResumeData={updateResumeData}
                activeResumeSection={activeResumeSection}
                collapsedSections={new Set()}
                handleToggleCollapse={() => {}}
                handleAddEntry={addEntryHandler}
                renderSectionForm={(sectionId) => renderSectionForm(sectionId, true)}
                showTabs={true}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                matchScore={matchScore}
                currentScore={currentScore}
                scoreChange={scoreChange}
                getScoreColor={getScoreColor}
                getScoreTitle={getScoreTitle}
                initialScore={initialScore}
                SummariseResumeContent={SummariseResumeContent}
                CompareResumeContent={() => <CompareResumeContent setMatchScore={setMatchScore} />}
                setMatchScore={setMatchScore}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
