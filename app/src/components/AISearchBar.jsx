import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiFileTextLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiSaveLine,
  RiCloseLine,
  RiSearchLine,
  RiArrowDownSLine,
} from "@remixicon/react";
import { IbmWatsonDiscovery, Chat, IbmWatsonOpenscale, CheckmarkFilled, List, Grid, Earth, EarthFilled, TableOfContents, Filter, ArrowLeft, Return } from "@carbon/icons-react";
import FileUploadModal from "./FileUploadModal";
import SimpleDropdown from "./SimpleDropdown";
import GlobeView from "./GlobeView";
import FilterDropdown from "./FilterDropdown";

export default function AISearchBar({
  onCompare,
  onSaveJD,
  onJDUploaded,
  externalJDFile,
  secondSidebarOpen = false,
  onMapViewChange = null,
}) {
  const [activeTab, setActiveTab] = useState("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [jdUploadStatus, setJdUploadStatus] = useState("idle"); // idle, uploading, loaded
  const [jdImage, setJdImage] = useState(null);
  const [jdFileName, setJdFileName] = useState(null);
  const textareaRef = useRef(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBottomButtonDropdownOpen, setIsBottomButtonDropdownOpen] = useState(false);
  const [selectedBottomOption, setSelectedBottomOption] = useState(null);
  const [extractedLocation, setExtractedLocation] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedFilterOption, setSelectedFilterOption] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const bottomButtonRef = useRef(null);
  const bottomButtonDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const navigate = useNavigate();

  const tabs = [
    {
      id: "upload",
      label: "AI job Search",
      icon: IbmWatsonDiscovery,
    },
    {
      id: "analyze",
      label: "Chat with Resume",
      icon: Chat,
      disabled: false,
    },
    {
      id: "interview",
      label: "AI Interview",
      icon: IbmWatsonOpenscale,
      disabled: false,
    },
  ];

  // Extract location from search query using "in [City]" pattern
  const extractLocation = (query) => {
    if (!query || !query.trim()) return null;
    
    // Pattern: match "in " followed by city name (case-insensitive)
    const pattern = /\bin\s+([A-Za-z\s]+)/i;
    const match = query.match(pattern);
    
    if (match && match[1]) {
      // Trim whitespace and return the location
      return match[1].trim();
    }
    
    return null;
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Mark that search has been clicked
    setHasSearched(true);

    // Check if Globe view is selected
    const isGlobeView = selectedBottomOption && selectedBottomOption.label === 'Globe view';
    
    if (isGlobeView) {
      // Extract location and update state
      const location = extractLocation(searchQuery);
      setExtractedLocation(location);
    } else {
      // List view: trigger comparison as before
      if (onCompare) {
        onCompare(searchQuery);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFileSelect = (file) => {
    setJdUploadStatus("uploading");
    setJdImage("/jd1.png");
    setJdFileName(file.name);

    // Simulate file processing (2-3 seconds)
    setTimeout(() => {
      setJdUploadStatus("loaded");
      // Extract text from file (simulate for now)
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setSearchQuery(text);
        if (onCompare) {
          onCompare(text);
        }
        if (onJDUploaded) {
          onJDUploaded(text, file.name);
        }
      };
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else {
        // For PDF/DOCX, simulate text extraction
        setTimeout(() => {
          const simulatedText = `Job Description extracted from ${file.name}`;
          setSearchQuery(simulatedText);
          if (onCompare) {
            onCompare(simulatedText);
          }
          if (onJDUploaded) {
            onJDUploaded(simulatedText, file.name);
          }
        }, 500);
      }
    }, 2000);
  };


  const handleRemoveJD = () => {
    setJdUploadStatus("idle");
    setJdImage(null);
    setJdFileName(null);
    setSearchQuery("");
  };

  // Handle drag and drop for Chat with Resume tab and AI Interview tab
  const handleDragOver = (e) => {
    if (activeTab === "analyze" || activeTab === "interview") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    if (activeTab === "analyze" || activeTab === "interview") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    if (activeTab === "analyze" || activeTab === "interview") {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleFileInput = (e) => {
    if ((activeTab === "analyze" || activeTab === "interview") && e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Update placeholder based on active tab
  const getPlaceholder = () => {
    if (jdUploadStatus === "loaded") {
      return "JD uploaded successfully! Now upload your resume or select from existing resumes to start interview.";
    }
    
    if (activeTab === "upload") {
      // AI job Search tab
      return "Search for keywords, product design, frontend developer...";
    }
    
    if (activeTab === "analyze") {
      // Chat with Resume tab
      return "Ask questions about your resume or get analysis...";
    }
    
    if (activeTab === "interview") {
      // AI Interview tab
      return "Paste job description here or upload JD file to start AI interview...";
    }
    
    return "Paste job description here or upload JD file...";
  };

  // Set default to List view when in AI job Search tab
  useEffect(() => {
    if (activeTab === "upload" && !selectedBottomOption) {
      setSelectedBottomOption({ label: 'List view', icon: List });
    }
  }, [activeTab, selectedBottomOption]);

  // Handle external JD file uploads
  useEffect(() => {
    if (externalJDFile) {
      handleFileSelect(externalJDFile);
      // Reset external file after processing to allow re-uploads
      // Note: The parent component should reset this
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalJDFile]);

  useEffect(() => {
    if ((activeTab === "upload" || activeTab === "interview") && jdUploadStatus === "idle") {
      const textarea = textareaRef.current;
      if (textarea) {
        const pasteHandler = (e) => {
          if ((activeTab === "upload" || activeTab === "interview") && jdUploadStatus === "idle") {
            const pastedText = e.clipboardData.getText();
            if (pastedText.trim()) {
              setJdUploadStatus("uploading");
              setJdImage("/jd1.png");
              setJdFileName("Pasted JD");
              
              setTimeout(() => {
                setJdUploadStatus("loaded");
                setSearchQuery(pastedText);
                if (onCompare) {
                  onCompare(pastedText);
                }
                if (onJDUploaded) {
                  onJDUploaded(pastedText, "Pasted JD");
                }
              }, 2000);
            }
          }
        };
        textarea.addEventListener("paste", pasteHandler);
        return () => {
          textarea.removeEventListener("paste", pasteHandler);
        };
      }
    }
  }, [activeTab, jdUploadStatus, onCompare, onJDUploaded]);

  // Update extracted location when switching to Globe view or when searchQuery changes in Globe view
  useEffect(() => {
    const isGlobeView = selectedBottomOption && selectedBottomOption.label === 'Globe view';
    if (isGlobeView && searchQuery) {
      const location = extractLocation(searchQuery);
      setExtractedLocation(location);
    } else if (!isGlobeView) {
      // Clear extracted location when switching away from Globe view
      setExtractedLocation(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBottomOption, searchQuery]);

  // Check if Globe view is selected
  const isGlobeView = selectedBottomOption && selectedBottomOption.label === 'Globe view';
  
  // Check if we're in AI job Search tab
  const isAISearchTab = activeTab === "upload";
  
  // Set default filter option to India
  useEffect(() => {
    if (isAISearchTab && !selectedFilterOption) {
      setSelectedFilterOption({ label: 'India', country: 'India', state: null });
    }
  }, [isAISearchTab, selectedFilterOption]);

  // Render search bar component (used in both views)
  const renderSearchBar = () => (
    <div className="bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] shadow-sm pt-[23px] pb-[23px] px-6">
      {/* Tabs - Inside search bar at the top */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled === true;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (!isDisabled) {
                  setActiveTab(tab.id);
                }
              }}
              disabled={isDisabled}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isDisabled
                  ? "bg-transparent text-[#A5A5A5] cursor-not-allowed opacity-50"
                  : isActive
                  ? "bg-[#0A0A0A] text-white shadow-md"
                  : "bg-[#E5E5E5] text-[#1A1A1A] hover:bg-[#E5E5E5]"
              }`}
              title={isDisabled ? "Please upload JD first" : ""}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Search Input Area */}
      <div 
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        
        {/* JD Image Preview with Loading Spinner */}
        {jdUploadStatus !== "idle" && jdImage && (
          <div className="absolute inset-0 bg-white rounded-lg flex items-end justify-center z-10 px-4 pb-4">
            <div className="flex items-end gap-3">
              <div className="relative overflow-hidden" style={{ maxHeight: '120px' }}>
                <img
                  src={jdImage}
                  alt="JD Preview"
                  className="max-w-full max-h-[120px] object-cover object-bottom rounded-lg"
                  style={{ objectPosition: 'center bottom' }}
                />
                {/* Loading Spinner Overlay */}
                {jdUploadStatus === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
                {/* Remove button when loaded */}
                {jdUploadStatus === "loaded" && (
                  <button
                    onClick={handleRemoveJD}
                    className="absolute top-2 right-2 w-8 h-8 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Remove JD"
                  >
                    <RiCloseLine size={16} />
                  </button>
                )}
              </div>
              {/* Document Name Display - Aligned to bottom of image */}
              {jdFileName && (
                <div className="flex items-center gap-2">
                  {jdUploadStatus === "loaded" && (
                    <CheckmarkFilled
                      size={20}
                      className="flex-shrink-0"
                      style={{ color: "#22c55e" }}
                    />
                  )}
                  <p className="text-sm font-normal text-[#1A1A1A] truncate max-w-[120px]" title={jdFileName}>
                    {jdFileName.length > 8 ? `${jdFileName.substring(0, 8)}...` : jdFileName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Dotted border overlay for Chat with Resume tab */}
        {activeTab === "analyze" && jdUploadStatus === "idle" && (
          <div 
            className="absolute inset-0 border-2 border-dashed rounded-lg z-10 flex items-center justify-center transition-colors bg-white"
            style={{
              borderColor: isDragging ? '#E5E5E5' : '#E5E5E5'
            }}
          >
            <div className="text-center">
              <p className="text-base font-medium">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                >
                  Select
                </button> or drop files here
              </p>
              <input
                type="file"
                id="resume-file-input"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.txt"
              />
            </div>
          </div>
        )}
        
        {/* Dotted border overlay for AI Interview tab */}
        {activeTab === "interview" && jdUploadStatus === "idle" && (
          <div 
            className="absolute inset-0 border-2 border-dashed rounded-lg z-10 flex items-center justify-center transition-colors bg-white"
            style={{
              borderColor: isDragging ? '#E5E5E5' : '#E5E5E5'
            }}
          >
            <div className="text-center">
              <p className="text-base font-medium">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                >
                  Select
                </button> JD or <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                >
                  upload
                </button> JD or write JD copy paste JD to text area
              </p>
              <input
                type="file"
                id="interview-file-input"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.txt"
              />
            </div>
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          className={`w-full min-h-[140px] px-6 py-4 pr-16 bg-white border rounded-lg focus:outline-none resize-none text-base m-0 ${
            jdUploadStatus !== "idle" ? "opacity-0 pointer-events-none" : ""
          } ${(activeTab === "analyze" || activeTab === "interview") && jdUploadStatus === "idle" ? "opacity-0 pointer-events-none" : ""}`}
          style={{ 
            marginLeft: 0, 
            marginRight: 0, 
            marginTop: 0, 
            borderColor: '#E5E5E5',
            color: '#1A1A1A',
          }}
          rows={5}
          disabled={jdUploadStatus === "uploading"}
        />
        
        {/* Bottom Left Button with Dropdown - Only show in AI job Search tab */}
        {isAISearchTab && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
            <div className="relative">
              <button
                ref={bottomButtonRef}
                onClick={() => setIsBottomButtonDropdownOpen(!isBottomButtonDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                style={{ border: 'none' }}
                aria-label="Options"
              >
                {selectedBottomOption ? (
                  <>
                    <selectedBottomOption.icon size={18} style={{ color: '#7c00ff' }} />
                    <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      {selectedBottomOption.label}
                    </span>
                  </>
                ) : (
                  <RiSearchLine size={18} />
                )}
                <RiArrowDownSLine size={16} style={{ color: '#1A1A1A' }} />
              </button>
              <SimpleDropdown
                isOpen={isBottomButtonDropdownOpen}
                onClose={() => setIsBottomButtonDropdownOpen(false)}
                dropdownRef={bottomButtonDropdownRef}
                items={[
                  { label: 'Globe view', icon: EarthFilled, onClick: () => setSelectedBottomOption({ label: 'Globe view', icon: EarthFilled }) },
                  { label: 'List view', icon: List, onClick: () => setSelectedBottomOption({ label: 'List view', icon: List }) },
                ]}
                selectedOption={selectedBottomOption}
                position={{ top: 'auto', bottom: '100%', left: '0', right: 'auto' }}
                width="200px"
              />
            </div>
          </div>
        )}

        {/* Save Job Button - Left Bottom Corner (only show when JD is loaded, but not in Chat with Resume tab) */}
        {jdUploadStatus === "loaded" && activeTab !== "analyze" && (
          <div className="absolute bottom-4 left-20 flex items-center gap-2 z-20">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
              style={{ boxSizing: 'content-box', border: 'none' }}
              onClick={() => {
                if (searchQuery.trim() && onSaveJD) {
                  onSaveJD(searchQuery);
                }
              }}
              aria-label="Save Job"
            >
              <RiSaveLine size={18} />
              <span>Save Job</span>
            </button>
          </div>
        )}
        {/* Filter Button - Show in AI job Search tab (both Globe and List view) */}
        {isAISearchTab && (
          <div className="absolute bottom-4 right-32 flex items-center gap-2 z-20">
            <div className="relative">
              <button
                ref={filterButtonRef}
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                style={{ border: 'none' }}
                aria-label="Filter"
              >
                {selectedFilterOption && selectedFilterOption.country === 'India' && (
                  <span style={{ fontSize: '18px' }}>🇮🇳</span>
                )}
                <Filter size={18} style={{ color: '#575757' }} />
                <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                  {selectedFilterOption ? (selectedFilterOption.state ? `${selectedFilterOption.state}` : selectedFilterOption.label) : 'Filter'}
                </span>
                <RiArrowDownSLine size={16} style={{ color: '#1A1A1A' }} />
              </button>
              <FilterDropdown
                isOpen={isFilterDropdownOpen}
                onClose={() => setIsFilterDropdownOpen(false)}
                dropdownRef={filterDropdownRef}
                selectedOption={selectedFilterOption}
                onSelect={(option) => setSelectedFilterOption(option)}
                position={{ top: 'auto', bottom: '100%', right: '0', left: 'auto' }}
                width="300px"
              />
            </div>
          </div>
        )}

        {/* Search Button - Always show in AI job Search tab, disabled until user types */}
        {isAISearchTab && (
          <button
            className={`absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md z-20 ${
              searchQuery.trim() 
                ? "bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]" 
                : "bg-[#E5E5E5] text-[#A5A5A5] cursor-not-allowed"
            }`}
            style={{
              opacity: searchQuery.trim() ? 1 : 0.55
            }}
            onClick={() => {
              if (searchQuery.trim()) {
                if (isGlobeView || (!isGlobeView && searchQuery.trim())) {
                  // In Globe view or List view with search query, trigger search
                  handleSearch();
                } else {
                  // In List view without search query, navigate to edit-resume
                  navigate("/edit-resume");
                }
              }
            }}
            disabled={!searchQuery.trim()}
            aria-label="Search"
          >
            <span className="text-sm font-medium">Search</span>
            <RiSearchLine size={18} />
          </button>
        )}
        
        {/* Proceed Button - Show when JD is loaded (not in AI job Search tab) */}
        {jdUploadStatus === "loaded" && !isAISearchTab && (
          <button
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-lg transition-colors hover:bg-[#1A1A1A] shadow-md z-20"
            onClick={() => {
              navigate("/edit-resume");
            }}
            aria-label="Proceed"
          >
            <span className="text-sm font-medium">Proceed</span>
            <RiArrowRightLine size={18} />
          </button>
        )}
      </div>
    </div>
  );

  // Check if we should show GlobeView (after location selected from filter and search clicked, or Globe view with location)
  const shouldShowGlobeView = (hasSearched && selectedFilterOption) || (isGlobeView && hasSearched && (selectedFilterOption || extractedLocation));
  
  // Check if search bar should be collapsed (after search in Globe view or when filter is selected and search clicked)
  const isSearchBarCollapsed = (isGlobeView && hasSearched) || (hasSearched && selectedFilterOption);

  // Notify parent when map view state changes
  useEffect(() => {
    if (onMapViewChange) {
      onMapViewChange(isSearchBarCollapsed && shouldShowGlobeView);
    }
  }, [isSearchBarCollapsed, shouldShowGlobeView, onMapViewChange]);

  // Collapsed layout: Show after search is clicked with Globe view or with filter selected
  if (isSearchBarCollapsed) {
    return (
      <>
        {/* Add style for placeholder color */}
        <style>{`
          textarea::placeholder {
            color: #A5A5A5 !important;
          }
        `}</style>
        <div className="w-full h-full" style={{ position: 'fixed', top: 0, left: '208px', right: 0, bottom: 0, height: '100vh', width: 'calc(100% - 208px)', margin: 0, padding: 0, zIndex: 0 }}>
          {/* Map - Full coverage of right side area, no padding */}
          {shouldShowGlobeView && (
            <div className="absolute inset-0" style={{ width: '100%', height: '100%', zIndex: 1, margin: 0, padding: 0 }}>
              <GlobeView 
                location={selectedFilterOption ? (selectedFilterOption.state ? `${selectedFilterOption.state}, ${selectedFilterOption.country}` : selectedFilterOption.country) : extractedLocation} 
                searchQuery={searchQuery} 
                hasSearched={hasSearched} 
              />
            </div>
          )}

          {/* Collapsed Search Bar - Overlay on top of map */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50" style={{ width: '90%', maxWidth: '800px' }}>
            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lg px-4 py-2" style={{ width: '100%' }}>
              <div className="flex items-center gap-3">
                {/* Selected view option */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedBottomOption ? (
                    <>
                      <selectedBottomOption.icon size={18} style={{ color: '#7c00ff' }} />
                      <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                        {selectedBottomOption.label}
                      </span>
                    </>
                  ) : (
                    <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                      List view
                    </span>
                  )}
                </div>
                {/* Search query - Editable input field */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && searchQuery.trim()) {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Search for keywords, product design, frontend developer..."
                  className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 border border-[#E5E5E5] focus:outline-none text-sm"
                  style={{ 
                    fontFamily: 'Open Sans', 
                    fontSize: '14px',
                    color: '#1A1A1A',
                    borderColor: '#E5E5E5',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#A5A5A5';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E5E5';
                  }}
                />
                <style>{`
                  input::placeholder {
                    color: #A5A5A5 !important;
                  }
                `}</style>
                {/* Filter button if location selected */}
                {selectedFilterOption && (
                  <div className="relative flex-shrink-0">
                    <button
                      ref={filterButtonRef}
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                      style={{ border: 'none' }}
                      aria-label="Filter"
                    >
                      {selectedFilterOption && selectedFilterOption.country === 'India' && (
                        <span style={{ fontSize: '16px' }}>🇮🇳</span>
                      )}
                      <Filter size={16} style={{ color: '#575757' }} />
                      <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '12px' }}>
                        {selectedFilterOption ? (selectedFilterOption.state ? `${selectedFilterOption.state}` : selectedFilterOption.label) : 'Filter'}
                      </span>
                    </button>
                    <FilterDropdown
                      isOpen={isFilterDropdownOpen}
                      onClose={() => setIsFilterDropdownOpen(false)}
                      dropdownRef={filterDropdownRef}
                      selectedOption={selectedFilterOption}
                      onSelect={(option) => setSelectedFilterOption(option)}
                      position={{ top: 'auto', bottom: '100%', right: '0', left: 'auto' }}
                      width="300px"
                    />
                  </div>
                )}
                {/* Return button - Reset to default state */}
                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSelectedFilterOption(null);
                    setExtractedLocation(null);
                    setSearchQuery("");
                    setSelectedBottomOption(null);
                  }}
                  className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5] flex-shrink-0"
                  aria-label="Return to default"
                  title="Return to default search"
                >
                  <Return size={20} style={{ color: '#575757' }} />
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Modal */}
          <FileUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onFileUpload={(file, text) => {
              handleFileSelect(file);
            }}
          />
        </div>
      </>
    );
  }

  // List view layout: current structure (unchanged)
  return (
    <>
      {/* Add style for placeholder color */}
      <style>{`
        textarea::placeholder {
          color: #A5A5A5 !important;
        }
      `}</style>
      <div className="w-full max-w-4xl mx-auto">
        {/* Search Bar Container */}
        {renderSearchBar()}

        {/* File Upload Modal */}
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onFileUpload={(file, text) => {
            handleFileSelect(file);
          }}
        />
      </div>
    </>
  );
}



