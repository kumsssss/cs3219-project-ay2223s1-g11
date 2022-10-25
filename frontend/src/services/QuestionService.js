import { QUESTION_SERVICE_ENDPOINT } from "../constants";

const axios = require("axios");

export async function getEasyQuestion(room_id) {
    const data = { room: room_id };
    const res = await axios.post(QUESTION_SERVICE_ENDPOINT + `/difficulty/easy`, data);
    console.log(res.data.question);
    return res.data.question;
}

export async function getMediumQuestion(room_id) {
    const data = { room: room_id };
    const res = await axios.post(QUESTION_SERVICE_ENDPOINT + `/difficulty/medium`, data);
    console.log(res.data.question);
    return res.data.question;
}

export async function getHardQuestion(room_id) {
    const data = { room: room_id };
    const res = await axios.post(QUESTION_SERVICE_ENDPOINT + `/difficulty/hard`, data);
    console.log(res.data.question);
    return res.data.question;
}

export async function getRandomQuestion(data) {
    // TODO: handle data
    const res = await axios.post(QUESTION_SERVICE_ENDPOINT + `/random`);
    console.log(res.data.question);
    return res.data.question;
}

export async function getAllTopics() {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/topics`);
    console.log(res.data.question);
    return res.data.question;
}

export async function getQuestionByTopic(topic) {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/topics/` + topic);
    console.log(res.data.question);
    return res.data.question;
}
