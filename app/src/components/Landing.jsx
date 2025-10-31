import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import flogoSvg from '../assets/flogo.svg'

export default function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const navigate = useNavigate()

  const handleAuth = (provider) => {
    setIsLoading(true)
    // Simulate authentication process
    setTimeout(() => {
      // Firebase authentication would go here
      navigate('/resume')
    }, 1500)
  }

  const handleGoogleSignIn = () => handleAuth('google')
  const handleMicrosoftSignIn = () => handleAuth('microsoft')
  const handleAppleSignIn = () => handleAuth('apple')
  const handleEmailSignIn = () => handleAuth('email')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
          <div className="text-center">
            <img src={flogoSvg} alt="Mandal Minds Logo" className="w-48 h-16 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 text-lg">Signing you in...</p>
          </div>
        </div>
      )}

      {/* Logo Above Modal */}
      {!isLoading && (
        <div className="mb-8">
          <img src={flogoSvg} alt="Mandal Minds Logo" className="w-36 h-12 mx-auto" />
        </div>
      )}

      {/* Signup Modal */}
      {isModalOpen && !isLoading && (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start today with One-Click Sign Up!</h3>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>

            <div className="space-y-4">
              {/* Social Sign In Options */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center px-4 py-3 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                <button
                  onClick={handleMicrosoftSignIn}
                  className="flex items-center justify-center px-4 py-3 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                    <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                </button>

                <button
                  onClick={handleAppleSignIn}
                  className="flex items-center justify-center px-4 py-3 bg-[linear-gradient(180deg,#ffffff_0%,#f0f0f0_100%)] hover:bg-[linear-gradient(180deg,#f8f8f8_0%,#e8e8e8_100%)] border border-[#c8c8c8] hover:border-[#b0b0b0] rounded-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 text-[#3c4043] bg-white border rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none transition-all placeholder:text-[#80868b] ${
                    isEmailFocused ? 'border-[#a854ff] shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)]' : 'border-[#dfe1e5]'
                  }`}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 text-[#3c4043] bg-white border rounded-lg shadow-[0_1px_6px_rgba(32,33,36,0.08)] focus:outline-none transition-all placeholder:text-[#80868b] ${
                    isPasswordFocused ? 'border-[#a854ff] shadow-[0_1px_6px_rgba(32,33,36,0.15),0_0_0_3px_rgba(124,0,255,0.2)]' : 'border-[#dfe1e5]'
                  }`}
                />
              </div>

              {/* Sign In Button */}
              <button
                onClick={handleEmailSignIn}
                className="w-full bg-[linear-gradient(180deg,#9a33ff_0%,#7c00ff_100%)] hover:bg-[linear-gradient(180deg,#aa44ff_0%,#8c11ff_100%)] text-white font-medium py-3 px-4 rounded-lg transition-all border border-[#a854ff] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                Sign In
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900">Privacy Policy</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
