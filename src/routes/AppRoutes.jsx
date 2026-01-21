import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home";
import GamePlay from "../pages/GameRoom/GamePlay";
import Leaderboard from "../pages/Leaderboard";
import MyProfile from "../components/UserProfile/MyProfile";
import OtherProfile from "../components/UserProfile/OtherProfile";
import Lobby from "../components/Lobby/Lobby";
import RoomList from "../pages/RoomList/RoomList";
import WaitingRoom from "../pages/WaitingRoom/WaitingRoom";
import { isLoggedIn } from "../utils/auth";

function AppRoutes() {
  const loggedIn = isLoggedIn();

  return (
    <Routes>
      {/* Public routes - redirect to home if already logged in */}
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={loggedIn ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Protected routes - redirect to login if not authenticated */}
      <Route
        path="/"
        element={loggedIn ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/rooms"
        element={loggedIn ? <RoomList /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/lobby"
        element={loggedIn ? <Lobby /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/waiting-room"
        element={loggedIn ? <WaitingRoom /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/game"
        element={loggedIn ? <GamePlay /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/profile"
        element={loggedIn ? <MyProfile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/user/:userId"
        element={loggedIn ? <OtherProfile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/leaderboard"
        element={loggedIn ? <Leaderboard /> : <Navigate to="/login" replace />}
      />

      {/* Catch all - redirect to home or login */}
      <Route
        path="*"
        element={<Navigate to={loggedIn ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
