import { useNavigate } from "react-router-dom";
import { Reorder, useDragControls } from "framer-motion";
import {
  RiBriefcaseLine,
  RiGraduationCapLine,
  RiUserLine,
  RiDeleteBinLine,
  RiQuestionLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiArrowUpDownFill,
  RiAddLine,
} from "@remixicon/react";
import { ArrowLeft } from "@carbon/icons-react";

// Section Item Component with Drag Controls
function SectionItem({
  section,
  renderSectionForm,
  onAdd,
  isCollapsed,
  onToggleCollapse,
}) {
  const dragControls = useDragControls();
  const Icon = section.icon;

  const handleAddClick = () => {
    if (onAdd) {
      onAdd(section.id);
    }
  };

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(section.id);
    }
  };

  return (
    <Reorder.Item
      key={section.id}
      value={section}
      className="mb-4"
      dragListener={false}
      dragControls={dragControls}
      layout="position"
      initial={{ rotate: 0 }}
      animate={{ rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8,
      }}
      whileDrag={{
        scale: 1.02,
        rotate: 2,
        zIndex: 50,
      }}
    >
      {/* Header Section - Always Active, No Animation */}
      <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: '#F5F5F5', color: '#1A1A1A' }}>
        <div className="flex items-center space-x-3">
          <Icon size={16} style={{ color: '#575757' }} />
          <span style={{ fontFamily: 'Open Sans', fontWeight: 500, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.03em' }}>{section.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded"
            title="Help"
          >
            <RiQuestionLine size={16} style={{ color: '#575757' }} />
          </button>
          <button
            onClick={handleAddClick}
            className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded"
            title="Add new entry"
          >
            <RiAddLine size={16} style={{ color: '#575757' }} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded cursor-move"
            onPointerDown={(e) => {
              e.preventDefault();
              dragControls.start(e);
            }}
            title="Drag to reorder"
          >
            <RiArrowUpDownFill size={16} style={{ color: '#575757' }} />
          </button>
          <button
            onClick={handleToggleCollapse}
            className="text-gray-500 hover:text-gray-700 hover:bg-white p-1 rounded"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <RiArrowDownSLine size={16} style={{ color: '#575757' }} />
            ) : (
              <RiArrowUpSLine size={16} style={{ color: '#575757' }} />
            )}
          </button>
        </div>
      </div>

      {/* Form Section - Conditionally Rendered, Simple Show/Hide */}
      {!isCollapsed && <div>{renderSectionForm(section.id)}</div>}
    </Reorder.Item>
  );
}

export default function AISidebar({
  sections,
  setSections,
  resumeData: _resumeData,
  collapsedSections,
  handleToggleCollapse,
  handleAddEntry,
  renderSectionForm,
  showTabs = false,
  activeTab: _externalActiveTab,
  setActiveTab: _externalSetActiveTab,
  SummariseResumeContent: _SummariseResumeContent,
  CompareResumeContent: _CompareResumeContent,
  matchScore,
  currentScore,
  scoreChange,
  getScoreColor,
  getScoreTitle,
  initialScore: _initialScore,
}) {
  const navigate = useNavigate();

  // When showTabs is true, render without the outer container (used inside SummaryEdit)
  // Show only sections directly - no duplicate tabs
  if (showTabs) {
    return (
      <div className="flex flex-col h-full w-full">
        {/* Real-time Match Score Card - Sticky at top */}
        {matchScore !== null && currentScore !== undefined && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#F5F5F5"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke={getScoreColor ? getScoreColor(currentScore) : "#f59e0b"}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - currentScore / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ 
                        color: getScoreColor ? getScoreColor(currentScore) : "#f59e0b",
                        fontFamily: 'Open Sans'
                      }}>
                        {currentScore}%
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                    {getScoreTitle ? getScoreTitle(currentScore) : 'Match Score'}
                  </div>
                  {scoreChange > 0 && (
                    <div className="text-xs flex items-center gap-1" style={{ color: '#10b981', fontFamily: 'Open Sans' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        trending_up
                      </span>
                      +{scoreChange}%
                    </div>
                  )}
                  {currentScore < 100 && (
                    <div className="text-xs mt-1" style={{ color: '#575757', fontFamily: 'Open Sans' }}>
                      Add, edit, remove & rephrase to match JD
                    </div>
                  )}
                  {currentScore >= 100 && (
                    <div className="text-xs mt-1" style={{ color: '#10b981', fontFamily: 'Open Sans' }}>
                      Perfect match with JD!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Show sections directly - no tabs */}
        <div className="flex-1 overflow-y-auto thin-scrollbar">
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
                  onAdd={handleAddEntry}
                  isCollapsed={collapsedSections.has(section.id)}
                  onToggleCollapse={handleToggleCollapse}
                />
              ))}
            </Reorder.Group>
          </div>
        </div>
      </div>
    );
  }

  // Default view with header and sections (used in AIResume.jsx)
  return (
    <div className="w-full md:w-1/5 lg:w-[30%] bg-white border-t md:border-t-0 md:border-l md:border-r border-gray-200 flex-shrink-0 h-1/2 md:h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className="px-4 border-b border-gray-200 flex items-center justify-between"
          style={{ height: "65px" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "20px",
                color: "#575757",
                fontVariationSettings:
                  '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
              }}
            >
              auto_awesome
            </span>
            <h2 className="text-base font-bold" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
              AI Resume Optimizer
            </h2>
          </div>
          <button
            onClick={() => navigate("/manage-jds")}
            className="flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-[#F5F5F5]"
            title="Back to JDs"
          >
            <ArrowLeft
              size={20}
              style={{ color: "#575757" }}
            />
          </button>
        </div>

        {/* Sections */}
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={setSections}
          className="flex-1 p-4 space-y-4 overflow-y-auto"
        >
          {sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              renderSectionForm={renderSectionForm}
              onAdd={handleAddEntry}
              isCollapsed={collapsedSections.has(section.id)}
              onToggleCollapse={handleToggleCollapse}
            />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

