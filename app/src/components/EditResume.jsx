import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [activeSections, setActiveSections] = useState([
    "personal",
    "work",
    "education",
  ]); // All sections open by default
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: "personal", name: "Personal Information", icon: RiUserLine },
    { id: "work", name: "Work Experience", icon: RiBriefcaseLine },
    { id: "education", name: "Education", icon: RiGraduationCapLine },
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
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                WORK EXPERIENCE
              </h2>
              {resumeData.work.map((workItem, index) => (
                <div key={workItem.id} className="mb-6">
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
                  <p className="text-gray-700">{workItem.description}</p>
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
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                EDUCATION
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resumeData.education.degree}
                    </h3>
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
            className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
          className="w-full px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b]"
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
                } py-1.5 text-gray-900 hover:bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#5b748e",
                    }}
                  >
                    auto_awesome
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">
                    AI Interview
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/resume-editor")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 hover:bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#5b748e",
                    }}
                  >
                    edit_note
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">
                    Get Vetted
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/manage-resume")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#7c00ff",
                      filter:
                        "drop-shadow(0 4px 12px rgba(124, 0, 255, 0.3)) drop-shadow(inset 0 1px 0 rgba(255, 255, 255, 0.25))",
                    }}
                  >
                    content_copy
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">
                    Manage Resume
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/manage-jds")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-1.5 text-gray-900 hover:bg-gray-50 rounded-3xl w-full transition-colors`}
              >
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      color: "#5b748e",
                    }}
                  >
                    description
                  </span>
                </div>
                {firstSidebarOpen && (
                  <span className="text-sm font-semibold text-gray-900">
                    Manage JDs
                  </span>
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
                    <p className="text-xs text-gray-500 truncate">Designer</p>
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
              <h2 className="text-base font-bold text-gray-900">Edit Resume</h2>
              <button
                onClick={() => navigate("/manage-resume")}
                className="flex items-center justify-center p-2 text-gray-900 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Resume List"
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
                    <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Icon size={16} />
                        <span>{section.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded">
                          <RiQuestionLine size={16} />
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded cursor-move"
                          onPointerDown={(e) => dragControls.start(e)}
                        >
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

                {/* Skills Section - Static for now */}
                <ResumeSectionWrapper
                  sectionId="skills"
                  sectionName="Technical Skills"
                >
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                      TECHNICAL SKILLS
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Frontend:
                        </h4>
                        <p className="text-gray-700">
                          React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Backend:
                        </h4>
                        <p className="text-gray-700">
                          Node.js, Express.js, Python, Django, RESTful APIs
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Database:
                        </h4>
                        <p className="text-gray-700">
                          MongoDB, PostgreSQL, MySQL, Redis
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Tools:
                        </h4>
                        <p className="text-gray-700">
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
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "20px",
                      fontVariationSettings:
                        '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
                      color: "#7c00ff",
                      filter:
                        "drop-shadow(0 4px 12px rgba(124, 0, 255, 0.3)) drop-shadow(inset 0 1px 0 rgba(255, 255, 255, 0.25))",
                    }}
                  >
                    verified_user
                  </span>
                </div>
                <span className="text-gray-900 font-medium">
                  Get Vetted (Current)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
