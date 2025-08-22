import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Resume from './components/Resume'
import ManageJDs from './components/ManageJDs'
import ManageResume from './components/ManageResume'
import AnalyzeResume from './components/AnalyzeResume'

function App() {
  // Get the base path for GitHub Pages
  const basename = process.env.NODE_ENV === 'production' ? '/-mandal-minds-interview-platform' : ''
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/manage-jds" element={<ManageJDs />} />
        <Route path="/manage-resume" element={<ManageResume />} />
        <Route path="/analyze-resume" element={<AnalyzeResume />} />
      </Routes>
    </Router>
  )
}

export default App
