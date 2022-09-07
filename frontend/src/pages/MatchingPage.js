import { Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import { UserContext } from "../contexts/UserContext";
import { useMatchingService } from "../hooks/useMatchingService";

// The countdown timer interval in seconds
const SECONDS = 1;

const MatchingPage = () => {
  const navigate = useNavigate();
  const { findMatch, disconnect, matchState } = useMatchingService({
    enabled: true,
  });
  const { user, setUser } = useContext(UserContext);
  const [timer, setTimer] = useState({ hasFinished: false, isRendered: true });

  // Runs when the component unmonts
  useEffect(() => {
    return disconnect;
  }, []);

  useEffect(() => {
    if (user && !matchState.isPending) {
      findMatch(user.difficultyLevel);
    }
  }, [user]);

  useEffect(() => {
    if (matchState.isSuccess && matchState.roomId) {
      navigate(`/room/${matchState.roomId}`);
    }

    if (matchState.hasFailed) {
      navigate("/select");
    }
  }, [matchState]);

  const stopRenderingTimer = () => {
    setTimer((prevState) => {
      const newState = { ...prevState };
      newState.isRendered = false;
      return newState;
    });
  };

  const handleTimeout = () => {
    //Todo
  };

  return (
    <Container>
      Hello
      {timer.isRendered && (
        <CountdownTimer
          interval={SECONDS}
          handleFinishedTimer={handleTimeout}
          callback={stopRenderingTimer}
        />
      )}
    </Container>
  );
};

export default MatchingPage;
