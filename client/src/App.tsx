import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppBar from "./components/AppBar";
import LetterPage from "./pages/LetterPage"; // Create this component
import { Home } from "./components/Hero";

const App: React.FC = () => {
  return (
    <Router>
      <AppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/letter" element={<LetterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
