import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiNotification3Line, RiUser3Fill, RiMenuLine, RiFileTextLine, RiUploadLine, RiFileCopyLine, RiFileList3Line, RiBookmarkLine, RiAddLine, RiCloseLine, RiLogoutBoxLine, RiArrowDownSLine, RiMoreLine, RiBarChartBoxLine, RiEyeLine, RiDeleteBinLine, RiCheckboxMultipleLine, RiArrowLeftLine, RiStarLine, RiRobotLine, RiDownloadLine, RiEditLine, RiCheckLine } from '@remixicon/react'
import 'material-symbols/outlined.css'

export default function AnalyzeResume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [jdContent, setJdContent] = useState('')
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <button className="relative w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <RiNotification3Line size={20} />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <RiUser3Fill size={20} />
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">john.doe@example.com</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsUserDropdownOpen(false)
                      navigate('/')
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <RiLogoutBoxLine size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 80px - 32px)' }}>
        {/* First Sidebar */}
        <div className={`${firstSidebarOpen ? 'w-64' : 'w-16'} bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 flex-shrink-0 mb-8`}>
          <div className="flex flex-col h-full">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {firstSidebarOpen && <span className="text-lg font-semibold text-gray-900">Mandal Minds</span>}
                  {!firstSidebarOpen && (
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer relative overflow-hidden"
                      onMouseEnter={() => setIsLogoHovered(true)}
                      onMouseLeave={() => setIsLogoHovered(false)}
                      onClick={() => setFirstSidebarOpen(true)}
                    >
                      {isLogoHovered ? (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-600" style={{ fontSize: 20 }}>dock_to_right</span>
                        </div>
                      ) : (
                        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Mandal Minds Logo" className="w-8 h-6" />
                      )}
                    </div>
                  )}
                  {firstSidebarOpen && (
                    <button
                      onClick={() => setFirstSidebarOpen(false)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>dock_to_left</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-2">
              <button 
                onClick={() => navigate('/manage-resume')}
                className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full`}
              >
                <RiArrowLeftLine size={20} />
                {firstSidebarOpen && <span className="font-medium">Back to Manage Resume</span>}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 px-6 pb-6">
          {/* Page Title with Action Buttons */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <RiDownloadLine size={16} />
                  <span>Export PDF</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <RiMoreLine size={16} />
                  <span>More Options</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Enhance your resume based on job requirements</p>
            
            {/* Divider */}
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Resume Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h3>
              <div className="bg-gray-50 rounded-lg p-8 min-h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <RiFileTextLine size={48} className="mx-auto mb-4" />
                  <p>Resume preview will appear here</p>
                </div>
              </div>
            </div>

            {/* Right Side - Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Paste Job Description</h3>
                <p className="text-sm text-gray-600">Copy and paste the job description to analyze skill gaps</p>
              </div>
              
              <div className="mb-4">
                <textarea
                  placeholder="Paste the job description here..."
                  value={jdContent}
                  onChange={(e) => setJdContent(e.target.value)}
                  className="w-full h-64 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              
              <button 
                disabled={!jdContent.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
