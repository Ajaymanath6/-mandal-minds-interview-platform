import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiNotification3Line,
  RiMenuLine,
  RiFileList3Line,
  RiBookmarkLine,
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
  RiArrowRightLine,
  RiUploadLine,
  RiFileTextLine,
} from "@remixicon/react";
import Sidebar from "./Sidebar";
import ResumeBuilderSidebar from "./ResumeBuilderSidebar";
import AISearchBar from "./AISearchBar";
import logoSvg from "../assets/logo.svg";
import voiceResponsesData from "../data/voiceResponses.json";

export default function Resume() {
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(true);
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
  const [savedJDs, setSavedJDs] = useState([]);
  const [jdUploaded, setJdUploaded] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeSelectionModal, setResumeSelectionModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const resumeFileInputRef = useRef(null);
  const [externalJDFile, setExternalJDFile] = useState(null);

  // Sample resumes - in real app this would come from API
  const SAMPLE_RESUMES = [
    {
      id: 1,
      resumeName: "Frontend Developer Resume",
      created: "2024-01-15",
      lastEdited: "2024-01-20",
    },
    {
      id: 2,
      resumeName: "Full-Stack Developer Resume",
      created: "2024-01-10",
      lastEdited: "2024-01-18",
    },
    {
      id: 3,
      resumeName: "Backend Developer Resume",
      created: "2024-01-08",
      lastEdited: "2024-01-15",
    },
  ];

  // Custom User Chat Card Component with Layered Effect - Responsive
  const UserChatCard = ({ content }) => {
    return (
      <div className="relative mx-auto w-fit max-w-xs sm:max-w-md lg:max-w-2xl">
        {/* Bottom Layer (deepest) */}
        <div className="absolute top-2 left-2 bg-gray-300 rounded-3xl border border-gray-400 p-3 sm:p-4 lg:p-6 min-w-32 sm:min-w-48 lg:min-w-64 max-w-xs sm:max-w-md lg:max-w-2xl opacity-40">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap invisible">
            {content}
          </p>
        </div>

        {/* Middle Layer */}
        <div className="absolute top-1 left-1 bg-gray-200 rounded-3xl border border-gray-300 p-3 sm:p-4 lg:p-6 min-w-32 sm:min-w-48 lg:min-w-64 max-w-xs sm:max-w-md lg:max-w-2xl opacity-60">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap invisible">
            {content}
          </p>
        </div>

        {/* Top Layer (main visible content) */}
        <div className="relative bg-white rounded-3xl border border-gray-200 p-3 sm:p-4 lg:p-6 w-fit min-w-32 sm:min-w-48 lg:min-w-64 max-w-xs sm:max-w-md lg:max-w-2xl">
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
      <div className="max-w-4xl bg-white rounded-xl border border-gray-200 overflow-hidden">
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
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 active:bg-black active:text-white border border-gray-300 hover:border-black rounded-lg transition-all"
            style={{ color: "#575757" }}
          >
            <RiArrowLeftLine size={16} />
            <span>Back to Topics</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 active:bg-black active:text-white border border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-lg transition-all">
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
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 active:bg-black active:text-white border border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-lg transition-all"
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
    <div className="min-h-screen" style={{ backgroundColor: "#fcfcfb" }}>
      <div
        className="flex flex-col lg:flex-row min-h-0 p-2 sm:p-4 lg:p-0"
        style={{ height: "100vh" }}
      >
        {/* First Sidebar - Always Visible */}
          <Sidebar activeItem="home" />

        {/* Second Sidebar - Resume Builder */}
        <ResumeBuilderSidebar
          isOpen={secondSidebarOpen}
          onToggle={() => setSecondSidebarOpen(!secondSidebarOpen)}
          onJDUploaded={(file, text) => {
            // Set the external JD file to trigger AISearchBar upload
            setExternalJDFile(file);
            // Reset after a short delay to allow re-uploads
            setTimeout(() => {
              setExternalJDFile(null);
            }, 100);
            // Also update JD content
            setJdContent(text);
          }}
        />

        {/* Main Content - Responsive */}
        <div className="flex-1 px-4 lg:px-6 pb-4 lg:pb-6 overflow-y-auto" style={{ backgroundColor: "#fcfcfb" }}>
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-3xl transition-colors"
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
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 active:bg-black active:text-white border border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-lg transition-all"
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
                                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 active:bg-black active:text-white border border-gray-300 hover:border-black text-gray-700 hover:text-black rounded-lg transition-all"
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative group ${
                        isVoiceActive
                          ? "bg-black hover:bg-gray-900 active:bg-black text-white border border-black"
                          : "bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white text-gray-700"
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative group ${
                        currentMessage.trim()
                          ? "bg-black hover:bg-gray-900 active:bg-black text-white border border-black"
                          : "bg-gray-800 hover:bg-gray-900 active:bg-black text-white"
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
            <div className="flex items-center justify-center h-full py-8">
              <div className="w-full max-w-5xl px-4">
                {/* Greeting */}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: "#0A0A0A" }}>
                    Hello, {localStorage.getItem("userName") || "User"} 👋
                  </h2>
                </div>

                {/* AI Search Bar Component */}
                <AISearchBar
                  onCompare={(jdContent) => {
                    // Set JD content in sidebar and trigger analysis
                    setJdContent(jdContent);
                    // Update sidebar JD content if it's open
                    if (secondSidebarOpen) {
                      // The sidebar will automatically update via jdContent prop
                    }
                  }}
                  onSaveJD={(jdContent) => {
                    // Save JD to saved list
                    const newJD = {
                      id: Date.now(),
                      title: `JD ${savedJDs.length + 1}`,
                      content: jdContent,
                      dateAdded: new Date().toISOString(),
                    };
                    setSavedJDs([...savedJDs, newJD]);
                    
                    // Also update the JD content in sidebar
                    setJdContent(jdContent);
                  }}
                  externalJDFile={externalJDFile}
                  onJDUploaded={(jdContent, fileName) => {
                    // JD has been uploaded successfully
                    setJdContent(jdContent);
                    setJdUploaded(true);
                  }}
                  secondSidebarOpen={secondSidebarOpen}
                />

                {/* Resume Upload Badge - Appears below text area after JD is loaded */}
                {jdUploaded && (
                  <div className="mt-4 w-full max-w-4xl mx-auto">
                    {/* Hidden file input for resume upload */}
                    <input
                      type="file"
                      ref={resumeFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setResumeFile(file);
                          setSelectedResume({
                            id: Date.now(),
                            resumeName: file.name,
                            isFile: true,
                          });
                        }
                      }}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      id="resume-file-upload"
                    />

                    {/* Resume Badge - Shows below text area */}
                    {selectedResume && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        {/* Green Check Icon */}
                        <svg
                          className="w-5 h-5 text-green-600 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {/* File Name */}
                        <span className="text-sm font-medium text-gray-900">
                          {selectedResume.resumeName}
                        </span>
                        {/* Cross Icon */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedResume(null);
                            setResumeFile(null);
                            if (resumeFileInputRef.current) {
                              resumeFileInputRef.current.value = "";
                            }
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                          aria-label="Remove file"
                          type="button"
                        >
                          <RiCloseLine size={18} />
                        </button>
                      </div>
                    )}

                    {/* Start Interview Button */}
                    {selectedResume && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            // Set JD content and trigger analysis
                            setIsAnalyzed(true);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] rounded-2xl transition-all font-medium text-sm"
                        >
                          <RiPlayFill size={20} />
                          <span>Start Interview</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-center h-full gap-4 lg:gap-6">
              <div className="max-w-4xl space-y-4 lg:space-y-6 w-full flex-1">
                {/* JD Analysis Header */}
                <div className="bg-white rounded-lg p-4 lg:p-6">
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
                        requires strong problem-solving skills and experience
                        with agile methodologies.
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
                <div className="bg-white rounded-lg p-4 lg:p-6">
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
                      className="flex-1 px-3 py-2 text-[#3c4043] bg-white border border-[#dfe1e5] rounded-md focus:outline-none focus:border-black transition-all placeholder:text-[#80868b]"
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
                      className="px-4 py-2 bg-gray-900 hover:bg-gray-800 active:bg-black text-white rounded-3xl transition-colors flex items-center space-x-2"
                    >
                      <RiAddLine size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                </div>
              </div>
              {/* Start Interview Button - Right Side */}
              <div className="w-full lg:w-auto lg:sticky lg:top-4 lg:self-start">
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
                  className="w-full lg:w-auto flex items-center justify-center space-x-3 px-6 lg:px-8 py-3 bg-black hover:bg-gray-900 active:bg-black text-white font-semibold rounded-lg transition-all border border-black text-sm lg:text-base"
                >
                  <RiPlayFill size={20} />
                  <span>Start AI Interview</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Selection Modal */}
      {resumeSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Resume from Existing
              </h3>
              <button
                onClick={() => setResumeSelectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Choose a resume from your existing resumes to use for the interview
            </p>

            <div className="space-y-3 mb-6">
              {SAMPLE_RESUMES.map((resume) => {
                const isSelected = selectedResume?.id === resume.id && !selectedResume?.isFile;
                return (
                  <div
                    key={resume.id}
                    onClick={() => {
                      setSelectedResume(resume);
                    }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RiFileTextLine size={24} className="text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {resume.resumeName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Last edited: {new Date(resume.lastEdited).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // The resume is already selected when clicking on it in the list
                  // This button is just for confirmation/closing
                  setResumeSelectionModal(false);
                }}
                className="flex-1 px-6 py-3 bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] rounded-lg transition-all font-medium"
              >
                Done
              </button>
              <button
                onClick={() => setResumeSelectionModal(false)}
                className="px-6 py-3 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] text-gray-900 rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
