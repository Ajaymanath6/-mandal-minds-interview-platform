import SummaryEdit from "../components/SummaryEdit";

export default function EditResumeLayout({
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
  renderResumeSection,
  ResumeSectionWrapper,
  onScanningStateChange,
}) {
  return (
    <div className="flex flex-col md:flex-row w-full" style={{ height: "100vh" }}>
      {/* Left Side - SummaryEdit Component */}
      <SummaryEdit
        fileType={fileType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sections={sections}
        setSections={setSections}
        resumeData={resumeData}
        editingFields={editingFields}
        toggleFieldEdit={toggleFieldEdit}
        updateResumeData={updateResumeData}
        activeResumeSection={activeResumeSection}
        onScanningStateChange={onScanningStateChange}
      />

      {/* Right Side - Resume Display */}
      <div className="flex-1 w-full md:w-4/5 lg:w-[70%] flex flex-col overflow-hidden h-1/2 md:h-full relative">
        <div className="flex-1 overflow-y-auto p-8 thin-scrollbar relative" style={{ backgroundColor: '#fcfcfb' }}>
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
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                    TECHNICAL SKILLS
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        Frontend:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        Backend:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        Node.js, Express.js, Python, Django, RESTful APIs
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        Database:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        MongoDB, PostgreSQL, MySQL, Redis
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
                        Tools:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'IBM Plex Sans' }}>
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
  );
}

