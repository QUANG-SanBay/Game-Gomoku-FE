import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home";
import { isLoggedIn } from "../utils/auth";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={isLoggedIn() ? <Home /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default AppRoutes;
