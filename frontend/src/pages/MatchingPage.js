import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
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
    const { findMatch, disconnect, matchState } = useMatchingService({
        enabled: true,
    });
    const { user, setUser } = useContext(UserContext);
    const [timer, setTimer] = useState({ hasFinished: false, isRendered: true });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");

    const closeDialog = () => setIsDialogOpen(false);
    const closeFailDialog = () => {
        setIsDialogOpen(false);
        navigate("/select");
    };
    const closeSuccessDialog = () => {
        setIsDialogOpen(false);
        navigate(`/room/${matchState.roomId}`);
    };

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Success");
        setDialogMsg(msg);
    };

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Failure");
        setDialogMsg(msg);
    };

    // Runs when the component unmounts
    useEffect(() => {
        return disconnect;
    }, []);

    useEffect(() => {
        if (user && !matchState.isPending) {
            findMatch({ username: user.username, difficultyLevel: user.difficultyLevel });
        }
    }, [user]);

    useEffect(() => {
        if (matchState.isSuccess && matchState.roomId) {
            setSuccessDialog("Found a match!");
        }

        if (matchState.hasFailed) {
            setErrorDialog("Unable to find a match, please try again :(");
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
                    {matchState.isSuccess && matchState.roomId && (
                        <Button onClick={closeSuccessDialog}>Go to room!</Button>
                    )}
                    {matchState.hasFailed && (
                        <Button onClick={closeFailDialog}>Return to Select</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MatchingPage;
