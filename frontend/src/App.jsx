import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarExample from "./components/Navbar";
import Home from "./pages/Home";
import LeaderboardPage from "./pages/Leadboard";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import RoomPage from "./pages/Room";
import StartGamePage from "./pages/StartGame";
import StartQuestionsPage from "./pages/StartQuestion";

export default function App() {
  return (
    <BrowserRouter>
      <NavbarExample login="Login" signup="Signup" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboards" element={<LeaderboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/start-game/:roomId" element={<StartGamePage />} />
        <Route path="/start-questions/:roomId" element={<StartQuestionsPage />} />

      </Routes>
    </BrowserRouter>
  );
}
