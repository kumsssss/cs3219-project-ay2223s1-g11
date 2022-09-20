import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./components/SignupPage";
import { Box } from "@mui/material";
import SelectDiffcultyPage from "./pages/SelectDiffcultyPage";
import { useMemo, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import MatchingPage from "./pages/MatchingPage";

function App() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <div className="App">
      <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
        <Router>
          <UserContext.Provider value={value}>
            <Routes>
              <Route
                exact
                path="/"
                element={<Navigate replace to="/signup" />}
              ></Route>
              <Route path="/signup" element={<SignupPage />} />
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
