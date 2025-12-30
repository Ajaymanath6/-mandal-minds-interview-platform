import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Document, Archive, SidePanelClose, SidePanelOpen, User, Logout, ThumbsUpDouble, Settings, Bullhorn, UserAvatar, EarthFilled } from "@carbon/icons-react";
import logoSvg from "../assets/logo.svg";
import AccountDropdown from "./AccountDropdown";

export default function Sidebar({ activeItem = "home", onToggle, isOpen: externalIsOpen }) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const firstSidebarOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // Sync internal state when external state changes
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);
  
  const setFirstSidebarOpen = (value) => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(value);
    }
    if (onToggle) {
      onToggle(value);
    }
  };
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  const userButtonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
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

          <button
            onClick={() => navigate("/home", { state: { initialSearch: "Kochi", viewMode: "globe" } })}
            className={`flex items-center ${
              firstSidebarOpen ? "space-x-3" : "justify-center"
            } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] w-full transition-colors border-0 ${
              activeItem === "jobs-near-you"
                ? "bg-[#F5F5F5]"
                : "hover:bg-[#F5F5F5]"
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <EarthFilled
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
                Jobs Near You
              </span>
            )}
          </button>
        </nav>

        {/* What's New Option */}
        <div className="p-2">
          <button
            onClick={() => {
              // Handle What's New action
            }}
            className={`flex items-center ${
              firstSidebarOpen ? "space-x-3" : "justify-center"
            } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] w-full transition-colors border-0 ${
              activeItem === "whats-new"
                ? "bg-[#F5F5F5]"
                : "hover:bg-[#F5F5F5]"
            }`}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <Bullhorn
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
                What's New
              </span>
            )}
          </button>
        </div>

        {/* User Profile - Bottom */}
        <div className="p-2 relative">
          {firstSidebarOpen ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                ref={userButtonRef}
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3" : "justify-center"
                } pt-1 pr-2 pb-1 pl-2 text-gray-900 rounded-[12px] w-full transition-colors border-0 ${
                  isUserDropdownOpen
                    ? "bg-[#F5F5F5]"
                    : "hover:bg-[#F5F5F5]"
                }`}
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center">
                  <User
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
                    John Doe
                  </span>
                )}
              </button>
              
              {/* User Dropdown - Opens upward */}
              <AccountDropdown
                isOpen={isUserDropdownOpen}
                onClose={() => setIsUserDropdownOpen(false)}
                userDropdownRef={userDropdownRef}
                isSidebarCollapsed={false}
              />
            </div>
          ) : (
            <div className="relative">
              <button
                ref={userButtonRef}
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                title="Account"
              >
                <Logout
                  size={24}
                  style={{ color: "#575757" }}
                />
              </button>
              <div ref={userDropdownRef} className="relative">
                <AccountDropdown
                  isOpen={isUserDropdownOpen}
                  onClose={() => setIsUserDropdownOpen(false)}
                  userDropdownRef={userDropdownRef}
                  isSidebarCollapsed={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

