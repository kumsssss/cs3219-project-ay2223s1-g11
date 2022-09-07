import { Button, Container, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const SelectDiffcultyPage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // For testing
  useEffect(() => {
    if (!user) {
      setUser({ hasSelectedDifficulty: false, difficultyLevel: null });
    }
  });

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
    <Container>
      <Typography variant="h1">Select Difficulty</Typography>
      <Button
        id="btn-easy"
        value="easy"
        variant="outlined"
        onClick={clickDifficulty}
      >
        Easy
      </Button>
      <Button
        id="btn-medium"
        value="medium"
        variant="outlined"
        onClick={clickDifficulty}
      >
        Medium
      </Button>
      <Button
        id="btn-hard"
        value="hard"
        variant="outlined"
        onClick={clickDifficulty}
      >
        Hard
      </Button>
    </Container>
  );
};

export default SelectDiffcultyPage;
