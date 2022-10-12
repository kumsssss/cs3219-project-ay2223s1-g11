import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import Chat from "../components/Chat";
import { useChatService } from "../hooks/useChatService";

// Editor imports
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

function CollaborationPage() {
    const { user, setUser } = useContext(UserContext);
    const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

    const {exitChat} = useChatService();

    let navigate = useNavigate();
    const handleLeave = () => {
        // TODO: Disconnect chat and editor sockets

        exitChat();

        setUser((prevState) => {
            return {
                ...prevState,
                room: null
            };
        });
        navigate("/home");
    };

    return (
        <Box padding="1%">
            <Grid container justifyContent="flex-end">
                <Button variant="outlined" color="error" onClick={handleLeave}>
                    Leave
                </Button>
            </Grid>
            <Grid container direction="row" justifyContent="center" alignItems="stretch">
                <Grid item={true} xs={4} padding="1%">
                    <Typography variant="h3">Question</Typography>
                    <h2>Minimum Time to Make Rope Colorful</h2>
                    <h2>Difficulty: Medium</h2>
                    <h3>
                        Alice has n balloons arranged on a rope. You are given a 0-indexed string
                        colors where colors[i] is the color of the ith balloon. Alice wants the rope
                        to be colorful. She does not want two consecutive balloons to be of the same
                        color, so she asks Bob for help. Bob can remove some balloons from the rope
                        to make it colorful. You are given a 0-indexed integer array neededTime
                        where neededTime[i] is the time (in seconds) that Bob needs to remove the
                        ith balloon from the rope. Return the minimum time Bob needs to make the
                        rope colorful.
                    </h3>
                </Grid>
                <Grid item={true} xs={4} padding="1%">
                    <Typography variant="h3">Live code area</Typography>
                    <Editor
                        value={code}
                        onValueChange={(code) => setCode(code)}
                        highlight={(code) => highlight(code, languages.js)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                        }}
                    />
                </Grid>

                <Grid item={true} xs={3} padding="1%">
                    <Typography variant="h3">Chat</Typography>
                    <div style={{ position: "relative", height: "500px" }}>
                        <Chat></Chat>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CollaborationPage;
