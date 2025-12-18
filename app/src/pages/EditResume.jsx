import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiUserLine,
} from "@remixicon/react";
import Sidebar from "../components/Sidebar";
import EditResumeLayout from "../layouts/EditResumeLayout";
import "material-symbols/outlined.css";

export default function EditResume() {
  const location = useLocation();
  // Determine file type from location state or default to PDF
  const [fileType] = useState(() => {
    if (location.state?.fileType) {
      return location.state.fileType;
    }
    if (location.state?.fileName) {
      const fileName = location.state.fileName.toLowerCase();
      if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        return 'word';
      }
    }
    return 'pdf';
  });
  const [activeTab, setActiveTab] = useState("edit-resume");
  const [sections, setSections] = useState([
    { id: "personal", name: "Personal Information", icon: RiUserLine },
    { id: "work", name: "Work Experience", icon: RiBriefcaseLine },
    { id: "education", name: "Education", icon: RiGraduationCapLine },
  ]);
  const [editingFields, setEditingFields] = useState({});
  const [hoveredResumeSection, setHoveredResumeSection] = useState(null);
  const [activeResumeSection, setActiveResumeSection] = useState(null);
  const [_isScanningResume, setIsScanningResume] = useState(false);
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
    ],
    education: {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      startYear: "2015",
      endYear: "2019",
      gpa: "3.8/4.0",
    },
  });

  const toggleFieldEdit = (fieldId) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const updateResumeData = (section, field, value, index = null) => {
    setResumeData((prev) => {
      if (Array.isArray(prev[section]) && index !== null) {
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

  // Handler to delete work experience item
  const handleDeleteWork = (workId) => {
    setResumeData((prev) => ({
      ...prev,
      work: prev.work.filter((item) => item.id !== workId),
    }));
  };

  // Handler to add new entry to a section
  const handleAddEntry = (sectionId) => {
    setResumeData((prev) => {
      if (sectionId === "work") {
        // Add new work experience entry
        const maxId =
          prev.work && prev.work.length > 0 ? Math.max(...prev.work.map((w) => w.id)) : 0;
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
          work: [...(prev.work || []), newWorkEntry],
        };
      } else if (sectionId === "education") {
        // For education, if it's an object, convert to array
        if (!Array.isArray(prev.education)) {
          // Convert single education object to array
          const eduArray = prev.education ? [{ ...prev.education, id: 1 }] : [];
          return {
            ...prev,
            education: eduArray,
          };
        } else {
          // Add new education entry
          const maxId =
            prev.education.length > 0
              ? Math.max(...prev.education.map((e) => e.id || 0))
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
      }
      // For other sections (personal, skills), don't add duplicates
      return prev;
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
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                {resumeData.personal.name}
              </h1>
              <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
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
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                WORK EXPERIENCE
              </h2>
              {resumeData.work.map((workItem) => (
                <div key={workItem.id} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        {workItem.title}
                      </h3>
                      <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>{workItem.company}</p>
                    </div>
                    <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                      {workItem.startDate} - {workItem.endDate}
                    </p>
                  </div>
                  <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>{workItem.description}</p>
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
              <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                EDUCATION
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                      {resumeData.education.degree}
                    </h3>
                    <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                      {resumeData.education.institution}
                    </p>
                  </div>
                  <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                    {resumeData.education.startYear} -{" "}
                    {resumeData.education.endYear}
                  </p>
                </div>
                <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>GPA: {resumeData.education.gpa}</p>
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
  const ResumeSectionWrapper = ({ sectionId, children }) => {
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
            <div className="absolute top-2 right-2 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] text-white px-3 py-[5px] text-[13px] rounded-[7px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] font-semibold leading-[1.2] whitespace-nowrap z-10" style={{ fontFamily: 'IBM Plex Sans' }}>
              Click to edit this section
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex" style={{ backgroundColor: '#fcfcfb' }}>
      <div className="flex flex-col md:flex-row w-full" style={{ height: "100vh" }}>
        {/* First Sidebar - Navigation */}
        <div className="hidden md:flex">
          <Sidebar activeItem="get-vetted" />
        </div>

        {/* EditResumeLayout Component */}
        <EditResumeLayout
          fileType={fileType}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sections={sections}
          setSections={setSections}
          resumeData={resumeData}
          editingFields={editingFields}
          toggleFieldEdit={toggleFieldEdit}
          updateResumeData={updateResumeData}
          handleAddEntry={handleAddEntry}
          handleDeleteWork={handleDeleteWork}
          activeResumeSection={activeResumeSection}
          renderResumeSection={renderResumeSection}
          ResumeSectionWrapper={ResumeSectionWrapper}
          onScanningStateChange={setIsScanningResume}
        />
      </div>
    </div>
  );
}

