import { Avatar, AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
    useEffect(() => {
        if (!user) {
            setUser(JSON.parse(localStorage.getItem("user")));
        }
    }, []);

    const { user, setUser } = useContext(UserContext);

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

                    {user && (
                        <Button color="inherit" onClick={handleHome}>
                            Home
                        </Button>
                    )}

                    {user && (<Avatar src="/../../public/avatar-person.svg" />)}

                    {user && (
                        <Button color="inherit" onClick={handleProfile}>
                            {user.username}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
