import {
  BrowserRouter as Router,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import Landing from "./components/Landing";
import Resume from "./components/Resume";
import GetVetted from "./pages/GetVetted";
import ManageJDsPage from "./pages/ManageJDsPage";
import ManageResumePage from "./pages/ManageResumePage";
import AnalyzeResume from "./components/AnalyzeResume";
import EditResume from "./pages/EditResume";
import AIResume from "./components/AIResume";

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
        <Route path="/get-vetted" element={<GetVetted />} />
        <Route path="/manage-jds" element={<ManageJDsPage />} />
        <Route path="/manage-resume" element={<ManageResumePage />} />
        <Route path="/analyze-resume" element={<AnalyzeResume />} />
        <Route path="/edit-resume" element={<EditResume />} />
        <Route path="/ai-resume" element={<AIResume />} />
      </Routes>
    </RouterComponent>
  );
}

export default App;
