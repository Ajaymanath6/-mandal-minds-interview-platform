import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiNotification3Line, RiUser3Fill, RiMenuLine, RiFileTextLine, RiUploadLine, RiFileCopyLine, RiFileList3Line, RiBookmarkLine, RiAddLine, RiCloseLine, RiLogoutBoxLine, RiArrowDownSLine, RiMoreLine, RiBarChartBoxLine, RiEyeLine, RiDeleteBinLine, RiCheckboxMultipleLine, RiArrowLeftLine, RiStarLine, RiRobotLine, RiDownloadLine, RiEditLine, RiCheckLine } from '@remixicon/react'
import 'material-symbols/outlined.css'

export default function ManageResume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [resumes, setResumes] = useState([])
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [selectedResumes, setSelectedResumes] = useState([])
  const [expandedResumes, setExpandedResumes] = useState([])
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Sample Resume data - in real app this would come from API
  const sampleResumes = [
    {
      id: 1,
      resumeName: "General Developer Resume",
      version: "v2.1",
      dateUploaded: "2024-01-15",
      isDefault: true,
      description: `Professional full-stack developer with 3+ years of experience in modern web technologies.

Key Skills:
• JavaScript, TypeScript, HTML5, CSS3
• React.js, Node.js, Express.js
• MongoDB, PostgreSQL, MySQL
• RESTful APIs, GraphQL
• Git, Docker, CI/CD pipelines
• AWS, Azure cloud platforms

Professional Experience:
• Full-Stack Developer at TechCorp (2022-Present)
• Junior Developer at StartupXYZ (2021-2022)
• Freelance Web Developer (2020-2021)

Education:
• Bachelor's in Computer Science - University of Technology (2020)
• Full-Stack Web Development Bootcamp - CodeAcademy (2020)`
    },
    {
      id: 2,
      resumeName: "Senior Developer Resume",
      version: "v1.8",
      dateUploaded: "2024-01-12",
      isDefault: false,
      description: `Senior full-stack developer with 5+ years of experience in enterprise-level applications.

Key Skills:
• Advanced JavaScript, TypeScript, Python
• React.js, Angular, Vue.js
• Node.js, Django, Flask
• PostgreSQL, MongoDB, Redis
• Microservices architecture
• Kubernetes, Docker containers`
    },
    {
      id: 3,
      resumeName: "Frontend Specialist Resume",
      version: "v1.3",
      dateUploaded: "2024-01-10",
      isDefault: false,
      description: `Frontend developer with strong full-stack capabilities and design sensibility.

Key Skills:
• JavaScript, TypeScript, HTML5, CSS3
• React.js, Vue.js, Angular
• SASS, Tailwind CSS, Material-UI
• Node.js, Python basics
• Responsive design, accessibility`
    }
  ]

  useEffect(() => {
    // Load Resumes - in real app this would be from API
    setResumes(sampleResumes)
  }, [])

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

  const handleAnalyze = (resume) => {
    // Navigate to analysis page with selected Resume
    console.log('Analyzing Resume:', resume)
    // In real app: navigate('/analyze', { state: { selectedResume: resume } })
  }

  const handleCompareSelected = () => {
    if (selectedResumes.length > 0) {
      console.log('Comparing Resumes:', selectedResumes)
      // In real app: navigate to comparison page
    }
  }

  const handleDeleteResume = (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      setResumes(resumes.filter(resume => resume.id !== id))
    }
  }

  const toggleResumeSelection = (id) => {
    setSelectedResumes(prev => 
      prev.includes(id) 
        ? prev.filter(resumeId => resumeId !== id)
        : [...prev, id]
    )
  }

  const toggleResumeExpansion = (id) => {
    setExpandedResumes(prev => 
      prev.includes(id) 
        ? prev.filter(resumeId => resumeId !== id)
        : [...prev, id]
    )
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-purple-600 bg-purple-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
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
        {/* First Sidebar - Always Visible */}
        <div className={`${firstSidebarOpen ? 'w-64' : 'w-16'} bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 flex-shrink-0 mb-8`}>
          <div className="flex flex-col h-full">
            {/* Logo and Toggle */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {firstSidebarOpen && (
                  <div className="flex items-center space-x-2">
                    <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Mandal Minds Logo" className="w-8 h-6" />
                    <span className="font-semibold text-gray-900">Mandal Minds</span>
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

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-2">
              <button 
                onClick={() => navigate('/resume')}
                className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full`}
              >
                <RiStarLine size={20} />
                {firstSidebarOpen && <span className="font-medium">AI Interview</span>}
              </button>
              
              <a href="#" className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md`}>
                <RiFileTextLine size={20} />
                {firstSidebarOpen && <span className="font-medium">Resume Editor</span>}
              </a>
              
              <a href="#" className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-purple-600 bg-gray-50 rounded-md`}>
                <RiFileCopyLine size={20} />
                {firstSidebarOpen && <span className="font-medium">Manage Resume</span>}
              </a>
              
              <button 
                onClick={() => navigate('/manage-jds')}
                className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full`}
              >
                <RiFileList3Line size={20} />
                {firstSidebarOpen && <span className="font-medium">Manage JDs</span>}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6 pb-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Resume</h1>
            <p className="text-sm text-gray-600">Organize and manage your resume versions</p>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {resumes.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <RiFileCopyLine size={32} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Resume Workspace</h2>
                <p className="text-gray-600 mb-8">Upload your resumes here to start practicing for interviews, analyzing skill gaps, and building tailored applications.</p>
                <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <RiAddLine size={20} />
                  <span>Upload Your First Resume</span>
                </button>
              </div>
            ) : (
              // Populated State
              <div>
                {/* Header Actions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {resumes.length} Resume{resumes.length !== 1 ? 's' : ''}
                    </h2>
                    
                    <div className="flex items-center space-x-3">
                      {!isCompareMode && (
                        <button
                          onClick={() => setIsCompareMode(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <RiCheckboxMultipleLine size={16} />
                          <span>Compare Multiple</span>
                        </button>
                      )}
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <RiAddLine size={16} />
                        <span>Upload New Resume</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Compare Mode Controls - Second Line */}
                  {isCompareMode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedResumes.length} selected
                      </span>
                      <button
                        onClick={handleCompareSelected}
                        disabled={selectedResumes.length === 0}
                        className="px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 disabled:text-gray-400 disabled:border-gray-200 rounded-lg transition-colors text-sm"
                      >
                        Compare Selected
                      </button>
                      <button
                        onClick={() => {
                          setIsCompareMode(false)
                          setSelectedResumes([])
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Resume Cards - Scrollable */}
                <div className="grid gap-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => toggleResumeExpansion(resume.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {isCompareMode && (
                              <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedResumes.includes(resume.id)}
                                  onChange={() => toggleResumeSelection(resume.id)}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{resume.resumeName}</h3>
                                {resume.isDefault && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                    Default
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-gray-600 mb-1">{resume.version}</p>
                              <p className="text-sm text-gray-500">Uploaded {formatDate(resume.dateUploaded)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {!isCompareMode && (
                          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate('/analyze-resume')}
                              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm w-full sm:w-auto justify-center"
                            >
                              <RiEditLine size={14} />
                              <span>Edit with AI</span>
                            </button>
                            
                            <div className="relative group">
                              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <RiMoreLine size={16} />
                              </button>
                              
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <button
                                  onClick={() => handleAnalyze(resume)}
                                  className="w-full flex items-center space-x-2 px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                  <RiBarChartBoxLine size={16} />
                                  <span>Analyze vs. JD</span>
                                </button>
                                {!resume.isDefault && (
                                  <button
                                    onClick={() => console.log('Set as default:', resume.id)}
                                    className="w-full flex items-center space-x-2 px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors"
                                  >
                                    <RiCheckLine size={16} />
                                    <span>Set as Default</span>
                                  </button>
                                )}
                                <button className="w-full flex items-center space-x-2 px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors">
                                  <RiEyeLine size={16} />
                                  <span>Preview</span>
                                </button>
                                <button className="w-full flex items-center space-x-2 px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors">
                                  <RiDownloadLine size={16} />
                                  <span>Download</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteResume(resume.id)}
                                  className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <RiDeleteBinLine size={16} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedResumes.includes(resume.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Resume Preview:</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{resume.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
