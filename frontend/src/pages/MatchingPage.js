import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import { UserContext } from "../contexts/UserContext";
import { useMatchingService } from "../hooks/useMatchingService";

// The countdown timer interval in seconds
const TIMER_INTERVAL = 5;

const MatchingPage = () => {
    const navigate = useNavigate();
    const { findMatchWithDifficulty, findMatchWithTopic, disconnect, matchState } = useMatchingService({
        enabled: true,
    });
    const { user, setUser } = useContext(UserContext);
    const [timer, setTimer] = useState({
        hasFinished: false,
        isRendered: true,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");

    const closeDialog = () => setIsDialogOpen(false);
    const closeFailDialog = () => {
        setIsDialogOpen(false);
        navigate("/select");
    };
    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Failure");
        setDialogMsg(msg);
    };

    // Runs when the component unmounts
    useEffect(() => {
        return () => disconnect();
    }, []);

    useEffect(() => {
        if (user && !matchState.isPending) {

            if (user.topic == null) {
                findMatch({
                    username: user.username,
                    difficultyLevel: user.difficultyLevel,
                });
            } else if (user.difficultyLevel == null) {
                findMatch({
                    username: user.username,
                    difficultyLevel: user.topic,
                });
            } else {
                alert("Invalid Matching Request")
                navigate("/select");
            }
        } else {
            alert("Please login again")
            navigate("/login");
        }
    }, [user]);

    useEffect(() => {
        if (matchState.isSuccess && matchState.roomId) {
            stopRenderingTimer();
            setUser((prevState) => {
                return {
                    ...prevState,
                    room: matchState.roomId,
                };
            });
        }

        if (matchState.hasFailed) {
            setErrorDialog("Unable to find a match, please try again :(");
        }
    }, [matchState]);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.room) {
            navigate(`/room/${matchState.roomId}`);
        }
    }, [user]);

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
            <Typography variant="h2">Finding match...</Typography>
            {timer.isRendered && (
                <CountdownTimer
                    interval={TIMER_INTERVAL}
                    handleFinishedTimer={handleTimeout}
                    callback={stopRenderingTimer}
                />
            )}
            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {matchState.hasFailed && (
                        <Button onClick={closeFailDialog}>
                            Return to Select
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MatchingPage;
