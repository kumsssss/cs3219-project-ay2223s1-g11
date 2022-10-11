import React, { useEffect, useState } from "react";
import { Typography, Stack } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

/**
 * Displays timer for specified interval and calls the callback function
 * when the time interval is finished.
 *
 * Note that to render timer is finished, "0" will be displayed for 1 second.
 * Therefore, actual duration: interval + 1.
 */
const CountdownTimer = ({ interval, handleFinishedTimer, callback }) => {
    const [seconds, setSeconds] = useState(interval);
    const [hasFinished, setHasFinished] = useState(false);

    const handleCallback = () => {
        if (seconds === 0) {
            setHasFinished(true);
            handleFinishedTimer();
        } else if (seconds === -1) {
            callback();
        }
    };

    const updateTimer = () => {
        console.log(seconds, "timer");
        setSeconds((prevState) => prevState - 1);
    };

    const countdownHandler = () => {
        if (seconds >= 0) {
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    };

    useEffect(() => {
        handleCallback();
    }, [seconds]);

    useEffect(() => {
        return countdownHandler();
    });

    return (
        <Stack>
            <LinearProgress />
            <br></br>
            <Typography variant="h4">Time left: {seconds} seconds</Typography>
            <Typography variant="h4">Total time: {interval} seconds</Typography>
        </Stack>
    );
};

export default CountdownTimer;
