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
