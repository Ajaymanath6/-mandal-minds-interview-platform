import { useState, useRef, useEffect, useCallback } from "react";
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
import { IbmWatsonDiscovery, Chat, IbmWatsonOpenscale, CheckmarkFilled, List, Grid, Earth, EarthFilled, TableOfContents, Filter, ArrowLeft, Return, SendFilled } from "@carbon/icons-react";
import FileUploadModal from "./FileUploadModal";
import SimpleDropdown from "./SimpleDropdown";
import GlobeView, { getCompaniesForLocation } from "./GlobeView";
import mockJobs from "../data/mockJobs.json";
import FilterDropdown from "./FilterDropdown";
import HomeLocationDropdown from "./HomeLocationDropdown";
import ListViewLayout from "../layouts/ListViewLayout";

export default function AISearchBar({
  onCompare,
  onSaveJD,
  onJDUploaded,
  externalJDFile,
  secondSidebarOpen = true,
  firstSidebarOpen = true,
  initialSearchQuery = null,
  initialViewMode = null,
}) {
  const [activeTab, setActiveTab] = useState("upload");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
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
  const [isHomeLocationDropdownOpen, setIsHomeLocationDropdownOpen] = useState(false);
  const [isHomeFilterActive, setIsHomeFilterActive] = useState(false); // Track if home filter is active (showing lines)
  // Default home location coordinates
  const [homeLocation, setHomeLocation] = useState({
    lat: 10.368495,
    lon: 76.219310,
    query: "Home",
    displayName: "Home"
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isFindingJobs, setIsFindingJobs] = useState(false);
  const [mapJourneyStep, setMapJourneyStep] = useState(0); // 0 = initial, 1 = show state, 2 = zoom to pincode
  const [currentMapLocation, setCurrentMapLocation] = useState(null);
  const [currentMapZoom, setCurrentMapZoom] = useState(10);
  const bottomButtonRef = useRef(null);
  const bottomButtonDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const homeLocationButtonRef = useRef(null);
  const homeLocationDropdownRef = useRef(null);
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

  // Kerala district to pincode mapping
  const keralaDistrictPincodes = {
    // Thiruvananthapuram
    'thiruvananthapuram': '695001',
    'trivandrum': '695001',
    'tvm': '695001',
    
    // Kollam
    'kollam': '691001',
    'quilon': '691001',
    
    // Pathanamthitta
    'pathanamthitta': '689101',
    'pathanamtitta': '689101',
    
    // Alappuzha
    'alappuzha': '688001',
    'alleppey': '688001',
    'alapuzha': '688001',
    
    // Kottayam
    'kottayam': '686001',
    
    // Idukki
    'idukki': '685602',
    
    // Ernakulam
    'kochi': '682001',
    'ernakulam': '682001',
    'cochin': '682001',
    'ekm': '682001',
    
    // Thrissur
    'thrissur': '680001',
    'trichur': '680001',
    'trissur': '680001',
    
    // Palakkad
    'palakkad': '678001',
    'palghat': '678001',
    'palakad': '678001',
    
    // Malappuram
    'malappuram': '676505',
    'malapuram': '676505',
    
    // Kozhikode
    'kozhikode': '673001',
    'calicut': '673001',
    
    // Wayanad
    'wayanad': '673121',
    'waynad': '673121',
    
    // Kannur
    'kannur': '670001',
    'cannanore': '670001',
    'kanur': '670001',
    
    // Kasaragod
    'kasaragod': '671121',
    'kasargod': '671121',
    'kasargode': '671121',
  };

  // Karnataka district to pincode mapping
  const karnatakaDistrictPincodes = {
    // Bengaluru Urban
    'bengaluru': '560001',
    'bangalore': '560001',
    'bengaluru urban': '560001',
    'bangalore urban': '560001',
    'blr': '560001',
    
    // Bengaluru Rural
    'bengaluru rural': '562111',
    'bangalore rural': '562111',
    
    // Mysuru
    'mysuru': '570001',
    'mysore': '570001',
    
    // Mangaluru (Dakshina Kannada)
    'mangaluru': '575001',
    'mangalore': '575001',
    'dakshina kannada': '575001',
    'dakshina kannad': '575001',
    
    // Udupi
    'udupi': '576101',
    
    // Hubballi-Dharwad
    'hubballi': '580001',
    'hubli': '580001',
    'dharwad': '580001',
    'hubballi-dharwad': '580001',
    'hubli-dharwad': '580001',
    
    // Belagavi
    'belagavi': '590001',
    'belgaum': '590001',
    
    // Kalaburagi (Gulbarga)
    'kalaburagi': '585101',
    'gulbarga': '585101',
    
    // Ballari
    'ballari': '583101',
    'bellary': '583101',
    
    // Tumakuru
    'tumakuru': '572101',
    'tumkur': '572101',
    
    // Shivamogga
    'shivamogga': '577201',
    'shimoga': '577201',
    
    // Hassan
    'hassan': '573201',
    
    // Mandya
    'mandya': '571401',
    
    // Vijayapura (Bijapur)
    'vijayapura': '586101',
    'bijapur': '586101',
    
    // Bagalkote
    'bagalkote': '587101',
    'bagalkot': '587101',
    
    // Raichur
    'raichur': '584101',
    
    // Bidar
    'bidar': '585401',
    
    // Chikkamagaluru
    'chikkamagaluru': '577101',
    'chikmagalur': '577101',
    'chikmagaluru': '577101',
    
    // Davangere
    'davangere': '577001',
    'davanagere': '577001',
    
    // Uttara Kannada (Karwar)
    'uttara kannada': '581301',
    'karwar': '581301',
    'uttar kannada': '581301',
  };

  // Extract location from search query - supports "in [City]" pattern and direct district/pincode search
  const extractLocation = (query) => {
    if (!query || !query.trim()) return null;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check for 6-digit pincode pattern first
    const pincodePattern = /\b\d{6}\b/;
    const pincodeMatch = query.match(pincodePattern);
    if (pincodeMatch) {
      return pincodeMatch[0];
    }
    
    // Helper function to find matching district
    const findMatchingDistrict = (districtMap, queryText) => {
      for (const [district] of Object.entries(districtMap)) {
        const normalizedDistrict = district.toLowerCase();
        // Check for exact match or if district name appears in query (or vice versa)
        if (normalizedDistrict === queryText || 
            queryText.includes(normalizedDistrict) || 
            normalizedDistrict.includes(queryText) ||
            district.split(' ').some(word => queryText.includes(word.toLowerCase()) || word.toLowerCase().includes(queryText))) {
          // Return properly capitalized district name
          return district.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
        }
      }
      return null;
    };
    
    // First, try "in [City]" pattern (case-insensitive)
    const inPattern = /\bin\s+([A-Za-z\s]+)/i;
    const inMatch = query.match(inPattern);
    
    if (inMatch && inMatch[1]) {
      const location = inMatch[1].trim();
      const normalizedLocation = location.toLowerCase().trim();
      
      // Check if this location matches a known district
      if (selectedFilterOption && selectedFilterOption.country === 'India') {
        const selectedState = selectedFilterOption.state;
        
        // Check Kerala districts
        if (selectedState === 'Kerala' || (!selectedState && selectedFilterOption.country === 'India')) {
          const matchedDistrict = findMatchingDistrict(keralaDistrictPincodes, normalizedLocation);
          if (matchedDistrict) {
            return matchedDistrict;
          }
        }
        
        // Check Karnataka districts
        if (selectedState === 'Karnataka' || (!selectedState && selectedFilterOption.country === 'India')) {
          const matchedDistrict = findMatchingDistrict(karnatakaDistrictPincodes, normalizedLocation);
          if (matchedDistrict) {
            return matchedDistrict;
          }
        }
      }
      
      // Return the location as-is if no district match found
      return location;
    }
    
    // If no "in" pattern found, check if the query itself contains a district name
    if (selectedFilterOption && selectedFilterOption.country === 'India') {
      const selectedState = selectedFilterOption.state;
      
      // Check Kerala districts directly in query
      if (selectedState === 'Kerala' || (!selectedState && selectedFilterOption.country === 'India')) {
        const matchedDistrict = findMatchingDistrict(keralaDistrictPincodes, normalizedQuery);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:296',message:'Kerala district check',data:{query,normalizedQuery,matchedDistrict,selectedState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (matchedDistrict) {
          return matchedDistrict;
        }
      }
      
      // Check Karnataka districts directly in query
      if (selectedState === 'Karnataka' || (!selectedState && selectedFilterOption.country === 'India')) {
        const matchedDistrict = findMatchingDistrict(karnatakaDistrictPincodes, normalizedQuery);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:304',message:'Karnataka district check',data:{query,normalizedQuery,matchedDistrict,selectedState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        if (matchedDistrict) {
          return matchedDistrict;
        }
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:311',message:'extractLocation returning null',data:{query,normalizedQuery,hasSelectedFilter:!!selectedFilterOption,selectedState:selectedFilterOption?.state},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return null;
  };

  // Get pincode for state districts (state-aware to avoid cross-state matches)
  const getStatePincode = (location) => {
    if (!location || !selectedFilterOption) return null;
    
    // Must have India selected
    if (selectedFilterOption.country !== 'India') return null;
    
    const selectedState = selectedFilterOption.state;
    const normalizedLocation = location.toLowerCase().trim();
    
    // Check if location is a pincode (6-digit number)
    if (/^\d{6}$/.test(normalizedLocation)) {
      // If it's a pincode, try to find which state it belongs to
      // Check Kerala districts first
      for (const [district, pincode] of Object.entries(keralaDistrictPincodes)) {
        if (pincode === normalizedLocation) {
          // If state is explicitly set, it must match
          if (selectedState && selectedState !== 'Kerala') return null;
          return { pincode, state: 'Kerala' };
        }
      }
      // Check Karnataka districts
      for (const [district, pincode] of Object.entries(karnatakaDistrictPincodes)) {
        if (pincode === normalizedLocation) {
          // If state is explicitly set, it must match
          if (selectedState && selectedState !== 'Karnataka') return null;
          return { pincode, state: 'Karnataka' };
        }
      }
      // If pincode found but no state match, return null
      return null;
    }
    
    // Check Kerala districts - if Kerala state is selected OR no state selected (check both)
    if (selectedState === 'Kerala' || (!selectedState && selectedFilterOption.country === 'India')) {
      for (const [district, pincode] of Object.entries(keralaDistrictPincodes)) {
        // More flexible matching: exact match, contains, or district contains location
        if (normalizedLocation === district || 
            normalizedLocation.includes(district) || 
            district.includes(normalizedLocation) ||
            district.split(' ').some(word => normalizedLocation.includes(word) || word.includes(normalizedLocation))) {
          // Double check: if state is explicitly set, it must be Kerala
          if (selectedState && selectedState !== 'Kerala') return null;
          return { pincode, state: 'Kerala' };
        }
      }
    }
    
    // Check Karnataka districts - if Karnataka state is selected OR no state selected (check both)
    if (selectedState === 'Karnataka' || (!selectedState && selectedFilterOption.country === 'India')) {
      for (const [district, pincode] of Object.entries(karnatakaDistrictPincodes)) {
        // More flexible matching: exact match, contains, or district contains location
        if (normalizedLocation === district || 
            normalizedLocation.includes(district) || 
            district.includes(normalizedLocation) ||
            district.split(' ').some(word => normalizedLocation.includes(word) || word.includes(normalizedLocation))) {
          // Double check: if state is explicitly set, it must be Karnataka
          if (selectedState && selectedState !== 'Karnataka') return null;
          return { pincode, state: 'Karnataka' };
        }
      }
    }
    
    return null;
  };

  const handleSearch = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:389',message:'handleSearch called',data:{searchQuery,hasSearched,extractedLocation,selectedBottomOption:selectedBottomOption?.label},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (!searchQuery.trim()) return;

    // Check if Globe view is selected
    const isGlobeView = selectedBottomOption && selectedBottomOption.label === 'Globe view';
    
    if (isGlobeView) {
      // Show loading state
      setIsMapLoading(true);
      setHasSearched(true);
      setMapJourneyStep(0);
      
      // Extract location from search query
      const location = extractLocation(searchQuery);
      setExtractedLocation(location);
      
      // Check if we have a pincode for journey animation
      const pincodeData = getStatePincode(location);
      const pincode = pincodeData ? pincodeData.pincode : null;
      
      // Check if we have a state selected for animation
      const hasState = selectedFilterOption && selectedFilterOption.state;
      
      // Keep isMapLoading true - GlobeView will call onLoadingComplete when done
      if ((pincode || location) && selectedFilterOption && hasState) {
        // Journey animation: Step 1 - Show state first
        setTimeout(() => {
          setMapJourneyStep(1);
          // Show state with medium zoom
          const stateLocation = selectedFilterOption.state 
            ? `${selectedFilterOption.state}, ${selectedFilterOption.country}`
            : selectedFilterOption.country;
          setCurrentMapLocation(stateLocation);
          setCurrentMapZoom(8);
          
          // Step 2 - After 2 seconds, zoom to specific location
          setTimeout(() => {
            setMapJourneyStep(2);
            if (pincode) {
              const pincodeData = getStatePincode(location);
              const stateName = pincodeData ? pincodeData.state : (selectedFilterOption.state || 'Kerala');
              const districtName = location ? location.charAt(0).toUpperCase() + location.slice(1).toLowerCase() : (stateName === 'Kerala' ? 'Ernakulam' : 'Bengaluru');
              setCurrentMapLocation(`${pincode}, ${districtName}, ${stateName}, India`);
            } else if (location) {
              // For non-pincode locations, combine with state
              const finalLocation = `${location}, ${selectedFilterOption.state}, ${selectedFilterOption.country}`;
              setCurrentMapLocation(finalLocation);
            }
            setCurrentMapZoom(14);
          }, 2000);
        }, 1500);
      } else {
        // No journey animation, just show map
        setTimeout(() => {
          setMapJourneyStep(2);
        }, 1500);
      }
    } else {
      // List view: trigger comparison as before
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:437',message:'List view handleSearch entry',data:{searchQuery,selectedBottomOption:selectedBottomOption?.label,selectedFilterOption:selectedFilterOption?.state||selectedFilterOption?.country},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setHasSearched(true);
      // Extract location from search query for list view
      const location = extractLocation(searchQuery);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:441',message:'Location extracted and setting state',data:{searchQuery,extractedLocation:location,settingHasSearched:true},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      setExtractedLocation(location);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:445',message:'State set complete',data:{hasSearchedSet:true,extractedLocationSet:location},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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

  // Initialize with default search when navigating from "Jobs Near You"
  useEffect(() => {
    if (initialSearchQuery && initialViewMode === 'globe' && !hasSearched) {
      // Set Globe view
      setSelectedBottomOption({ label: 'Globe view', icon: EarthFilled });
      // Set Kerala filter for Kochi (Kochi is in Kerala)
      setSelectedFilterOption({ 
        state: 'Kerala', 
        country: 'India',
        label: 'Kerala, India'
      });
      // Trigger search after state is set
      const timer = setTimeout(() => {
        // Use the searchQuery state which should already be set from initialSearchQuery prop
        if (searchQuery.trim()) {
          handleSearch();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchQuery, initialViewMode]); // Only run when these props change

  // Update extracted location when switching to Globe view or when searchQuery changes in Globe view
  useEffect(() => {
    const isGlobeView = selectedBottomOption && selectedBottomOption.label === 'Globe view';
    if (isGlobeView && searchQuery) {
      const location = extractLocation(searchQuery);
      setExtractedLocation(location);
    } else if (!isGlobeView && !hasSearched) {
      // Clear extracted location only when switching away from Globe view AND no search has been performed
      // Don't clear if user has already searched in List view (preserve the location for list display)
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

  // Check if we should show GlobeView - only when Globe view is selected
  const shouldShowGlobeView = isGlobeView && hasSearched && (selectedFilterOption || extractedLocation);
  
  // Check if search bar should be collapsed (after search in Globe view or when filter is selected and search clicked)
  const isSearchBarCollapsed = (isGlobeView && hasSearched) || (hasSearched && selectedFilterOption);
  
  // Stable callbacks for GlobeView to prevent loops
  const handleLoadingComplete = useCallback(() => {
    setIsMapLoading(false);
    setIsFindingJobs(false);
  }, []);
  
  const handleFindingJobsStart = useCallback(() => {
    setIsMapLoading(false);
    setIsFindingJobs(true);
  }, []);

  // Collapsed layout: Show after search is clicked with Globe view or with filter selected
  if (isSearchBarCollapsed) {
    // Calculate left offset based on sidebar states
    // First sidebar: 208px (w-52) + 1px border = 209px when open, 64px (w-16) + 1px border = 65px when collapsed
    // Second sidebar: 220px when open + 1px border = 221px
    const firstSidebarWidth = firstSidebarOpen ? 209 : 65;
    const secondSidebarWidth = secondSidebarOpen ? 221 : 0;
    const totalWidth = firstSidebarWidth + secondSidebarWidth;
    const leftOffset = `${totalWidth}px`;
    const widthCalc = `calc(100% - ${totalWidth}px)`;
    
    return (
      <>
        {/* Add style for placeholder color */}
        <style>{`
          textarea::placeholder {
            color: #A5A5A5 !important;
          }
        `}</style>
        <div className="w-full h-full" style={{ position: 'fixed', top: 0, left: leftOffset, right: 0, bottom: 0, height: '100vh', width: widthCalc, margin: 0, padding: 0, zIndex: 0 }}>
          {/* Loading State */}
          {(isMapLoading || isFindingJobs) && (
            <div 
              className="absolute inset-0 flex items-center justify-center z-10" 
              style={{ 
                width: '100%', 
                height: '100%', 
                zIndex: 2,
                backgroundColor: isFindingJobs ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 1)',
                backdropFilter: isFindingJobs ? 'blur(2px)' : 'none'
              }}
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-base font-medium text-[#1A1A1A]" style={{ fontFamily: 'Open Sans' }}>
                  {isFindingJobs ? 'Finding jobs...' : 'Loading map...'}
                </p>
              </div>
            </div>
          )}

          {/* Map - Full coverage of right side area, no padding */}
          {shouldShowGlobeView && (
            <div className="absolute inset-0" style={{ width: '100%', height: '100%', zIndex: 1, margin: 0, padding: 0 }}>
              <GlobeView 
                location={(() => {
                  // Check if we should use pincode for state districts
                  const pincodeData = getStatePincode(extractedLocation);
                  const pincode = pincodeData ? pincodeData.pincode : null;
                  const stateName = pincodeData ? pincodeData.state : null;
                  
                  // Journey animation logic - only use journey steps if pincode exists
                  if (pincode && selectedFilterOption && stateName) {
                    // Step 1: Show state (after loading, before zooming to pincode)
                    if (mapJourneyStep === 1) {
                      return currentMapLocation || (selectedFilterOption.state 
                        ? `${selectedFilterOption.state}, ${selectedFilterOption.country}`
                        : selectedFilterOption.country);
                    }
                    
                    // Step 2: Show pincode location (final destination)
                    if (mapJourneyStep === 2) {
                      const districtName = extractedLocation ? extractedLocation.charAt(0).toUpperCase() + extractedLocation.slice(1).toLowerCase() : (stateName === 'Kerala' ? 'Ernakulam' : 'Bengaluru');
                      return currentMapLocation || `${pincode}, ${districtName}, ${stateName}, India`;
                    }
                    
                    // Step 0 or initial: Show state first (this will be shown immediately after loading)
                    // This ensures we see the state before the journey animation starts
                    const stateLocation = selectedFilterOption.state 
                      ? `${selectedFilterOption.state}, ${selectedFilterOption.country}`
                      : selectedFilterOption.country;
                    return stateLocation;
                  }
                  
                  // No journey animation - combine filter location with search query location
                  let finalLocation = '';
                  
                  if (selectedFilterOption) {
                    if (selectedFilterOption.state) {
                      // State + Country from filter
                      finalLocation = `${selectedFilterOption.state}, ${selectedFilterOption.country}`;
                    } else {
                      // Just Country from filter
                      finalLocation = selectedFilterOption.country;
                    }
                    
                    // Add search query location if available
                    if (extractedLocation) {
                      finalLocation = `${extractedLocation}, ${finalLocation}`;
                    }
                  } else if (extractedLocation) {
                    // Just search query location
                    finalLocation = extractedLocation;
                  }
                  
                  return finalLocation;
                })()}
                searchQuery={searchQuery} 
                hasSearched={hasSearched}
                journeyStep={(() => {
                  // Pass journey step to GlobeView for animation control
                  // Enable animation if we have a state selected and a location
                  if (selectedFilterOption && selectedFilterOption.state && extractedLocation) {
                    return mapJourneyStep;
                  }
                  return null;
                })()}
                zoom={(() => {
                  // Check if using pincode (state district)
                  const pincodeData = getStatePincode(extractedLocation);
                  const pincode = pincodeData ? pincodeData.pincode : null;
                  
                  // Journey animation logic - only use journey steps if pincode exists
                  if (pincode && selectedFilterOption) {
                    // Step 1: Show state with medium zoom
                    if (mapJourneyStep === 1) {
                      return currentMapZoom || 8;
                    }
                    
                    // Step 2: Zoom to pincode (close-up)
                    if (mapJourneyStep === 2) {
                      return currentMapZoom || 14;
                    }
                    
                    // Step 0 or initial: Show state with medium zoom first
                    return 8;
                  }
                  
                  // Determine zoom level based on specificity
                  if (selectedFilterOption?.state && extractedLocation) {
                    // City + State = most specific, zoom in more
                    return 13;
                  } else if (selectedFilterOption?.state) {
                    // Just State = medium zoom
                    return 8;
                  } else if (selectedFilterOption?.country && extractedLocation) {
                    // City + Country = medium-high zoom
                    return 11;
                  } else if (selectedFilterOption?.country) {
                    // Just Country = zoom out
                    return 6;
                  } else if (extractedLocation) {
                    // Just city from search = medium zoom
                    return 12;
                  }
                  // Default zoom
                  return 10;
                })()}
                key={`${mapJourneyStep}-${currentMapLocation}-${currentMapZoom}`}
                onLoadingComplete={handleLoadingComplete}
                onFindingJobsStart={handleFindingJobsStart}
                homeLocation={homeLocation}
                showHomeLines={isHomeFilterActive}
              />
            </div>
          )}

{(() => {
          // #region agent log
          const conditionResult = !isGlobeView && hasSearched && extractedLocation;
          const companies = extractedLocation ? getCompaniesForLocation(extractedLocation) : [];
          fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:1226',message:'List view render condition check',data:{isGlobeView,hasSearched,extractedLocation,conditionResult,companiesCount:companies.length,selectedBottomOption:selectedBottomOption?.label},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          return !isGlobeView && hasSearched && extractedLocation ? (
            <ListViewLayout 
              companies={companies}
              extractedLocation={extractedLocation}
              searchQuery={searchQuery}
            />
          ) : null;
        })()}

          {/* Collapsed Search Bar and Distance Button - Grouped together, only in Globe view */}
          {isGlobeView && hasSearched && (
            <div 
              className={`absolute left-1/2 transform -translate-x-1/2 z-50 flex items-center ${!isGlobeView && hasSearched ? 'bottom-4' : 'top-4'}`} 
              style={{ gap: '24px' }}
            >
              {/* Collapsed Search Bar */}
              <div style={{ width: '90%', maxWidth: '800px' }}>
                <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lg px-4 py-2" style={{ width: '100%' }}>
                  <div className="flex items-center gap-3">
                    {/* Selected view option with dropdown - Show in both Globe and List view */}
                    {hasSearched ? (
                      <div className="relative flex-shrink-0">
                        <button
                          ref={bottomButtonRef}
                          onClick={() => setIsBottomButtonDropdownOpen(!isBottomButtonDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                          style={{ border: 'none' }}
                          aria-label="View options"
                        >
                          {selectedBottomOption ? (
                            <>
                              <selectedBottomOption.icon size={18} style={{ color: '#7c00ff' }} />
                              <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                                {selectedBottomOption.label}
                              </span>
                            </>
                          ) : (
                            <>
                              {isGlobeView ? (
                                <>
                                  <EarthFilled size={18} style={{ color: '#7c00ff' }} />
                                  <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                                    Globe view
                                  </span>
                                </>
                              ) : (
                                <>
                                  <List size={18} style={{ color: '#7c00ff' }} />
                                  <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                                    List view
                                  </span>
                                </>
                              )}
                            </>
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
                          position={isGlobeView ? { top: '100%', bottom: 'auto', left: '0', right: 'auto', marginTop: '8px' } : { top: 'auto', bottom: '100%', left: '0', right: 'auto', marginBottom: '8px' }}
                          width="200px"
                        />
                      </div>
                    ) : (
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
                            {isGlobeView ? 'Globe view' : 'List view'}
                          </span>
                        )}
                      </div>
                    )}
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
                      className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#7c00ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] hover:bg-[#F5F5F5] transition-all text-sm"
                      style={{ 
                        fontFamily: 'Open Sans', 
                        fontSize: '14px',
                        color: '#1A1A1A',
                        boxShadow: '0_1px_6px_rgba(32,33,36,0.08)',
                      }}
                    />
                    <style>{`
                      input::placeholder {
                        color: #A5A5A5 !important;
                      }
                    `}</style>
                    {/* Search button - SendFilled icon with brand color */}
                    <button
                      onClick={() => {
                        if (searchQuery.trim()) {
                          handleSearch();
                        }
                      }}
                      disabled={!searchQuery.trim()}
                      className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Search"
                      title="Search"
                    >
                      <SendFilled size={20} style={{ color: searchQuery.trim() ? '#7c00ff' : '#A5A5A5' }} />
                    </button>
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
                          position={isGlobeView ? { top: '100%', bottom: 'auto', right: '0', left: 'auto', marginTop: '8px' } : { top: 'auto', bottom: '100%', right: '0', left: 'auto', marginBottom: '8px' }}
                          width="300px"
                        />
                      </div>
                    )}
                    {/* Return button - Go back to search bar (preserve state) */}
                    <button
                      onClick={() => {
                        // Only reset the collapsed view, preserve search query and filter
                        setHasSearched(false);
                        // Keep searchQuery, selectedFilterOption, extractedLocation, selectedBottomOption
                        // This will show the expanded search bar with the preserved search query
                      }}
                      className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5] flex-shrink-0"
                      aria-label="Return to search bar"
                      title="Return to search bar"
                    >
                      <Return size={20} style={{ color: '#575757' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Home Filter Button */}
              <div className="relative">
                <button
                  ref={homeLocationButtonRef}
                  onClick={() => {
                    if (!isHomeFilterActive) {
                      // First click: Immediately show lines (home location already set by default)
                      setIsHomeFilterActive(true);
                    } else {
                      // Second click: Toggle off the lines
                      setIsHomeFilterActive(false);
                    }
                  }}
                  onContextMenu={(e) => {
                    // Right click: Open dropdown to edit home location
                    e.preventDefault();
                    setIsHomeLocationDropdownOpen(!isHomeLocationDropdownOpen);
                  }}
                  className={`flex items-center gap-2 px-4 rounded-xl text-sm font-medium transition-all shadow-lg border ${
                    isHomeFilterActive 
                      ? 'bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#F5F5F5] border-[#E5E5E5]' 
                      : 'bg-white text-[#1A1A1A] hover:bg-[#F5F5F5] border-[#E5E5E5]'
                  }`}
                  style={{ fontFamily: 'Open Sans', height: '56px', whiteSpace: 'nowrap' }}
                  aria-label="Home Location"
                >
                  <span style={{ fontSize: '16px' }}>🏠</span>
                  <span style={{ fontFamily: 'Open Sans', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {isHomeFilterActive ? 'Hide Distance' : 'Show Distance'}
                  </span>
                </button>
                <HomeLocationDropdown
                  isOpen={isHomeLocationDropdownOpen}
                  onClose={() => setIsHomeLocationDropdownOpen(false)}
                  dropdownRef={homeLocationDropdownRef}
                  homeLocation={homeLocation}
                  onSelect={(location) => {
                    setHomeLocation(location);
                    setIsHomeFilterActive(true); // Activate when location is set
                    setIsHomeLocationDropdownOpen(false);
                  }}
                  position={{ top: '100%', bottom: 'auto', right: '0', left: 'auto', marginTop: '8px' }}
                  width="300px"
                />
              </div>
            </div>
          )}

          {/* Collapsed Search Bar - Overlay on top of map (Globe view) or bottom (List view) - Only show when NOT in Globe view or when Globe view but not searched */}
          {(!isGlobeView || !hasSearched) && (
            <div 
              className={`absolute left-1/2 transform -translate-x-1/2 z-50 ${!isGlobeView && hasSearched ? 'bottom-4' : 'top-4'}`} 
              style={{ width: '90%', maxWidth: '800px' }}
            >
            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lg px-4 py-2" style={{ width: '100%' }}>
              <div className="flex items-center gap-3">
                {/* Selected view option with dropdown - Show in both Globe and List view */}
                {hasSearched ? (
                  <div className="relative flex-shrink-0">
                    <button
                      ref={bottomButtonRef}
                      onClick={() => setIsBottomButtonDropdownOpen(!isBottomButtonDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
                      style={{ border: 'none' }}
                      aria-label="View options"
                    >
                      {selectedBottomOption ? (
                        <>
                          <selectedBottomOption.icon size={18} style={{ color: '#7c00ff' }} />
                          <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                            {selectedBottomOption.label}
                          </span>
                        </>
                      ) : (
                        <>
                          {isGlobeView ? (
                            <>
                              <EarthFilled size={18} style={{ color: '#7c00ff' }} />
                              <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                                Globe view
                              </span>
                            </>
                          ) : (
                            <>
                              <List size={18} style={{ color: '#7c00ff' }} />
                              <span style={{ color: '#1A1A1A', fontFamily: 'Open Sans', fontSize: '14px' }}>
                                List view
                              </span>
                            </>
                          )}
                        </>
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
                      position={isGlobeView ? { top: '100%', bottom: 'auto', left: '0', right: 'auto', marginTop: '8px' } : { top: 'auto', bottom: '100%', left: '0', right: 'auto', marginBottom: '8px' }}
                      width="200px"
                    />
                  </div>
                ) : (
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
                        {isGlobeView ? 'Globe view' : 'List view'}
                      </span>
                    )}
                  </div>
                )}
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
                  className="flex-1 min-w-0 bg-white rounded-lg px-3 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#7c00ff] focus:shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)] hover:bg-[#F5F5F5] transition-all text-sm"
                  style={{ 
                    fontFamily: 'Open Sans', 
                    fontSize: '14px',
                    color: '#1A1A1A',
                    boxShadow: '0_1px_6px_rgba(32,33,36,0.08)',
                  }}
                />
                <style>{`
                  input::placeholder {
                    color: #A5A5A5 !important;
                  }
                `}</style>
                {/* Search button - SendFilled icon with brand color */}
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      handleSearch();
                    }
                  }}
                  disabled={!searchQuery.trim()}
                  className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Search"
                  title="Search"
                >
                  <SendFilled size={20} style={{ color: searchQuery.trim() ? '#7c00ff' : '#A5A5A5' }} />
                </button>
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
                      position={isGlobeView ? { top: '100%', bottom: 'auto', right: '0', left: 'auto', marginTop: '8px' } : { top: 'auto', bottom: '100%', right: '0', left: 'auto', marginBottom: '8px' }}
                      width="300px"
                    />
                  </div>
                )}
                {/* Return button - Go back to search bar (preserve state) */}
                <button
                  onClick={() => {
                    // Only reset the collapsed view, preserve search query and filter
                    setHasSearched(false);
                    // Keep searchQuery, selectedFilterOption, extractedLocation, selectedBottomOption
                    // This will show the expanded search bar with the preserved search query
                  }}
                  className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5] flex-shrink-0"
                  aria-label="Return to search bar"
                  title="Return to search bar"
                >
                  <Return size={20} style={{ color: '#575757' }} />
                </button>
              </div>
            </div>
          </div>
          )}

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

        {/* List View - Show companies when List view is selected and search is done */}
        {(() => {
          // #region agent log
          const conditionResult = !isGlobeView && hasSearched && extractedLocation;
          const companies = extractedLocation ? getCompaniesForLocation(extractedLocation) : [];
          fetch('http://127.0.0.1:7242/ingest/4864df2a-28d6-48bd-b6d5-087622789fe4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AISearchBar.jsx:1226',message:'List view render condition check',data:{isGlobeView,hasSearched,extractedLocation,conditionResult,companiesCount:companies.length,selectedBottomOption:selectedBottomOption?.label},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          return !isGlobeView && hasSearched && extractedLocation ? (
            <ListViewLayout 
              companies={companies}
              extractedLocation={extractedLocation}
              searchQuery={searchQuery}
            />
          ) : null;
        })()}
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



