import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppBar from "./components/AppBar";
import LetterPage from "./pages/LetterPage"; // Create this component

const App: React.FC = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<AppBar />} />
          <Route path="/letter" element={<LetterPage />} />
        </Routes>
      </Router>
  );
};

export default App;
