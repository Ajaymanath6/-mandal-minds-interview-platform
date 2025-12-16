import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Reorder, useDragControls } from "framer-motion";
import {
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiUserLine,
  RiDeleteBinLine,
  RiQuestionLine,
  RiArrowUpSLine,
  RiEditLine,
  RiArrowUpDownFill,
} from "@remixicon/react";
import { DocumentPdf, Document } from "@carbon/icons-react";
import Sidebar from "../components/Sidebar";
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
  const [activeSections, setActiveSections] = useState([
    "personal",
    "work",
    "education",
  ]); // All sections open by default
  const [sections, setSections] = useState([
    { id: "personal", name: "Personal Information", icon: RiUserLine },
    { id: "work", name: "Work Experience", icon: RiBriefcaseLine },
    { id: "education", name: "Education", icon: RiGraduationCapLine },
  ]);
  const [editingFields, setEditingFields] = useState({}); // Track which fields are being edited
  const [hoveredResumeSection, setHoveredResumeSection] = useState(null);
  const [activeResumeSection, setActiveResumeSection] = useState(null);
  const [activeTab, setActiveTab] = useState("edit-resume"); // Track active tab
  const location = useLocation();
  // Determine file type from location state or default to PDF
  const [fileType, setFileType] = useState(() => {
    // Check if file type is passed via location state
    if (location.state?.fileType) {
      return location.state.fileType;
    }
    // Check if file name suggests Word document
    if (location.state?.fileName) {
      const fileName = location.state.fileName.toLowerCase();
      if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        return 'word';
      }
    }
    return 'pdf'; // Default to PDF
  });
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
  });
  const navigate = useNavigate();

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
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
                {resumeData.personal.name}
              </h1>
              <p style={{ color: '#1A1A1A' }}>
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
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A' }}>
                WORK EXPERIENCE
              </h2>
              {resumeData.work.map((workItem, index) => (
                <div key={workItem.id} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                        {workItem.title}
                      </h3>
                      <p style={{ color: '#1A1A1A' }}>{workItem.company}</p>
                    </div>
                    <p style={{ color: '#1A1A1A' }}>
                      {workItem.startDate} - {workItem.endDate}
                    </p>
                  </div>
                  <p style={{ color: '#1A1A1A' }}>{workItem.description}</p>
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
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A' }}>
                EDUCATION
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>
                      {resumeData.education.degree}
                    </h3>
                    <p style={{ color: '#1A1A1A' }}>
                      {resumeData.education.institution}
                    </p>
                  </div>
                  <p style={{ color: '#1A1A1A' }}>
                    {resumeData.education.startYear} -{" "}
                    {resumeData.education.endYear}
                  </p>
                </div>
                <p style={{ color: '#1A1A1A' }}>GPA: {resumeData.education.gpa}</p>
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

  // Resume Section Wrapper Component
  const ResumeSectionWrapper = ({ sectionId, sectionName, children }) => {
    const isHovered = hoveredResumeSection === sectionId;

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
        {isHovered && (
          <>
            {/* Purple border overlay - doesn't affect layout */}
            <div className="absolute inset-0 border-2 border-purple-300 rounded-lg pointer-events-none"></div>
            {/* Edit badge */}
            <div className="absolute top-2 right-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white px-3 py-[5px] text-[13px] rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold leading-[1.2] whitespace-nowrap z-10">
              Click to edit this section
            </div>
          </>
        )}
      </div>
    );
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
        <span style={{ color: '#1A1A1A' }}>{value}</span>
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
                  <h4 className="font-medium" style={{ color: '#1A1A1A' }}>
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
                <h2 className="text-base font-bold" style={{ color: '#1A1A1A' }}>
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
            <div className="px-4 pt-4 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("edit-resume")}
                  className="transition-colors hover:bg-[#F5F5F5]"
                  style={{
                    padding: "4px 6px",
                    borderRadius: "10px",
                    fontFamily: "Body Font",
                    fontWeight: 600,
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
                  className="transition-colors hover:bg-[#F5F5F5]"
                  style={{
                    padding: "4px 6px",
                    borderRadius: "10px",
                    fontFamily: "Body Font",
                    fontWeight: 600,
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
                  className="transition-colors hover:bg-[#F5F5F5]"
                  style={{
                    padding: "4px 6px",
                    borderRadius: "10px",
                    fontFamily: "Body Font",
                    fontWeight: 600,
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

            {/* Sections */}
            <Reorder.Group
              axis="y"
              values={sections}
              onReorder={setSections}
              className="flex-1 p-4 space-y-4 overflow-y-auto thin-scrollbar"
            >
              {sections.map((section) => {
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
                        <span>{section.name}</span>
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
              })}
            </Reorder.Group>
          </div>
        </div>

        {/* Main Content - Resume Display */}
        <div className="flex-1 w-full md:w-4/5 lg:w-[70%] flex flex-col overflow-hidden h-1/2 md:h-full">
          <div className="flex-1 overflow-y-auto p-8 thin-scrollbar" style={{ backgroundColor: '#fcfcfb' }}>
            <div className="max-w-4xl mx-auto">
              {/* Plain Resume Box */}
              <div
                className="bg-white rounded-lg p-12 min-h-[11in]"
                style={{ 
                  width: "8.5in",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
              >
                {/* Render sections in the order defined by sidebar */}
                {sections.map((section) => renderResumeSection(section))}

                {/* Skills Section - Static for now */}
                <ResumeSectionWrapper
                  sectionId="skills"
                  sectionName="Technical Skills"
                >
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A' }}>
                      TECHNICAL SKILLS
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                          Frontend:
                        </h4>
                        <p style={{ color: '#1A1A1A' }}>
                          React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                          Backend:
                        </h4>
                        <p style={{ color: '#1A1A1A' }}>
                          Node.js, Express.js, Python, Django, RESTful APIs
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                          Database:
                        </h4>
                        <p style={{ color: '#1A1A1A' }}>
                          MongoDB, PostgreSQL, MySQL, Redis
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                          Tools:
                        </h4>
                        <p style={{ color: '#1A1A1A' }}>
                          Git, Docker, AWS, CI/CD, Agile/Scrum
                        </p>
                      </div>
                    </div>
                  </div>
                </ResumeSectionWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

