import {
  BrowserRouter as Router,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import Landing from "./components/Landing";
import Resume from "./components/Resume";
import ManageJDs from "./components/ManageJDs";
import ManageResume from "./components/ManageResume";
import AnalyzeResume from "./components/AnalyzeResume";
import EditResume from "./components/EditResume";
import ResumeEditor from "./components/ResumeEditor";

function App() {
  const isProd = process.env.NODE_ENV === "production";

  // In production on GitHub Pages, HashRouter guarantees refresh-safe routing without 404s
  const RouterComponent = isProd ? HashRouter : Router;
  const basename = isProd ? undefined : "";

  return (
    <RouterComponent basename={basename}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/manage-jds" element={<ManageJDs />} />
        <Route path="/manage-resume" element={<ManageResume />} />
        <Route path="/analyze-resume" element={<AnalyzeResume />} />
        <Route path="/edit-resume" element={<EditResume />} />
        <Route path="/resume-editor" element={<ResumeEditor />} />
      </Routes>
    </RouterComponent>
  );
}

export default App;
