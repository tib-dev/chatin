import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";

//

const PrivateRoute = ({ element }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  return accessToken ? element : <Navigate to="/login" replace />;
};

const AuthRoute = ({ element }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  return accessToken ? <Navigate to="/profile" replace /> : element;
};

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthRoute element={<Login />} />} />
        <Route path="/signup" element={<AuthRoute element={<SignUp />} />} />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/settings"
          element={<PrivateRoute element={<Settings />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
