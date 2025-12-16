import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reorder, useDragControls } from "framer-motion";
import {
  RiDeleteBinLine,
  RiQuestionLine,
  RiArrowUpDownFill,
} from "@remixicon/react";
import { DocumentPdf, Document } from "@carbon/icons-react";
import FileUploadModal from "./FileUploadModal";
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
  activeResumeSection,
  onScanningStateChange,
}) {
  const navigate = useNavigate();

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
        className={`relative w-full px-3 py-2 text-sm border rounded-lg cursor-pointer transition-colors ${
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

  // Compare Resume Content Component
  const CompareResumeContent = ({ resumeData, onScanningStateChange }) => {
    const [matchScore, setMatchScore] = useState(null);
    const [jdText, setJdText] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleFileUpload = (file, text) => {
      if (file) {
        // Close the upload modal
        setIsUploadModalOpen(false);
        
        // Reset states
        setMatchScore(null);
        setIsScanning(false);
        if (onScanningStateChange) {
          onScanningStateChange(false);
        }

        // If text is provided (from .txt files), use it
        if (text && text.trim()) {
          setJdText(text);
        } else {
          // For PDF/DOCX, simulate text extraction
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
            const simulatedText = `Job Description extracted from ${file.name}\n\n[This is a simulated extraction. In production, this would extract actual text from the uploaded file.]\n\nWe are looking for a Senior Full-Stack Developer to join our team. The ideal candidate should have:\n- 5+ years of experience in React and Node.js\n- Strong knowledge of TypeScript\n- Experience with MongoDB and PostgreSQL\n- Familiarity with AWS and Docker\n\nResponsibilities:\n- Develop and maintain scalable web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews`;
            setJdText(simulatedText);
          } else {
            // For other file types, try to read as text
            const reader = new FileReader();
            reader.onload = (e) => {
              const fileText = e.target.result;
              if (fileText && fileText.trim()) {
                setJdText(fileText);
              } else {
                setJdText(`File ${file.name} appears to be empty or could not be read.`);
              }
            };
            reader.onerror = () => {
              setJdText(`Error reading file: ${file.name}. Please try again or paste the content manually.`);
            };
            reader.readAsText(file);
          }
        }
      }
    };

    const handleTextChange = (e) => {
      const text = e.target.value;
      setJdText(text);
      // If text is cleared, reset match score
      if (!text.trim()) {
        setMatchScore(null);
        setIsScanning(false);
        if (onScanningStateChange) {
          onScanningStateChange(false);
        }
      }
    };

    const handleCompareClick = () => {
      if (!jdText.trim() || isScanning) return;
      startScanning(jdText);
    };

    const startScanning = (text) => {
      if (!text.trim()) return;
      
      setIsScanning(true);
      setMatchScore(null);
      if (onScanningStateChange) {
        onScanningStateChange(true);
      }

      // Simulate scanning process (exactly 2 seconds)
      setTimeout(() => {
        // Calculate match score (dummy calculation)
        const calculatedScore = Math.floor(60 + Math.random() * 30); // 60-90%
        setMatchScore(calculatedScore);
        setIsScanning(false);
        if (onScanningStateChange) {
          onScanningStateChange(false);
        }
      }, 2000);
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
          <div className="mt-3 p-4 bg-white rounded-xl shadow-lg" style={{ border: '1px solid #E5E5E5' }}>
            <div className="space-y-3">
              {!jdText.trim() && (
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#dfe1e5] rounded-[7px] transition-all hover:bg-[#F5F5F5] cursor-pointer"
                    style={{ fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: '14px', color: '#1A1A1A' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#575757' }}>
                      upload_file
                    </span>
                    Upload JD File
                  </button>
                  <FileUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onFileUpload={handleFileUpload}
                  />
                </div>
              )}
              <textarea
                value={jdText}
                onChange={handleTextChange}
                placeholder="Paste or upload Job Description here to compare with your resume..."
                rows={8}
                className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
                style={{ fontFamily: 'IBM Plex Sans', borderColor: '#E5E5E5' }}
              />
              {jdText.trim() && matchScore === null && (
                <button
                  onClick={handleCompareClick}
                  disabled={isScanning}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: '14px' }}
                >
                  {isScanning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Scanning</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                        compare_arrows
                      </span>
                      Compare Resume with JD
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Overall Match Score Section - Show below JD after scanning completes */}
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
              </div>
            </div>
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
                  <h4 className="font-medium" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                    Work Experience {workIndex + 1}
                  </h4>
                  <div className="text-gray-400">
                    <RiArrowUpDownFill size={16} style={{ color: '#575757' }} />
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
                  <EditableField
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
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:w-1/5 lg:w-[30%] bg-white border-t md:border-t-0 md:border-l border-gray-200 flex-shrink-0 h-1/2 md:h-full">
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
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("edit-resume")}
              className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium"
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
              }}
            >
              Edit Resume
            </button>
            <button
              onClick={() => setActiveTab("compare-resume")}
              className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium"
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
              }}
            >
              Compare Resume
            </button>
            <button
              onClick={() => setActiveTab("summarise")}
              className="transition-colors hover:bg-[#F5F5F5] text-sm font-medium"
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
              }}
            >
              Summarise
            </button>
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
            <CompareResumeContent resumeData={resumeData} onScanningStateChange={onScanningStateChange} />
          )}

          {activeTab === "summarise" && (
            <SummariseResumeContent resumeData={resumeData} />
          )}
        </div>
      </div>
    </div>
  );
}
