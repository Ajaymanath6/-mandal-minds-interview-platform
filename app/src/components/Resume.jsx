import { useState, useEffect, useRef } from "react";
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
  RiRobotLine,
  RiPlayFill,
  RiAddLine,
  RiCloseLine,
  RiSendPlaneLine,
  RiMicLine,
  RiLogoutBoxLine,
  RiArrowDownSLine,
  RiQuestionLine,
  RiChatSmile3Line,
  RiLightbulbLine,
  RiSparklingFill,
  RiBarChartBoxLine,
  RiRefreshLine,
  RiArrowLeftLine,
  RiTrophyLine,
  RiGraduationCapLine,
  RiStarLine,
} from "@remixicon/react";
import logoSvg from "../assets/logo.svg";
import "material-symbols/outlined.css";
import voiceResponsesData from "../data/voiceResponses.json";

export default function Resume() {
  const [firstSidebarOpen, setFirstSidebarOpen] = useState(true);
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("paste-jd");
  const [jdContent, setJdContent] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "Python",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const [voiceTranscription, setVoiceTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [showPerformanceReview, setShowPerformanceReview] = useState(false);

  // Custom User Chat Card Component with Layered Effect - Responsive
  const UserChatCard = ({ content }) => {
    return (
      <div className="relative mx-auto w-fit max-w-xs sm:max-w-md lg:max-w-2xl">
        {/* Bottom Layer (deepest) */}
        <div className="absolute top-2 left-2 bg-gray-300 rounded-3xl border border-gray-400 shadow-sm p-3 sm:p-4 lg:p-6 min-w-32 sm:min-w-48 lg:min-w-64 max-w-xs sm:max-w-md lg:max-w-2xl opacity-40">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap invisible">
            {content}
          </p>
        </div>

        {/* Middle Layer */}
        <div className="absolute top-1 left-1 bg-gray-200 rounded-3xl border border-gray-300 shadow-sm p-3 sm:p-4 lg:p-6 min-w-32 sm:min-w-48 lg:min-w-64 max-w-xs sm:max-w-md lg:max-w-2xl opacity-60">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap invisible">
            {content}
          </p>
        </div>

        {/* Top Layer (main visible content) */}
        <div className="relative bg-white rounded-3xl border border-gray-200 shadow-md p-3 sm:p-4 lg:p-6 w-fit min-w-32 sm:min-w-48 lg:min-w-64 max-w-xs sm:max-w-md lg:max-w-2xl">
          <p className="text-gray-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    );
  };

  // Performance Review Component
  const PerformanceReviewCard = () => {
    return (
      <div className="max-w-4xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <RiGraduationCapLine size={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Full-Stack Developer: Performance Review
              </h2>
              <p className="text-sm text-gray-900">
                Below is your performance summary from this interview session.
                Review your strengths and areas for improvement.
              </p>
            </div>
          </div>
        </div>

        {/* Score & Grade Section */}
        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Left Side - Score Card */}
          <div className="lg:w-64 bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Score
              </h3>
              {/* Circular Progress Chart */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray="79, 100"
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">79</div>
                    <div className="text-sm text-gray-600">/100</div>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">
                Grade: C
              </div>
            </div>
          </div>

          {/* Right Side - Feedback */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Performance Summary
              </h3>
              <p className="text-gray-900">
                Good effort! You've shown decent knowledge of the core concepts,
                but would benefit from more focused study on specific areas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Key Concepts Grasped
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-900">
                  <li>• Key concept understanding</li>
                  <li>• Factual knowledge recall</li>
                  <li>• Main ideas identification</li>
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 text-sm">💡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Areas for Deeper Study
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-900">
                  <li>• Detailed analysis</li>
                  <li>• Connecting concepts</li>
                  <li>• Application of knowledge</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setMessages([]);
              setQuestionCount(0);
              setIsInterviewStarted(false);
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <RiArrowLeftLine size={16} />
            <span>Back to Topics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            <RiTrophyLine size={16} />
            <span>View Leaderboard</span>
          </button>
          <button
            onClick={() => {
              setMessages([]);
              setQuestionCount(0);
              // Restart interview
              const initialMessage =
                "Hello! I'm here to conduct your interview for the Full-Stack Developer position. I've carefully reviewed the job description and your background. I'd like to approach this conversation thoughtfully, focusing on understanding both your technical capabilities and your problem-solving approach.\n\nLet's begin with something foundational: Could you walk me through your journey into software development? I'm particularly interested in what initially drew you to this field and how your perspective has evolved as you've gained experience.";

              const aiMessage = {
                id: 1,
                type: "ai",
                content: initialMessage,
                timestamp: new Date(),
              };
              setMessages([aiMessage]);

              setTimeout(() => {
                typeMessage(initialMessage, aiMessage.id);
              }, 500);
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <RiRefreshLine size={16} />
            <span>Revise Again</span>
          </button>
        </div>
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample voice transcription demo
  const sampleVoiceResponses = voiceResponsesData.sampleResponses;

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Typing animation effect
  const typeMessage = (text, messageId) => {
    setTypingMessageId(messageId);
    setDisplayedText("");

    let index = 0;
    const typingSpeed = 15; // milliseconds per character (faster typing)

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        // Auto-scroll during typing
        scrollToBottom();
      } else {
        clearInterval(typeInterval);
        setTypingMessageId(null);
        setDisplayedText("");
        // Final scroll when typing is complete
        scrollToBottom();
      }
    }, typingSpeed);

    return typeInterval;
  };

  const handleVoiceClick = () => {
    if (isVoiceActive) {
      // Stop voice recording
      setIsVoiceActive(false);
      setIsTranscribing(false);
      return;
    }

    // Start voice recording
    setIsVoiceActive(true);
    setIsTranscribing(true);

    // Simulate voice transcription after 3 seconds
    setTimeout(() => {
      const randomResponse =
        sampleVoiceResponses[
          Math.floor(Math.random() * sampleVoiceResponses.length)
        ];
      setVoiceTranscription(randomResponse);
      setCurrentMessage(randomResponse);
      setIsVoiceActive(false);
      setIsTranscribing(false);

      // Auto-send the transcribed message
      setTimeout(() => {
        const newMessage = {
          id: messages.length + 1,
          type: "user",
          content: randomResponse,
          timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);
        setCurrentMessage("");

        // Simulate AI response with typing animation
        setTimeout(() => {
          const newQuestionCount = questionCount + 1;
          setQuestionCount(newQuestionCount);

          let aiResponseText;
          if (newQuestionCount >= 3) {
            // After 3 questions, show performance review options
            aiResponseText =
              "Thank you for your detailed responses! I've gathered enough information to provide you with a comprehensive performance review. Would you like to:";
          } else {
            // Continue with regular questions
            const questions = [
              "I appreciate your thoughtful response. Let me build on that by asking about a specific technical challenge: Can you walk me through a time when you had to debug a complex issue in production? I'm particularly interested in your problem-solving methodology and how you balanced urgency with thoroughness.",
              "Excellent insights on debugging! Now I'd like to explore your leadership and collaboration skills. Can you describe a situation where you had to work with a difficult team member or stakeholder? How did you handle the situation and what was the outcome?",
              "Great example of collaboration! For my final question, let's discuss your approach to staying current with technology. How do you keep up with the rapidly evolving tech landscape, and can you give me an example of a new technology you recently learned and applied?",
            ];
            aiResponseText = questions[newQuestionCount - 1] || questions[0];
          }

          const aiResponse = {
            id: messages.length + 2,
            type: "ai",
            content: aiResponseText,
            timestamp: new Date(),
            showOptions: newQuestionCount >= 3,
          };
          setMessages((prev) => [...prev, aiResponse]);

          // Start typing animation
          typeMessage(aiResponseText, aiResponse.id);
        }, 1500);
      }, 500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="flex flex-col lg:flex-row gap-2 sm:gap-4 min-h-0 p-2 sm:p-4 lg:p-0"
        style={{ height: "100vh" }}
      >
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
                  auto_awesome
                </span>
                {firstSidebarOpen && (
                  <span className="text-sm">AI Interview</span>
                )}
              </a>

              <a
                href="#"
                className={`flex items-center ${
                  firstSidebarOpen ? "space-x-3 px-3" : "justify-center px-2"
                } py-2 text-gray-900 hover:bg-gray-50 rounded-md transition-colors`}
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

        {/* Second Sidebar - Job Description Input */}
        <div
          className={`${
            secondSidebarOpen ? "w-80" : "w-12 md:w-0"
          } bg-white transition-all duration-300 ${
            secondSidebarOpen ? "" : "md:hidden"
          } flex-shrink-0 h-full`}
        >
          <div className="w-80 flex flex-col h-full">
            {/* Header with collapse button */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isInterviewStarted ? "Interview Session" : "Resume Builder"}
                </h2>
                <button
                  onClick={() => setSecondSidebarOpen(!secondSidebarOpen)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    dock_to_left
                  </span>
                </button>
              </div>
            </div>

            {isInterviewStarted ? (
              /* Interview Video Sections */
              <div className="flex-1 p-4 space-y-4">
                {/* AI Interview Video */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    AI Interviewer
                  </h3>
                  <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <RiRobotLine size={24} className="text-white" />
                      </div>
                      <p className="text-white text-sm">AI Interviewer</p>
                    </div>
                  </div>
                </div>

                {/* User Video */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Your Video
                  </h3>
                  <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <RiUser3Fill size={24} className="text-gray-600" />
                      </div>
                      <p className="text-gray-600 text-sm">Camera Off</p>
                      <button className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors">
                        Enable Camera
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Tab Buttons */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab("paste-jd")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "paste-jd"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <RiFileCopyLine size={16} />
                      <span>Paste JD</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("upload-resume")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "upload-resume"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <RiUploadLine size={16} />
                      <span>Upload Resume</span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-4">
                  {activeTab === "paste-jd" && (
                    <div className="space-y-4 h-full flex flex-col">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description
                        </label>
                        <textarea
                          placeholder="Paste the job description here..."
                          value={jdContent}
                          onChange={(e) => setJdContent(e.target.value)}
                          className="w-full h-40 md:h-48 lg:h-56 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => setIsAnalyzed(true)}
                          disabled={!jdContent.trim()}
                          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Analyze JD
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "upload-resume" && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <RiFileTextLine
                              size={32}
                              className="text-gray-400"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Drop your resume here
                            </p>
                            <p className="text-xs text-gray-500">
                              or click to browse files
                            </p>
                          </div>
                          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                            Choose Resume
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Supports PDF, DOC, DOCX files up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Collapse button for second sidebar when closed - Always visible on laptop */}
        {!secondSidebarOpen && (
          <button
            onClick={() => setSecondSidebarOpen(true)}
            className="w-12 md:w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 mb-8 flex-shrink-0"
            title="Show Resume Builder"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              dock_to_right
            </span>
          </button>
        )}

        {/* Main Content - Responsive */}
        <div className="flex-1 bg-gray-50 px-4 lg:px-6 pb-4 lg:pb-6 overflow-y-auto">
          {isInterviewStarted ? (
            <div className="h-full flex flex-col min-h-0">
              {/* Interview Header */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={logoSvg}
                      alt="Logo"
                      className="w-10 h-7"
                      style={{ filter: "brightness(0)" }}
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        AI Interview - Total 10 Questions
                      </h2>
                      <p className="text-sm text-gray-600">
                        Full-Stack Developer Position
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsInterviewStarted(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    End Interview
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-2 lg:p-4 mb-4 overflow-y-auto min-h-0"
              >
                <div className="space-y-4 max-w-full">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.type === "user" ? (
                        <UserChatCard content={message.content} />
                      ) : message.isPerformanceReview ? (
                        <PerformanceReviewCard />
                      ) : (
                        <div className="max-w-3xl px-4 py-3">
                          <p className="text-base text-gray-900">
                            {typingMessageId === message.id
                              ? displayedText
                              : message.content}
                            {typingMessageId === message.id && (
                              <span className="inline-block w-2 h-5 bg-gray-900 ml-1 animate-pulse"></span>
                            )}
                          </p>
                          {/* Sparkle icon after AI response */}
                          {typingMessageId !== message.id && (
                            <div className="flex justify-start mt-2">
                              <RiSparklingFill
                                size={20}
                                className="text-purple-500"
                              />
                            </div>
                          )}

                          {/* Performance Review Options */}
                          {message.showOptions &&
                            typingMessageId !== message.id && (
                              <div className="flex flex-col space-y-2 mt-4">
                                <button
                                  onClick={() => {
                                    // Add performance review as AI message
                                    const performanceMessage = {
                                      id: messages.length + 1,
                                      type: "ai",
                                      content: "performance-review",
                                      timestamp: new Date(),
                                      isPerformanceReview: true,
                                    };
                                    setMessages((prev) => [
                                      ...prev,
                                      performanceMessage,
                                    ]);
                                  }}
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                  <RiBarChartBoxLine size={16} />
                                  <span>Review my performance</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setMessages([]);
                                    setQuestionCount(0);
                                    setIsInterviewStarted(false);
                                  }}
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                  <RiRefreshLine size={16} />
                                  <span>Revise again</span>
                                </button>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="px-2 lg:px-4 pb-4 flex-shrink-0">
                <div className="relative bg-white rounded-full border border-gray-300 transition-all duration-300 max-w-full">
                  {/* Voice Animation inside input */}
                  {isVoiceActive && (
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 h-4 bg-purple-500 rounded-full animate-pulse"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "1s",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder={
                      isVoiceActive ? "Listening..." : "Ask anything"
                    }
                    className={`w-full py-4 bg-transparent text-gray-900 placeholder-gray-500 rounded-full focus:outline-none ${
                      isVoiceActive ? "pl-20 pr-24" : "pl-6 pr-24"
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && currentMessage.trim()) {
                        const newMessage = {
                          id: messages.length + 1,
                          type: "user",
                          content: currentMessage,
                          timestamp: new Date(),
                        };
                        setMessages([...messages, newMessage]);
                        setCurrentMessage("");

                        // Simulate AI response
                        setTimeout(() => {
                          const aiResponse = {
                            id: messages.length + 2,
                            type: "ai",
                            content:
                              "That's a great answer! Let me ask you about your technical experience. Can you walk me through a challenging project you've worked on and how you overcame the obstacles?",
                            timestamp: new Date(),
                          };
                          setMessages((prev) => [...prev, aiResponse]);
                        }, 1500);
                      }
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative group ${
                        isVoiceActive
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={handleVoiceClick}
                      title="Voice input"
                    >
                      <RiMicLine size={18} />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {isVoiceActive ? "Stop recording" : "Voice input"}
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (currentMessage.trim()) {
                          const newMessage = {
                            id: messages.length + 1,
                            type: "user",
                            content: currentMessage,
                            timestamp: new Date(),
                          };
                          setMessages([...messages, newMessage]);
                          setCurrentMessage("");

                          // Simulate AI response with typing animation
                          setTimeout(() => {
                            const newQuestionCount = questionCount + 1;
                            setQuestionCount(newQuestionCount);

                            let aiResponseText;
                            if (newQuestionCount >= 3) {
                              // After 3 questions, show performance review options
                              aiResponseText =
                                "Thank you for your detailed responses! I've gathered enough information to provide you with a comprehensive performance review. Would you like to:";
                            } else {
                              // Continue with regular questions
                              const questions = [
                                "I appreciate your thoughtful response. Let me build on that by asking about a specific technical challenge: Can you walk me through a time when you had to debug a complex issue in production? I'm particularly interested in your problem-solving methodology and how you balanced urgency with thoroughness.",
                                "Excellent insights on debugging! Now I'd like to explore your leadership and collaboration skills. Can you describe a situation where you had to work with a difficult team member or stakeholder? How did you handle the situation and what was the outcome?",
                                "Great example of collaboration! For my final question, let's discuss your approach to staying current with technology. How do you keep up with the rapidly evolving tech landscape, and can you give me an example of a new technology you recently learned and applied?",
                              ];
                              aiResponseText =
                                questions[newQuestionCount - 1] || questions[0];
                            }

                            const aiResponse = {
                              id: messages.length + 2,
                              type: "ai",
                              content: aiResponseText,
                              timestamp: new Date(),
                              showOptions: newQuestionCount >= 3,
                            };
                            setMessages((prev) => [...prev, aiResponse]);

                            // Start typing animation
                            typeMessage(aiResponseText, aiResponse.id);
                          }, 1500);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative group ${
                        currentMessage.trim()
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-800 hover:bg-gray-900 text-white"
                      }`}
                      title="Send message"
                    >
                      <RiSendPlaneLine size={18} />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Send message
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !isAnalyzed ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-left max-w-2xl w-full">
                {/* Logo at the top */}
                <div className="flex justify-start mb-8">
                  <img
                    src={logoSvg}
                    alt="Mandal Minds Logo"
                    className="w-16 h-12"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Hey there, I am Mandal AI.
                  </h3>
                  <p className="text-lg text-gray-900">
                    I am your Assistant for interview process
                  </p>
                </div>

                <div className="space-y-6 text-left">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Few things to know about me:
                  </h4>

                  <div className="flex items-start space-x-4">
                    <RiQuestionLine
                      size={24}
                      className="text-purple-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Curious? Just ask
                      </h5>
                      <p className="text-gray-900">
                        I'm here to answer any questions you have about the
                        interview process
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <RiChatSmile3Line
                      size={24}
                      className="text-purple-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Chat with me about anything
                      </h5>
                      <p className="text-gray-900">
                        Feel free to discuss your career goals, concerns, or get
                        interview tips
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <RiLightbulbLine
                      size={24}
                      className="text-purple-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Better to start with resume or JD upload
                      </h5>
                      <p className="text-gray-900">
                        Upload your resume or job description to get
                        personalized interview preparation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6 w-full">
              {/* JD Analysis Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={logoSvg}
                    alt="Mandal Minds Logo"
                    className="w-10 h-7"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      AI Analysis Complete
                    </h2>
                    <p className="text-sm text-gray-600">
                      Job description analyzed successfully
                    </p>
                  </div>
                </div>

                {/* Job Focus */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Job Focus
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">
                      This position focuses on{" "}
                      <strong>full-stack development</strong> with emphasis on
                      modern web technologies, API development, and
                      collaborative software engineering practices. The role
                      requires strong problem-solving skills and experience with
                      agile methodologies.
                    </p>
                  </div>
                </div>

                {/* AI Assessment Points */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    AI Will Assess
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Technical Skills
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• JavaScript/TypeScript proficiency</li>
                        <li>• React.js and modern frameworks</li>
                        <li>• API design and integration</li>
                        <li>• Database management</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">
                        Soft Skills
                      </h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Problem-solving approach</li>
                        <li>• Team collaboration</li>
                        <li>• Communication skills</li>
                        <li>• Adaptability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Skills
                </h3>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 border border-gray-200 text-gray-800"
                    >
                      {skill}
                      <button
                        onClick={() =>
                          setSkills(skills.filter((_, i) => i !== index))
                        }
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <RiCloseLine size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Skill */}
                <div className="flex space-x-2 mb-6">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newSkill.trim()) {
                        setSkills([...skills, newSkill.trim()]);
                        setNewSkill("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newSkill.trim()) {
                        setSkills([...skills, newSkill.trim()]);
                        setNewSkill("");
                      }
                    }}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors flex items-center space-x-2"
                  >
                    <RiAddLine size={16} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Start Interview Button - Always Visible */}
                <div className="w-full sticky bottom-0 bg-white p-4 border-t border-gray-200 -mx-4 lg:-mx-6 -mb-4 lg:-mb-6 mt-4">
                  <button
                    onClick={() => {
                      const initialMessage =
                        "Hello! I'm here to conduct your interview for the Full-Stack Developer position. I've carefully reviewed the job description and your background. I'd like to approach this conversation thoughtfully, focusing on understanding both your technical capabilities and your problem-solving approach.\n\nLet's begin with something foundational: Could you walk me through your journey into software development? I'm particularly interested in what initially drew you to this field and how your perspective has evolved as you've gained experience.";

                      setIsInterviewStarted(true);
                      const aiMessage = {
                        id: 1,
                        type: "ai",
                        content: initialMessage,
                        timestamp: new Date(),
                      };
                      setMessages([aiMessage]);

                      // Start typing animation for initial message
                      setTimeout(() => {
                        typeMessage(initialMessage, aiMessage.id);
                      }, 500);
                    }}
                    className="w-full flex items-center justify-center space-x-3 px-6 lg:px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm lg:text-base"
                  >
                    <RiPlayFill size={20} />
                    <span>Start AI Interview</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
