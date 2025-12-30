import React, { useEffect } from "react";
import { Close } from "@carbon/icons-react";

/**
 * CompanyDetailsDrawer Component
 * Slide-in drawer from right (desktop) or bottom (mobile)
 * Shows company details and job listings with Apply buttons
 */
export default function CompanyDetailsDrawer({
  isOpen,
  onClose,
  company = null,
}) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !company) {
    return null;
  }

  const jobCount = company.jobs?.length || 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[2000] transition-opacity duration-300"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        className={`fixed h-full w-full sm:w-96 bg-white shadow-2xl z-[2001] transform transition-transform duration-300 ease-out overflow-y-auto rounded-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          fontFamily: "Open Sans",
          top: "92px", // 92px margin from top (78px + 14px)
          right: "16px", // 16px margin from right
          bottom: "16px", // 16px margin from bottom
          height: "calc(100% - 92px - 16px)", // Adjust height to account for top and bottom margins
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2
            className="text-lg font-semibold"
            style={{ color: "#1A1A1A" }}
          >
            Company Details
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
            style={{ color: "#575757" }}
            title="Close"
          >
            <Close size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Company Info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {company.logoUrl && (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-16 h-16 rounded-lg object-contain border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: "#1A1A1A" }}
                >
                  {company.name}
                </h3>
                <p className="text-sm" style={{ color: "#575757" }}>
                  {company.address}
                </p>
              </div>
            </div>
          </div>

          {/* Jobs Section */}
          <div>
            <h4
              className="text-base font-semibold mb-4"
              style={{ color: "#1A1A1A" }}
            >
              Open Positions ({jobCount})
            </h4>

            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-4">
                {company.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg p-4 transition-colors"
                  >
                    <div className="mb-3">
                      <h5
                        className="text-base font-semibold mb-2"
                        style={{ color: "#1A1A1A" }}
                      >
                        {job.title}
                      </h5>
                      {job.description && (
                        <p
                          className="text-sm mb-3"
                          style={{ color: "#575757" }}
                        >
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {job.type && (
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: "#F5F5F5",
                            color: "#575757",
                          }}
                        >
                          {job.type}
                        </span>
                      )}
                      {job.experience && (
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: "#F5F5F5",
                            color: "#575757",
                          }}
                        >
                          {job.experience}
                        </span>
                      )}
                      {job.salary && (
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: "#ECF5FF",
                            color: "#7c00ff",
                          }}
                        >
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => {
                        // Handle apply action
                        console.log("Apply to job:", job.id);
                        // In real app: navigate to application page or open form
                      }}
                      className="w-full px-4 py-2 rounded-lg font-medium text-sm text-white transition-all"
                      style={{
                        background:
                          "linear-gradient(180deg, #9a33ff 0%, #7c00ff 100%)",
                        border: "1px solid #a854ff",
                        boxShadow:
                          "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background =
                          "linear-gradient(180deg, #aa44ff 0%, #8c11ff 100%)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background =
                          "linear-gradient(180deg, #9a33ff 0%, #7c00ff 100%)";
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#575757" }}>
                No open positions at this time.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

