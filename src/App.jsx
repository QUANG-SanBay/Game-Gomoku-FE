import { useState } from "react";

import MainMenu from "./pages/MainMenu";
import Lobby from "./components/Lobby/Lobby";
import Board from "./components/Board/Board";
import Leaderboard from "./pages/Leaderboard";

// ✅ ĐÚNG THEO CÂY THƯ MỤC THỰC TẾ
import MyProfile from "./components/UseProfile/MyProfile";
import OtherProfile from "./components/UseProfile/OtherProfile";

import "./App.css";

function App() {
  const [screen, setScreen] = useState("menu");
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <>
      {screen === "menu" && (
        <MainMenu
          onPlayOnline={() => setScreen("lobby")}
          onLeaderboard={() => setScreen("leaderboard")}
          onMyProfile={() => setScreen("my-profile")}
        />
      )}

      {screen === "lobby" && (
        <Lobby
          onStart={() => setScreen("board")}
          onBack={() => setScreen("menu")}
        />
      )}

      {screen === "board" && (
        <Board onBack={() => setScreen("menu")} />
      )}

      {screen === "leaderboard" && (
        <Leaderboard
          onBack={() => setScreen("menu")}
          onViewProfile={(userId) => {
            setSelectedUserId(userId);
            setScreen("other-profile");
          }}
        />
      )}

      {screen === "my-profile" && (
        <MyProfile onBack={() => setScreen("menu")} />
      )}

      {screen === "other-profile" && selectedUserId && (
        <OtherProfile
          userId={selectedUserId}
          onBack={() => setScreen("leaderboard")}
        />
      )}
    </>
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import BoardContainer from "./board/BoardContainer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import GameRoom from "./pages/GameRoom/GameRoom";
import Navbar from "./components/Navbar";
import { isLoggedIn } from "./utils/auth";

function App() {
  const loggedIn = isLoggedIn();

  return (
    <Router>
      <div className="app-main">
        {loggedIn && <Navbar />}

        <Routes>
          <Route
            path="/login"
            element={loggedIn ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={loggedIn ? <Navigate to="/" replace /> : <Register />}
          />

          <Route
            path="/"
            element={
              loggedIn ? (
                <BoardContainer initialSize={15} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/game"
            element={
              loggedIn ? (
                <GameRoom />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
