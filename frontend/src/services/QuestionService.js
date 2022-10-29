import { QUESTION_SERVICE_ENDPOINT } from "../constants";

const axios = require("axios");

export async function getQuestion(room_id, difficulty) {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/difficulty/${difficulty}`, { params: { room: room_id } });
    console.log(res.data.question);
    return res.data.question;
}

export async function getAllTopics() {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/topics`);
    console.log(res.data);
    return res.data.topics;
}

export async function getQuestionByTopic(room_id, topic) {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/topics/${topic}`, { params: { room: room_id } });
    console.log(res.data.question);
    return res.data.question;
}
