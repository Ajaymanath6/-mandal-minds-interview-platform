import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiNotification3Line,
  RiUser3Fill,
  RiMenuLine,
  RiFileTextLine,
  RiUploadLine,
  RiFileCopyLine,
  RiFileList3Line,
  RiBookmarkLine,
  RiAddLine,
  RiCloseLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiMoreLine,
  RiBarChartBoxLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiCheckboxMultipleLine,
  RiArrowLeftLine,
  RiStarLine,
  RiRobotLine,
  RiEditLine,
  RiSparklingFill,
  RiFolderLine,
  RiFolder3Line,
} from "@remixicon/react";
import logoSvg from "../assets/logo.svg";
import "material-symbols/outlined.css";

// Add Google Fonts Material Icons
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
link.rel = "stylesheet";
if (!document.head.querySelector('link[href*="material+symbols"]')) {
  document.head.appendChild(link);
}

export default function ResumeEditor() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      created: new Date().toISOString().split("T")[0],
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setCreateFolderModal(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="flex w-full" style={{ height: "100vh" }}>
        {/* First Sidebar - Always Visible */}
        <div
          className={`${
            firstSidebarOpen ? "w-52" : "w-16"
          } bg-white transition-all duration-300 flex-shrink-0 h-full`}
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
                      className="w-8 h-6"
                    />
                    <span className="font-semibold text-gray-900">
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
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-gray-600"
                          style={{ fontSize: 20 }}
                        >
                          dock_to_right
                        </span>
                      </div>
                    ) : (
                      <img
                        src={logoSvg}
                        alt="Mandal Minds Logo"
                        className="w-8 h-6"
                      />
                    )}
                  </div>
                )}
                {firstSidebarOpen && (
                  <button
                    onClick={() => setFirstSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 20 }}
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
                onClick={() => navigate("/resume")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  auto_awesome
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">AI Interview</span>
                )}
              </button>

              <a
                href="#"
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-purple-600 bg-gray-50 rounded-md transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  edit_document
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Resume Editor</span>
                )}
              </a>

              <button
                onClick={() => navigate("/manage-resume")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  content_copy
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Manage Resume</span>
                )}
              </button>

              <button
                onClick={() => navigate("/manage-jds")}
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md w-full transition-colors`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    fontVariationSettings:
                      '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                  }}
                >
                  description
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">Manage JDs</span>
                )}
              </button>
            </nav>

            {/* User Profile - Bottom */}
            <div className="p-3 border-t border-gray-200">
              {firstSidebarOpen ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
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
                    <p className="text-sm font-medium text-gray-900 truncate">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      john.doe@example.com
                    </p>
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

        {/* Second Sidebar - Resume Organization */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 h-full">
          <div className="flex flex-col h-full">
            {/* Header with Add Resume Outline Button */}
            <div className="p-4 border-b border-gray-200">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">
                <RiAddLine size={20} />
                <span>Add Resume Outline</span>
              </button>
            </div>

            {/* All Resumes Section */}
            <div className="flex-1 p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RiFolderLine size={20} className="text-gray-600" />
                    <span className="text-base font-medium text-gray-900">
                      All Resumes
                    </span>
                  </div>
                  <button
                    onClick={() => setCreateFolderModal(true)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title="Create Folder"
                  >
                    <RiAddLine size={18} />
                  </button>
                </div>
              </div>

              {/* Folder List */}
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    <RiFolder3Line size={18} className="text-yellow-600" />
                    <span className="text-sm">{folder.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-base font-bold text-gray-900">Resume Editor</h1>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <RiEditLine size={32} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Resume Editor
              </h2>
              <p className="text-gray-600 mb-6">
                Create and organize your resume outlines in folders.
              </p>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {createFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => setCreateFolderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings:
                      '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20',
                  }}
                >
                  arrow_back
                </span>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                Create Folder
              </h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFolder();
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setCreateFolderModal(false);
                  setNewFolderName("");
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
