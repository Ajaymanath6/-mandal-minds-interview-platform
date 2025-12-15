import { useState } from "react";
import { createPortal } from "react-dom";
import "material-symbols/outlined.css";

export default function UploadStatusModal({ uploads, onClose, onCollapse }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!uploads || uploads.length === 0) {
    return null;
  }

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (onCollapse) {
      onCollapse(!isCollapsed);
    }
  };

  const completedCount = uploads.filter((u) => u.status === "completed").length;
  const totalCount = uploads.length;

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-[10001] transition-all duration-300"
      style={{
        width: isCollapsed ? "auto" : "380px",
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200" style={{ backgroundColor: "#F5F5F5" }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span
              className="material-symbols-outlined flex-shrink-0"
              style={{ fontSize: 20, color: "#575757" }}
            >
              cloud_upload
            </span>
            <span
              className="text-sm font-medium truncate"
              style={{
                fontFamily: "Body Font",
                fontWeight: 500,
                color: "#575757",
              }}
            >
              Uploads ({completedCount}/{totalCount})
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCollapse}
              className="p-1 rounded transition-colors flex items-center justify-center"
              aria-label={isCollapsed ? "Expand" : "Collapse"}
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 20,
                  color: "#575757",
                  transition: "transform 0.2s",
                }}
              >
                {isCollapsed ? "unfold_more" : "unfold_less"}
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded transition-colors flex items-center justify-center"
              aria-label="Close"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: "#575757" }}
              >
                close
              </span>
            </button>
          </div>
        </div>

        {/* File List - Only show when not collapsed */}
        {!isCollapsed && (
          <div className="max-h-96 overflow-y-auto">
            {uploads.map((upload, index) => (
              <div
                key={upload.id || index}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        fontFamily: "Body Font",
                        fontWeight: 500,
                        color: "#000000",
                      }}
                    >
                      {upload.fileName}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        fontFamily: "Body Font",
                        fontWeight: 400,
                        color: "#9CA3AF",
                      }}
                    >
                      {upload.status === "uploading"
                        ? "Uploading..."
                        : upload.status === "completed"
                        ? "File added to the folder"
                        : "Upload failed"}
                    </p>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {upload.status === "uploading" ? (
                      <div className="relative w-5 h-5">
                        <svg
                          className="w-5 h-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#7c00ff"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="#7c00ff"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    ) : upload.status === "completed" ? (
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 20,
                          color: "rgba(87, 87, 87, 1)",
                          fontVariationSettings: '"FILL" 1',
                        }}
                      >
                        check_circle
                      </span>
                    ) : (
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 20,
                          color: "#ef4444",
                          fontVariationSettings: '"FILL" 1',
                        }}
                      >
                        error
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

