import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Document, Archive, SidePanelClose, SidePanelOpen, User, Logout, ThumbsUpDouble, Settings } from "@carbon/icons-react";
import logoSvg from "../assets/logo.svg";

export default function Sidebar({ activeItem = "home" }) {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

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
                    <SidePanelOpen
                      size={20}
                      style={{ color: "#575757" }}
                    />
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
                <SidePanelClose
                  size={20}
                  style={{ color: "#575757" }}
                />
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
              <ThumbsUpDouble
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
        <div className="p-3 border-t border-gray-200 relative">
          {firstSidebarOpen ? (
            <div className="relative" ref={userDropdownRef}>
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                  <User
                    size={18}
                    style={{ color: "#7C00FF" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Open Sans' }}>
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Open Sans' }}>Designer</p>
                </div>
              </div>
              
              {/* User Dropdown - Opens upward */}
              {isUserDropdownOpen && (
                <div
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-lg border z-50"
                  style={{
                    width: '248px',
                    height: '264px',
                    padding: '6px',
                    gap: '4px',
                    borderColor: '#E5E5E5',
                    borderWidth: '1px',
                    boxShadow: '0px 10px 10px -5px #0000000A, 0px 20px 25px -5px #0000001A',
                    borderRadius: '8px',
                  }}
                >
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      // Handle settings action
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5]"
                    style={{ fontFamily: 'Open Sans' }}
                  >
                    <Settings size={20} style={{ color: '#575757' }} />
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      Settings
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[#F5F5F5]"
                    style={{ fontFamily: 'Open Sans' }}
                  >
                    <Logout size={20} style={{ color: '#575757' }} />
                    <span className="text-sm font-medium" style={{ color: '#1A1A1A', fontFamily: 'Open Sans' }}>
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
              title="Logout"
            >
              <Logout
                size={24}
                style={{ color: "#575757" }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

