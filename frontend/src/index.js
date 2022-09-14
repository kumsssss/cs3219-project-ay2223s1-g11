import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import MatchPage from "./components/MatchPage";
import ProfilePage from "./components/ProfilePage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <App />
        <Routes>
            <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
