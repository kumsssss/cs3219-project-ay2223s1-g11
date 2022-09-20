import { Button, Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    let navigate = useNavigate();

    const handleDelete = () => {
        console.log("Delete account from backend");
    };

    const handleLogout = () => {
        console.log("Logging out...");
    };

    return (
        <Stack padding="5%">
            <Typography variant="h2" color="inherit" component="div">Profile</Typography>
            <Button variant={"outlined"} style={{color: "red"}} onClick={handleDelete}>
                Delete Account
            </Button>
            <br></br>
            <br></br>
            <Button variant={"outlined"} onClick={handleLogout}>
                Logout
            </Button>
        </Stack>
    );
}

export default ProfilePage;
