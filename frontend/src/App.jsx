import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarExample from "./components/Navbar";
import AuthRoute from "./pages/Authroute";
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route
          path="/leaderboards"
          element={<AuthRoute component={LeaderboardPage} />}
        />
        <Route path="/rooms" element={<AuthRoute component={RoomPage} />} />
        <Route
          path="/start-game/:roomId"
          element={<AuthRoute component={StartGamePage} />}
        />
        <Route
          path="/start-questions/:roomId"
          element={<AuthRoute component={StartQuestionsPage} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
