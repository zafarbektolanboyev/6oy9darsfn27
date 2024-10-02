import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    } else if (!location.pathname.includes('register')) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  function ProtectedRoute({ isAuthenticated, children }) {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login");
      } 
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
  }

  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={!!token}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute isAuthenticated={!!token}>
              <About />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
