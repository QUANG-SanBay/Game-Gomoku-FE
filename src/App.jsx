import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home";
import GameRoom from "./pages/GameRoom/GameRoom";
import Navbar from "./components/Navbar";
import { isLoggedIn } from "./utils/auth";

function App() {
  const loggedIn = isLoggedIn();

  return (
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
          element={loggedIn ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/game"
          element={loggedIn ? <GameRoom /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
