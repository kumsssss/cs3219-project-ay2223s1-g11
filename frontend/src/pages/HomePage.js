import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
    let navigate = useNavigate();

    const handleFindMatch = () => {
        navigate("/select");
    };

    return (
        <Stack padding="10%">
            <Typography variant="h2" color="inherit" component="div">
                Welcome to PeerPrep.
            </Typography>
            <br></br>
            <Button variant={"outlined"} onClick={handleFindMatch}>
                Find a match!
            </Button>
        </Stack>
    );
}

export default HomePage;
