import { Button, Container, Typography } from "@mui/material";
import React from "react";

const SelectDiffcultyPage = () => {
  const clickHandler = (e) => {
    console.log(e.target.id);
  };

  return (
    <Container>
      <Typography variant="h1">Select Difficulty</Typography>
      <Button id="btn-easy" variant="outlined" onClick={clickHandler}>
        Easy
      </Button>
      <Button id="btn-medium" variant="outlined" onClick={clickHandler}>
        Medium
      </Button>
      <Button id="btn-hard" variant="outlined" onClick={clickHandler}>
        Hard
      </Button>
    </Container>
  );
};

export default SelectDiffcultyPage;
