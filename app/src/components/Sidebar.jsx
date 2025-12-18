import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Document, Archive } from "@carbon/icons-react";
import { ThumbUp } from "@mui/icons-material";
import logoSvg from "../assets/logo.svg";

export default function Sidebar({ activeItem = "home" }) {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`${
        firstSidebarOpen ? "w-52" : "w-16"
      } bg-white transition-all border-r border-[#E5E5E5] duration-300 flex-shrink-0 h-full`}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {firstSidebarOpen && (
              <div className="flex items-center space-x-2">
                <img
                  src={logoSvg}
                  alt="Mandal Minds Logo"
                  className="w-6 h-6"
                />
                <span
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "24px",
                    letterSpacing: "-0.03em",
                    color: "#1A1A1A",
                  }}
                >
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
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#F5F5F5" }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 20, color: "#575757" }}
                    >
                      dock_to_right
                    </span>
                  </div>
                ) : (
                  <img
                    src={logoSvg}
                    alt="Mandal Minds Logo"
                    className="w-6 h-6"
                  />
                )}
              </div>
            )}
            {firstSidebarOpen && (
              <button
                onClick={() => setFirstSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-[#F5F5F5] hover:bg-[#F5F5F5] rounded"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20, color: "#575757" }}
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
            onClick={() => navigate("/home")}
            className={`flex items-center ${
              firstSidebarOpen ? "space-x-3" : "justify-center"
            } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] transition-colors border-0 w-full ${
              activeItem === "home"
                ? "bg-[#F5F5F5]"
                : "hover:bg-[#F5F5F5]"
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <Home
                size={24}
                style={{
                  color: "rgba(87, 87, 87, 1)",
                }}
              />
            </div>
            {firstSidebarOpen && (
              <span
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#575757",
                }}
              >
                Home
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/get-vetted")}
            className={`flex items-center ${
              firstSidebarOpen ? "space-x-3" : "justify-center"
            } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] w-full transition-colors border-0 ${
              activeItem === "get-vetted"
                ? "bg-[#F5F5F5]"
                : "hover:bg-[#F5F5F5]"
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <ThumbUp
                style={{
                  fontSize: "24px",
                  color: "rgba(87, 87, 87, 1)",
                }}
              />
            </div>
            {firstSidebarOpen && (
              <span
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#575757",
                }}
              >
                Get Vetted
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/manage-resume")}
            className={`flex items-center ${
              firstSidebarOpen ? "space-x-3" : "justify-center"
            } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] w-full transition-colors border-0 ${
              activeItem === "manage-resume"
                ? "bg-[#F5F5F5]"
                : "hover:bg-[#F5F5F5]"
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <Document
                size={24}
                style={{
                  color: "rgba(87, 87, 87, 1)",
                }}
              />
            </div>
            {firstSidebarOpen && (
              <span
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#575757",
                }}
              >
                Manage Resume
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/manage-jds")}
            className={`flex items-center ${
              firstSidebarOpen ? "space-x-3" : "justify-center"
            } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] w-full transition-colors border-0 ${
              activeItem === "manage-jds" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <Archive
                size={24}
                style={{
                  color: "rgba(87, 87, 87, 1)",
                }}
              />
            </div>
            {firstSidebarOpen && (
              <span
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "-0.03em",
                  color: "#575757",
                }}
              >
                Manage JDs
              </span>
            )}
          </button>
        </nav>

        {/* User Profile - Bottom */}
        <div className="p-3 border-t border-gray-200">
          {firstSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-purple-600"
                  style={{
                    fontSize: "18px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 18',
                  }}
                >
                  person
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Open Sans' }}>
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Open Sans' }}>Designer</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
              title="Logout"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "24px",
                  fontVariationSettings:
                    '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                }}
              >
                logout
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

