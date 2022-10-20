import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import Chat from "../components/Chat";
import { useChatService } from "../hooks/useChatService";
import { getEasyQuestion, getMediumQuestion, getHardQuestion } from "../services/QuestionService";

// Editor imports
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

function CollaborationPage() {
    const { user, setUser } = useContext(UserContext);
    const [question, setQuestion] = useState({});
    const [code, setCode] = useState(`Write your code here`);

    async function fetchQuestion() {
        if (user.difficultyLevel === "easy") {
            await getEasyQuestion(user.room).then((qn) => setQuestion(qn));
        } else if (user.difficultyLevel === "medium") {
            await getMediumQuestion(user.room).then((qn) => setQuestion(qn));
        } else if (user.difficultyLevel === "hard") {
            await getHardQuestion(user.room).then((qn) => setQuestion(qn));
        }
    }

    // get question from QuestionService
    useEffect(() => {
        fetchQuestion();
        console.log("question in collab:", question)
    }, []);

    const { exitChat } = useChatService();

    let navigate = useNavigate();
    const handleLeave = () => {
        // TODO: Disconnect chat and editor sockets

        exitChat();

        setUser((prevState) => {
            return {
                ...prevState,
                room: null,
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
                    <h2>{question.title}</h2>
                    <h2>Difficulty: {question.difficulty}</h2>
                    <h3>
                        {question.question}
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
