import { useState, useEffect, useRef } from "react";
import SummaryEdit from "../components/SummaryEdit";
import { IbmWatsonOpenscale, Export, Close } from "@carbon/icons-react";
import { RiShareLine, RiFileCopyLine } from "@remixicon/react";

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
  handleAddEntry,
  handleDeleteWork,
  activeResumeSection,
  renderResumeSection,
  ResumeSectionWrapper,
  onScanningStateChange,
}) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'EditResumeLayout.jsx:17',message:'Layout rendered',data:{activeTab,hasOnScanning:!!onScanningStateChange},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const shareButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Generate share link when dropdown opens
  useEffect(() => {
    if (isShareDropdownOpen) {
      setIsLoading(true);
      // Simulate API call to generate share link
      setTimeout(() => {
        // Generate a share link (in production, this would come from an API)
        const link = `https://mandalminds.com/share/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setShareLink(link);
        setIsLoading(false);
      }, 1500);
    }
  }, [isShareDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target)
      ) {
        setIsShareDropdownOpen(false);
      }
    };

    if (isShareDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShareDropdownOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      // You could add a toast notification here
      alert("Link copied to clipboard!");
    });
  };

  const handleShareClick = () => {
    setIsShareDropdownOpen(!isShareDropdownOpen);
  };

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
        handleAddEntry={handleAddEntry}
        handleDeleteWork={handleDeleteWork}
        activeResumeSection={activeResumeSection}
        onScanningStateChange={onScanningStateChange}
      />

      {/* Right Side - Resume Display */}
      <div className="flex-1 w-full md:w-4/5 lg:w-[70%] flex flex-col overflow-hidden h-1/2 md:h-full relative">
        {/* Buttons above resume */}
        <div className="flex items-center justify-end gap-3 p-4 relative" style={{ backgroundColor: '#fcfcfb' }}>
          <button
            ref={shareButtonRef}
            onClick={handleShareClick}
            className="flex items-center justify-center bg-transparent rounded-lg transition-all"
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Share"
          >
            <RiShareLine size={20} style={{ color: '#1A1A1A' }} />
          </button>
          
          {/* Share Dropdown */}
          {isShareDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              style={{
                left: '665px',
                top: '57px',
                minWidth: '320px',
                maxWidth: '400px',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                  Share your chat with others
                </h3>
                <button
                  onClick={() => setIsShareDropdownOpen(false)}
                  className="flex items-center justify-center p-1 rounded transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  title="Close"
                >
                  <Close
                    size={20}
                    style={{ color: '#575757' }}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium" style={{ color: '#575757', fontFamily: 'Open Sans' }}>
                      Share Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareLink}
                        className="flex-1 px-3 py-2 text-sm text-[#3c4043] bg-white border border-[#dfe1e5] rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none focus:border-[#a854ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] transition-all placeholder:text-[#80868b] hover:bg-[#F5F5F5]"
                        style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}
                      />
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center p-2 rounded-lg transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        title="Copy link"
                      >
                        <RiFileCopyLine size={18} style={{ color: '#575757' }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            className="flex items-center justify-center bg-white hover:bg-gray-50 transition-all"
            style={{
              width: '84px',
              height: '36px',
              gap: '4px',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            }}
            title="Export"
          >
            <Export size={20} style={{ color: '#1A1A1A' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>Export</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-2 rounded-lg transition-all"
            style={{
              height: '36px',
              paddingTop: '6px',
              paddingRight: '8px',
              paddingBottom: '6px',
              paddingLeft: '8px',
              background: 'linear-gradient(180deg, #9a33ff 0%, #7c00ff 100%)',
              border: '1px solid #a854ff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
            title="Upgrade"
          >
            <IbmWatsonOpenscale size={20} style={{ color: 'white' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Upgrade</span>
          </button>
        </div>
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
                  <h2 className="text-xl font-bold mb-3 border-b-2 border-gray-300 pb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                    TECHNICAL SKILLS
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        Frontend:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        React, Vue.js, TypeScript, HTML5, CSS3, Tailwind CSS
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        Backend:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        Node.js, Express.js, Python, Django, RESTful APIs
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        Database:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        MongoDB, PostgreSQL, MySQL, Redis
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                        Tools:
                      </h4>
                      <p style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
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

