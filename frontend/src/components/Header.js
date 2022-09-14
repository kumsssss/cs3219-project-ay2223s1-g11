import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
    let navigate = useNavigate();

    const handleProfile = () => {
        navigate("/profile");
    };

    const handleHome = () => {
        navigate("/home");
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        PeerPrep
                    </Typography>

                    <Button color="inherit" onClick={handleHome}>
                        Home
                    </Button>
                    <Button color="inherit" onClick={handleProfile}>
                        Username
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
