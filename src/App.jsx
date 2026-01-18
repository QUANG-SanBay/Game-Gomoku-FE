import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import BoardContainer from "./board/BoardContainer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Navbar from "./components/Navbar";
import { isLoggedIn } from "./utils/auth";

function App() {
  return (
    <Router>
      <div className="app-main">
        {isLoggedIn() && <Navbar />}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Sau khi login mới vào được game */}
          <Route
            path="/"
            element={
              isLoggedIn() ? (
                <BoardContainer initialSize={15} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// Trong quá trình phát triển, file App.jsx được sử dụng làm component gốc.
// Hệ thống được thiết kế để chỉ cho phép người dùng truy cập vào giao diện chơi game sau khi đăng nhập thành công.
// Khi người dùng chưa đăng nhập, hệ thống tự động điều hướng đến trang Login.
// Sau khi đăng nhập, giao diện BoardContainer (game Gomoku) được hiển thị.