import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
    let navigate = useNavigate();

    const goToDifficultyPage = () => {
        navigate("/selectDifficulty");
    };

    const goToTopicPage = () => {
        navigate("/selectTopic");
    };

    return (
        <Stack padding="10%">
            <Typography variant="h2" color="inherit" component="div">
                Welcome to PeerPrep.
            </Typography>
            <br></br>
            <Button variant={"outlined"} onClick={goToDifficultyPage}>
                Find a match via Difficulty!
            </Button>
            <br></br>
            <Button variant={"outlined"} onClick={goToTopicPage}>
                Find a match via Topic!
            </Button>
        </Stack>
    );
}

export default HomePage;
