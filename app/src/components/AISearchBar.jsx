import { useState } from "react";
import {
  RiSearchLine,
  RiFileTextLine,
  RiUploadLine,
  RiBookmarkLine,
  RiBarChartBoxLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiSaveLine,
} from "@remixicon/react";

export default function AISearchBar({
  onSearch,
  onCompare,
  savedJDs = [],
  onSaveJD,
}) {
  const [activeTab, setActiveTab] = useState("compare");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const tabs = [
    {
      id: "compare",
      label: "Compare with JD",
      icon: RiSearchLine,
    },
    {
      id: "analyze",
      label: "Analyze Resume",
      icon: RiFileTextLine,
    },
    {
      id: "match",
      label: "Match Score",
      icon: RiBarChartBoxLine,
    },
    {
      id: "upload",
      label: "Upload JD",
      icon: RiUploadLine,
    },
    {
      id: "saved",
      label: "Saved Comparisons",
      icon: RiBookmarkLine,
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Trigger comparison
    if (onCompare) {
      onCompare(searchQuery);
    }

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Bar Container */}
      <div className="bg-[#F5F5F5] rounded-xl border border-[#E5E5E5] shadow-sm pt-[23px] pb-[23px] px-6">
        {/* Tabs - Inside search bar at the top */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isMatchTab = tab.id === "match";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#0A0A0A] text-white shadow-md"
                    : "bg-transparent text-[#1A1A1A] hover:bg-[#F5F5F5]"
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isMatchTab && (
                  <RiArrowRightLine size={16} className="ml-1" />
                )}
              </button>
            );
          })}
        </div>
        {/* Search Input Area */}
        <div className="relative">
          <textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              activeTab === "compare"
                ? "Paste job description here and press Enter to compare with your resume..."
                : activeTab === "analyze"
                ? "Ask questions about your resume or get analysis..."
                : activeTab === "match"
                ? "Enter job description to see match score..."
                : activeTab === "upload"
                ? "Paste or type job description to upload..."
                : "Search your saved comparisons..."
            }
            className="w-full min-h-[140px] px-4 py-4 pr-12 text-gray-900 bg-white border-0 rounded-lg focus:outline-none resize-none placeholder:text-[#A5A5A5] text-base"
            rows={5}
          />
          {/* Save Job Button - Left Bottom Corner */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-transparent text-[#A5A5A5] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]"
              style={{ boxSizing: 'content-box' }}
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
          {/* Back Arrow Button */}
          <button
            className="absolute bottom-4 right-4 p-2 bg-[#0A0A0A] text-white rounded-lg transition-colors hover:bg-[#1A1A1A] shadow-md"
            onClick={() => {
              // Add back navigation logic here if needed
              setSearchQuery("");
            }}
            aria-label="Back"
          >
            <RiArrowRightLine size={20} />
          </button>
        </div>
      </div>

      {/* Saved JDs Quick Access */}
      {savedJDs.length > 0 && activeTab === "saved" && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Your Saved Job Descriptions
          </h3>
          <div className="grid gap-3">
            {savedJDs.map((jd, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSearchQuery(jd.content || jd);
                  setActiveTab("compare");
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {jd.title || `JD ${index + 1}`}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {jd.content || jd}
                    </p>
                  </div>
                  <RiArrowRightLine
                    size={20}
                    className="text-gray-400 ml-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

