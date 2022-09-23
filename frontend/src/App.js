import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";

import { UserContext } from "./contexts/UserContext";
import { JwtContext } from "./contexts/JwtContext";

import Header from "./components/Header";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MatchingPage from "./pages/MatchingPage";
import SelectDiffcultyPage from "./pages/SelectDiffcultyPage";

function App() {
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
    const jwtValue = useMemo(() => ({ jwt, setJwt }), [jwt, setJwt]);

    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"}>
                <Router>
                    <UserContext.Provider value={userValue}>
                        <JwtContext.Provider value={jwtValue}>
                            <Header></Header>
                            <Routes>
                                <Route
                                    exact
                                    path="/"
                                    element={<Navigate replace to="/login" />}
                                ></Route>
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/select" element={<SelectDiffcultyPage />} />
                                <Route path="/matching" element={<MatchingPage />} />
                            </Routes>
                        </JwtContext.Provider>
                    </UserContext.Provider>
                </Router>
            </Box>
        </div>
    );
}

export default App;
