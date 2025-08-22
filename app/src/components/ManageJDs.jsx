import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiNotification3Line, RiUser3Fill, RiMenuLine, RiFileTextLine, RiUploadLine, RiFileCopyLine, RiFileList3Line, RiBookmarkLine, RiAddLine, RiCloseLine, RiLogoutBoxLine, RiArrowDownSLine, RiMoreLine, RiBarChartBoxLine, RiEyeLine, RiDeleteBinLine, RiCheckboxMultipleLine, RiArrowLeftLine, RiStarLine, RiRobotLine } from '@remixicon/react'
import 'material-symbols/outlined.css'

export default function ManageJDs() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [jds, setJds] = useState([])
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [selectedJDs, setSelectedJDs] = useState([])
  const [expandedJDs, setExpandedJDs] = useState([])
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Sample JD data - in real app this would come from API
  const sampleJDs = [
    {
      id: 1,
      jobTitle: "Full-Stack Developer",
      companyName: "Mandal Minds",
      dateAdded: "2024-01-15",
      matchScore: 87,
      description: `We are looking for a skilled Full-Stack Developer to join our team at Mandal Minds. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Design and develop scalable web applications using React, Node.js, and MongoDB
• Collaborate with cross-functional teams to define, design, and ship new features
• Write clean, maintainable, and efficient code following best practices
• Implement responsive UI/UX designs and ensure cross-browser compatibility
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Debug and troubleshoot issues across the full stack
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• 3+ years of experience in full-stack development
• Proficiency in JavaScript, HTML5, CSS3, and modern frameworks (React, Vue.js, or Angular)
• Strong backend development skills with Node.js, Express.js, or similar
• Experience with databases (MongoDB, PostgreSQL, or MySQL)
• Knowledge of RESTful APIs and GraphQL
• Familiarity with version control systems (Git)
• Understanding of cloud platforms (AWS, Azure, or GCP)
• Experience with containerization (Docker) and CI/CD pipelines

Preferred Qualifications:
• Bachelor's degree in Computer Science or related field
• Experience with TypeScript and modern build tools (Webpack, Vite)
• Knowledge of microservices architecture
• Familiarity with testing frameworks (Jest, Cypress)
• Understanding of Agile/Scrum methodologies

What We Offer:
• Competitive salary and equity package
• Flexible work arrangements (remote/hybrid)
• Professional development opportunities
• Health, dental, and vision insurance
• 401(k) with company matching
• Unlimited PTO policy`
    },
    {
      id: 2,
      jobTitle: "Full-Stack Developer",
      companyName: "TechCorp Inc",
      dateAdded: "2024-01-12",
      matchScore: 92,
      description: `We are looking for a skilled Full-Stack Developer to join our team at TechCorp Inc. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Design and develop scalable web applications using React, Node.js, and PostgreSQL
• Collaborate with product managers and designers to implement new features
• Write clean, maintainable, and efficient code following best practices
• Implement responsive UI/UX designs and ensure cross-browser compatibility
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Debug and troubleshoot issues across the full stack
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• 4+ years of experience in full-stack development
• Proficiency in JavaScript, TypeScript, HTML5, CSS3, and React
• Strong backend development skills with Node.js and Express.js
• Experience with PostgreSQL and database optimization
• Knowledge of RESTful APIs and GraphQL
• Familiarity with version control systems (Git)
• Understanding of cloud platforms (AWS preferred)
• Experience with containerization (Docker) and Kubernetes`
    },
    {
      id: 3,
      jobTitle: "Full-Stack Developer",
      companyName: "DataFlow Solutions",
      dateAdded: "2024-01-10",
      matchScore: 78,
      description: `We are looking for a skilled Full-Stack Developer to join our team at DataFlow Solutions. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Design and develop scalable web applications using Vue.js, Python, and MySQL
• Work closely with data scientists to implement data visualization features
• Write clean, maintainable, and efficient code following best practices
• Implement responsive UI/UX designs and ensure cross-browser compatibility
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Debug and troubleshoot issues across the full stack
• Stay up-to-date with emerging technologies and industry trends

Required Skills:
• 2+ years of experience in full-stack development
• Proficiency in JavaScript, HTML5, CSS3, and Vue.js
• Strong backend development skills with Python and Django/Flask
• Experience with MySQL and database design
• Knowledge of RESTful APIs
• Familiarity with version control systems (Git)
• Understanding of data visualization libraries (D3.js, Chart.js)
• Experience with Python data libraries (Pandas, NumPy)`
    }
  ]

  useEffect(() => {
    // Load JDs - in real app this would be from API
    setJds(sampleJDs)
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

  const handleAnalyze = (jd) => {
    // Navigate to analysis page with selected JD
    console.log('Analyzing JD:', jd)
    // In real app: navigate('/analyze', { state: { selectedJD: jd } })
  }

  const handleCompareSelected = () => {
    if (selectedJDs.length > 0) {
      console.log('Comparing JDs:', selectedJDs)
      // In real app: navigate to comparison page
    }
  }

  const handleDeleteJD = (id) => {
    if (window.confirm('Are you sure you want to delete this job description?')) {
      setJds(jds.filter(jd => jd.id !== id))
    }
  }

  const toggleJDSelection = (id) => {
    setSelectedJDs(prev => 
      prev.includes(id) 
        ? prev.filter(jdId => jdId !== id)
        : [...prev, id]
    )
  }

  const toggleJDExpansion = (id) => {
    setExpandedJDs(prev => 
      prev.includes(id) 
        ? prev.filter(jdId => jdId !== id)
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
                    <img src="/logo.svg" alt="Mandal Minds Logo" className="w-8 h-6" />
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
                      <img src="/logo.svg" alt="Mandal Minds Logo" className="w-8 h-6" />
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
              
              <button 
                onClick={() => navigate('/manage-resume')}
                className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full`}
              >
                <RiFileCopyLine size={20} />
                {firstSidebarOpen && <span className="font-medium">Manage Resume</span>}
              </button>
              
              <a href="#" className={`flex items-center ${firstSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'} py-2 text-purple-600 bg-gray-50 rounded-md`}>
                <RiFileList3Line size={20} />
                {firstSidebarOpen && <span className="font-medium">Manage JDs</span>}
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6 pb-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Job Descriptions</h1>
            <p className="text-sm text-gray-600">Organize and analyze your target job descriptions</p>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {jds.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <RiFileList3Line size={32} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Job Description Hub</h2>
                <p className="text-gray-600 mb-8">Add JDs from jobs you're interested in to analyze them against your resume and prepare for interviews.</p>
                <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <RiAddLine size={20} />
                  <span>Add Your First JD</span>
                </button>
              </div>
            ) : (
              // Populated State
              <div>
                {/* Header Actions */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {jds.length} Job Description{jds.length !== 1 ? 's' : ''}
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
                        <span>Add New JD</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Compare Mode Controls - Second Line */}
                  {isCompareMode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedJDs.length} selected
                      </span>
                      <button
                        onClick={handleCompareSelected}
                        disabled={selectedJDs.length === 0}
                        className="px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 disabled:text-gray-400 disabled:border-gray-200 rounded-lg transition-colors text-sm"
                      >
                        Compare Selected
                      </button>
                      <button
                        onClick={() => {
                          setIsCompareMode(false)
                          setSelectedJDs([])
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* JD Cards - Scrollable */}
                <div className="grid gap-4">
                  {jds.map((jd) => (
                    <div
                      key={jd.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => toggleJDExpansion(jd.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {isCompareMode && (
                              <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedJDs.includes(jd.id)}
                                  onChange={() => toggleJDSelection(jd.id)}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{jd.jobTitle}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(jd.matchScore)}`}>
                                  {jd.matchScore}% Match
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-2">{jd.companyName}</p>
                              <p className="text-sm text-gray-500">Added {formatDate(jd.dateAdded)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {!isCompareMode && (
                          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleAnalyze(jd)}
                              className="flex items-center space-x-2 px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors w-full sm:w-auto justify-center"
                            >
                              <RiBarChartBoxLine size={16} />
                              <span>Analyze</span>
                            </button>
                            
                            <div className="relative group">
                              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <RiMoreLine size={16} />
                              </button>
                              
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <button className="w-full flex items-center space-x-2 px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors">
                                  <RiEyeLine size={16} />
                                  <span>View/Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteJD(jd.id)}
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
                      {expandedJDs.includes(jd.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Job Description:</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{jd.description}</p>
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
