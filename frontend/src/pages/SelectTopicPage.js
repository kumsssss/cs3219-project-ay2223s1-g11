import { Button, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { getAllTopics } from "../services/QuestionService";

const SelectTopicPage = () => {
    const { user, setUser } = useContext(UserContext);
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    const clickTopic = (e) => {
        console.log(e.currentTarget.textContent);
        setUser((prevState) => {
            return {
                ...prevState,
                topic: e.currentTarget.textContent
            };
        });
        navigate("/matching");
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        fetchTopics();
        console.log("fetching topics...");
    }, []);

    async function fetchTopics() {
        await getAllTopics().then((topics) => setTopics(topics));
    }

    return (
        <Stack padding="5%">
            <Typography variant="h2">Select Topic</Typography>
            {topics.map((topic, i) => (
                <div key={i}>
                    <br></br>
                    <Button variant={"outlined"} onClick={clickTopic}>{topic}</Button>
                </div>
            ))}
        </Stack>
    );
};

export default SelectTopicPage;
