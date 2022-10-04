import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";

// Editor imports
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

// Chat
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    Avatar,
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";

function CollaborationPage() {
    const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

    return (
        <Box padding="1%">
            <Grid container direction="row" justifyContent="center" alignItems="stretch">
                <Grid xs={4} padding="1%">
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
                <Grid xs={4} padding="1%">
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
                <Grid xs={3} padding="1%">
                    <Typography variant="h3">Chat</Typography>
                    <div style={{ position: "relative", height: "500px" }}>
                        <MainContainer>
                            <ChatContainer>
                                <MessageList>
                                    <Message
                                        model={{
                                            message: "Hello my friend",
                                            sentTime: "15 mins ago",
                                            sender: "Joe",
                                            direction: "incoming",
                                            position: "single",
                                        }}
                                    >
                                        <Avatar src={"./avatar-person.svg"} name={"Zoe"} />
                                    </Message>
                                </MessageList>
                                <MessageInput placeholder="Type message here" />
                            </ChatContainer>
                        </MainContainer>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CollaborationPage;
