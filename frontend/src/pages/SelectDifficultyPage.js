import { Button, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const SelectDiffcultyPage = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const clickDifficulty = (e) => {
        console.log(e.target.id);
        setUser((prevState) => {
            return {
                ...prevState,
                hasSelectedDifficulty: true,
                difficultyLevel: e.target.value,
            };
        });
        navigate("/matching");
    };

    return (
        <Stack padding="5%">
            <Typography variant="h2">Select Difficulty</Typography>
            <br></br>
            <Button
                id="btn-easy"
                value="easy"
                color="success"
                size="large"
                variant="outlined"
                onClick={clickDifficulty}
            >
                Easy
            </Button>
            <br></br>
            <br></br>
            <Button
                id="btn-medium"
                value="medium"
                size="large"
                variant="outlined"
                onClick={clickDifficulty}
            >
                Medium
            </Button>
            <br></br>
            <br></br>
            <Button
                id="btn-hard"
                value="hard"
                color="error"
                size="large"
                variant="outlined"
                onClick={clickDifficulty}
            >
                Hard
            </Button>
        </Stack>
    );
};

export default SelectDiffcultyPage;
