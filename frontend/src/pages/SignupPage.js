import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { createUser } from "../services/UserService";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "../constants";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            navigate("/home");
        }
    })

    const handleSignup = async () => {
        setIsSignupSuccess(false);
        try {
            const res = await createUser({ username: username, password: password });
            if (res && res.status === STATUS_CODE_CREATED) {
                setSuccessDialog("Account successfully created");
                setIsSignupSuccess(true);
                navigate("/login");
            }
        } catch (err) {
            setErrorDialog("Unable to signup, please try again.");
        }
    };

    const handleLogin = () => {
        navigate("/login");
    }

    const closeDialog = () => setIsDialogOpen(false);

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Success");
        setDialogMsg(msg);
    };

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Error");
        setDialogMsg(msg);
    };

    return (
        <Box
            display="flex"
            flexDirection={"column"}
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            {" "}
            <Typography variant={"h3"} marginBottom={"2rem"}>
                Sign Up
            </Typography>
            <TextField
                label="Username"
                variant="standard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "1rem" }}
                autoFocus
                style={{ width: "20%" }}
            />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "2rem" }}
                style={{ width: "20%" }}
            />
            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleSignup}>
                    Sign up
                </Button>
            </Box>

            <br></br>

            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleLogin}>
                    Already an user? Sign in here!
                </Button>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSignupSuccess ? (
                        <Button component={Link} to="/login">
                            Log in
                        </Button>
                    ) : (
                        <Button onClick={closeDialog}>Done</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SignupPage;
