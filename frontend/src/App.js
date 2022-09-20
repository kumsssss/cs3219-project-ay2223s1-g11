import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";

import { UserContext } from "./contexts/UserContext";

import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MatchPage from "./pages/MatchPage";
import ProfilePage from "./pages/ProfilePage";
import MatchingPage from "./pages/MatchingPage";
import SelectDiffcultyPage from "./pages/SelectDiffcultyPage";

function App() {
    const [user, setUser] = useState(null);
    const value = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"}>
                <Router>
                    <Header></Header>
                    <UserContext.Provider value={value}>
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={<Navigate replace to="/login" />}
                            ></Route>
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/match" element={<MatchPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/select" element={<SelectDiffcultyPage />} />
                            <Route path="/matching" element={<MatchingPage />} />
                        </Routes>
                    </UserContext.Provider>
                </Router>
            </Box>
        </div>
    );
}

export default App;
