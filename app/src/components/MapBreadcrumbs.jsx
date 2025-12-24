import React from "react";
import { ArrowLeft } from "@carbon/icons-react";

/**
 * MapBreadcrumbs Component
 * Displays navigation path (e.g., "India > Kerala > Kochi")
 * Clickable breadcrumb items to jump back to any level
 * Back button to return to previous location
 */
export default function MapBreadcrumbs({
  breadcrumbs = [],
  onBreadcrumbClick,
  onBackClick,
  canGoBack = false,
}) {
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-2"
      style={{
        fontFamily: "Open Sans",
      }}
    >
      <div className="flex items-center gap-2">
        {/* Back Button */}
        {canGoBack && (
          <button
            onClick={onBackClick}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
            title="Go back to previous location"
            style={{
              color: "#575757",
            }}
          >
            <ArrowLeft size={16} />
          </button>
        )}

        {/* Breadcrumb Items */}
        <div className="flex items-center gap-1">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <button
                  onClick={() => onBreadcrumbClick(index)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    isLast
                      ? "font-semibold text-[#7c00ff] cursor-default"
                      : "text-[#575757] hover:text-[#7c00ff] hover:bg-gray-50 cursor-pointer"
                  }`}
                  disabled={isLast}
                  title={isLast ? "Current location" : `Go to ${crumb.label}`}
                >
                  {crumb.label}
                </button>
                {!isLast && (
                  <span className="text-gray-400 text-sm">›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

