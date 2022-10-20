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
import { useState, useContext, useEffect } from "react";
import { loginUser } from "../services/UserService";
import { UserContext } from "../contexts/UserContext";
import { JwtContext } from "../contexts/JwtContext";
import { STATUS_CODE_SUCCESS } from "../constants";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const { user, setUser } = useContext(UserContext);
    const { jwt, setJwt } = useContext(JwtContext);

    const handleLogin = async () => {
        try {
            const res = await loginUser({ username: username, password: password });
            if (res && res.status === STATUS_CODE_SUCCESS) {
                setJwt(res.data.token);
                setSuccessDialog("Account login successful");
                setUser({ username: username, hasSelectedDifficulty: false, difficultyLevel: null, room: null });
                navigate("/home");
            }
        } catch (err) {
            setErrorDialog("Wrong username/password, please try again.");
        }
    };

    const handleSignup = () => {
        navigate("/signup");
    };

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
            <Typography variant={"h3"} marginBottom={"2rem"}>
                Login
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
                <Button variant={"outlined"} onClick={handleLogin}>
                    Login
                </Button>
            </Box>

            <br></br>

            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleSignup}>
                    Not a user? Sign up here!
                </Button>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Done</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default LoginPage;
