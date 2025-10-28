import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reorder } from "framer-motion";
import {
  RiUser3Fill,
  RiFileTextLine,
  RiFileCopyLine,
  RiFileList3Line,
  RiLogoutBoxLine,
  RiSparklingFill,
  RiCloseLine,
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiUserLine,
  RiDeleteBinLine,
  RiDraggable,
  RiQuestionLine,
  RiArrowUpSLine,
  RiEditLine,
} from "@remixicon/react";
import logoSvg from "../assets/logo.svg";
import "material-symbols/outlined.css";

export default function EditResume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [activeSections, setActiveSections] = useState([]); // Allow multiple sections open
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [sections, setSections] = useState([
    { id: "personal", name: "Personal Information", icon: RiUserLine },
    { id: "work", name: "Work Experience", icon: RiBriefcaseLine },
    { id: "education", name: "Education", icon: RiGraduationCapLine },
  ]);
  const [editingFields, setEditingFields] = useState({}); // Track which fields are being edited
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setActiveSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const toggleFieldEdit = (fieldId) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // Editable Field Component
  const EditableField = ({
    fieldId,
    value,
    placeholder,
    type = "text",
    rows = 1,
  }) => {
    const [hoveredField, setHoveredField] = useState(null);
    const isEditing = editingFields[fieldId];

    if (isEditing) {
      if (type === "textarea") {
        return (
          <textarea
            rows={rows}
            defaultValue={value}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            autoFocus
            onBlur={() => toggleFieldEdit(fieldId)}
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
          onBlur={() => toggleFieldEdit(fieldId)}
        />
      );
    }

    return (
      <div
        className={`relative w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer transition-colors ${
          hoveredField === fieldId ? "bg-gray-50" : "bg-white"
        }`}
        onMouseEnter={() => setHoveredField(fieldId)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <span className="text-gray-900">{value}</span>
        {hoveredField === fieldId && (
          <button
            onClick={() => toggleFieldEdit(fieldId)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
          >
            <RiEditLine size={12} />
            <span>Edit</span>
          </button>
        )}
      </div>
    );
  };

  const renderSectionForm = (sectionId) => {
    if (!activeSections.includes(sectionId)) return null;

    switch (sectionId) {
      case "personal":
        return (
          <div className="mt-3 p-4 bg-white rounded-xl shadow-lg transition-all duration-200 ease-in-out">
            <div className="space-y-3">
              <EditableField
                fieldId="personal-name"
                value="John Doe"
                placeholder="Full Name"
              />
              <EditableField
                fieldId="personal-email"
                value="john.doe@example.com"
                placeholder="Email"
                type="email"
              />
              <EditableField
                fieldId="personal-phone"
                value="+1 (555) 123-4567"
                placeholder="Phone"
                type="tel"
              />
              <EditableField
                fieldId="personal-location"
                value="San Francisco, CA"
                placeholder="Location"
              />
            </div>
          </div>
        );
      case "work":
        return (
          <div className="mt-3 p-4 bg-white rounded-xl shadow-lg transition-all duration-200 ease-in-out">
            <div className="space-y-3">
              <EditableField
                fieldId="work-title"
                value="Senior Full-Stack Developer"
                placeholder="Job Title"
              />
              <EditableField
                fieldId="work-company"
                value="Mandal Minds"
                placeholder="Company"
              />
              <div className="grid grid-cols-2 gap-2">
                <EditableField
                  fieldId="work-start"
                  value="2021-01"
                  placeholder="Start Date"
                  type="month"
                />
                <EditableField
                  fieldId="work-end"
                  value="Present"
                  placeholder="End Date"
                />
              </div>
              <EditableField
                fieldId="work-description"
                value="Led development of scalable web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality features."
                placeholder="Description"
                type="textarea"
                rows={3}
              />
            </div>
          </div>
        );
      case "education":
        return (
          <div className="mt-3 p-4 bg-white rounded-xl shadow-lg transition-all duration-200 ease-in-out">
            <div className="space-y-3">
              <EditableField
                fieldId="edu-degree"
                value="Bachelor of Science in Computer Science"
                placeholder="Degree"
              />
              <EditableField
                fieldId="edu-institution"
                value="Stanford University"
                placeholder="Institution"
              />
              <div className="grid grid-cols-2 gap-2">
                <EditableField
                  fieldId="edu-start"
                  value="2015"
                  placeholder="Start Year"
                  type="number"
                />
                <EditableField
                  fieldId="edu-end"
                  value="2019"
                  placeholder="End Year"
                  type="number"
                />
              </div>
              <EditableField
                fieldId="edu-gpa"
                value="3.8/4.0"
                placeholder="GPA (Optional)"
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
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full`}
              >
                <RiSparklingFill size={16} />
                {firstSidebarOpen && (
                  <span className="text-sm">AI Interview</span>
                )}
              </button>

              <a
                href="#"
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md`}
              >
                <RiFileTextLine size={16} />
                {firstSidebarOpen && (
                  <span className="text-sm">Resume Editor</span>
                )}
              </a>

              <button
                onClick={() => navigate("/manage-resume")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-purple-600 bg-gray-50 rounded-md w-full`}
              >
                <RiFileCopyLine size={16} />
                {firstSidebarOpen && (
                  <span className="text-sm">Manage Resume</span>
                )}
              </button>

              <button
                onClick={() => navigate("/manage-jds")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full`}
              >
                <RiFileList3Line size={16} />
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
                    <RiUser3Fill size={16} className="text-purple-600" />
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
                  <RiLogoutBoxLine size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Second Sidebar - Resume Sections */}
        <div className="w-[35%] bg-white border-l border-gray-200 flex-shrink-0 h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div
              className="px-4 border-b border-gray-200 flex items-center"
              style={{ height: "65px" }}
            >
              <h2 className="text-base font-bold text-gray-900">Edit Resume</h2>
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
                const isActive = activeSections.includes(section.id);

                return (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    className="mb-4"
                  >
                    <div className="min-h-fit">
                      <div
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "text-gray-900 bg-gray-100"
                            : "text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center space-x-3 flex-1 text-left"
                        >
                          <Icon size={16} />
                          <span>{section.name}</span>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className={`text-gray-500 hover:text-gray-700 p-1 transition-transform ${
                              isActive ? "rotate-180" : ""
                            }`}
                          >
                            <RiArrowUpSLine size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 p-1">
                            <RiQuestionLine size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 p-1 cursor-move">
                            <RiDraggable size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-red-600 p-1">
                            <RiDeleteBinLine size={16} />
                          </button>
                        </div>
                      </div>

                      {renderSectionForm(section.id)}
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        </div>

        {/* Main Content - Resume Display */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {/* Plain Resume Box */}
              <div
                className="bg-white rounded-lg p-12 min-h-[11in] shadow-sm"
                style={{ width: "8.5in" }}
              >
                {/* Resume Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    John Doe
                  </h1>
                  <p className="text-gray-600">
                    john.doe@example.com | +1 (555) 123-4567 | San Francisco, CA
                  </p>
                </div>

                {/* Summary Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Experienced Full-Stack Developer with 5+ years of expertise
                    in building scalable web applications. Proficient in React,
                    Node.js, and modern web technologies. Passionate about
                    creating efficient, user-friendly solutions and
                    collaborating with cross-functional teams.
                  </p>
                </div>

                {/* Work Experience Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                    WORK EXPERIENCE
                  </h2>

                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Senior Full-Stack Developer
                        </h3>
                        <p className="text-gray-700">Mandal Minds</p>
                      </div>
                      <p className="text-gray-600">Jan 2021 - Present</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>
                        Led development of scalable web applications using React
                        and Node.js
                      </li>
                      <li>
                        Collaborated with cross-functional teams to deliver
                        high-quality features
                      </li>
                      <li>
                        Optimized application performance, reducing load time by
                        40%
                      </li>
                      <li>
                        Mentored junior developers and conducted code reviews
                      </li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Full-Stack Developer
                        </h3>
                        <p className="text-gray-700">TechCorp Inc</p>
                      </div>
                      <p className="text-gray-600">Jun 2019 - Dec 2020</p>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                      <li>
                        Developed and maintained web applications using modern
                        JavaScript frameworks
                      </li>
                      <li>
                        Implemented RESTful APIs and integrated third-party
                        services
                      </li>
                      <li>
                        Participated in agile development processes and sprint
                        planning
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Education Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                    EDUCATION
                  </h2>

                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Bachelor of Science in Computer Science
                        </h3>
                        <p className="text-gray-700">Stanford University</p>
                      </div>
                      <p className="text-gray-600">2015 - 2019</p>
                    </div>
                    <p className="text-gray-700">GPA: 3.8/4.0</p>
                  </div>
                </div>

                {/* Skills Section */}
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
                <RiCloseLine size={20} />
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
                <RiSparklingFill size={16} className="text-purple-600" />
                <span className="text-gray-900 font-medium">AI Interview</span>
              </button>
              <button
                onClick={() => {
                  navigate("/manage-jds");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <RiFileList3Line size={16} />
                <span className="text-gray-900 font-medium">Manage JDs</span>
              </button>
              <button
                onClick={() => {
                  navigate("/manage-resume");
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <RiFileCopyLine size={16} />
                <span className="text-gray-900 font-medium">Manage Resume</span>
              </button>
              <button
                onClick={() => {
                  setLogoModalOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-purple-50 text-left"
              >
                <RiFileCopyLine size={16} className="text-purple-600" />
                <span className="text-gray-900 font-medium">
                  Edit Resume (Current)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
