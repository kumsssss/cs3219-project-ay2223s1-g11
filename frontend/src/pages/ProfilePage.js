import {
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { JwtContext } from "../contexts/JwtContext";
import UserService from "../services/UserService";
import { STATUS_CODE_SUCCESS } from "../constants";

function ProfilePage() {
    let navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const { jwt, setJwt } = useContext(JwtContext);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");

    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const closeDialog = () => setIsDialogOpen(false);
    const closePasswordDialog = () => setIsPasswordDialogOpen(false);

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

    const handleDelete = async () => {
        try {
            const res = await UserService.deleteUser({ username: user.username }, jwt);
            if (res && res.status === STATUS_CODE_SUCCESS) {
                setUser(null);
                setJwt(null);
                navigate("/login");
            }
        } catch (err) {
            setErrorDialog("Having issues deleting account, please try again.");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await UserService.logoutUser({ username: user.username }, jwt);
            if (res && res.status === STATUS_CODE_SUCCESS) {
                setUser(null);
                setJwt(null);
                navigate("/login");
            }
        } catch (err) {
            setErrorDialog("Having issues logging out, please try again.");
        }
    };

    const openPasswordDialog = () => {
        setIsPasswordDialogOpen(true);
    };

    const handlePassword = async () => {
        try {
            const res = await UserService.changePassword({ username: user.username, currentPassword: password, newPassword: newPassword });
            if (res && res.status === STATUS_CODE_SUCCESS) {
                setSuccessDialog("Successfully changed password!");
                setPassword('');
                setNewPassword('');
            }
        } catch (err) {
            setErrorDialog("Having issues logging out, please try again.");
        }
        closePasswordDialog();
    };

    return (
        <Stack padding="5%">
            <Typography variant="h2" color="inherit" component="div">
                Profile of {user.username}
            </Typography>
            <br></br>
            <br></br>
            <Button variant={"outlined"} style={{ color: "red" }} onClick={handleDelete}>
                Delete Account
            </Button>
            <br></br>
            <br></br>
            <Button variant={"outlined"} onClick={openPasswordDialog}>
                Change Password
            </Button>
            <br></br>
            <br></br>
            <Button variant={"outlined"} onClick={handleLogout}>
                Logout
            </Button>

            <Dialog open={isPasswordDialogOpen} onClose={closeDialog} fullWidth maxWidth="xs">
                <DialogTitle>Change Password</DialogTitle>
                <Stack padding="5%">
                    <TextField
                        label="Current password"
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ width: "80%", marginBottom: "1rem" }}
                        autoFocus
                        style={{}}
                    />
                    <TextField
                        label="New password"
                        variant="standard"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ width: "80%", marginBottom: "1rem" }}
                        style={{}}
                    />
                </Stack>
                <DialogActions>
                    <Button onClick={closePasswordDialog}>Cancel</Button>
                    <Button onClick={handlePassword}>Done</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Done</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default ProfilePage;
