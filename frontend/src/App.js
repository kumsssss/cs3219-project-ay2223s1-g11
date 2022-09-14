import { Box } from "@mui/material";
import Header from "./components/Header";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"}>
                <Header></Header>
            </Box>
        </div>
    );
}

export default App;
