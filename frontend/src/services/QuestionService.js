import { QUESTION_SERVICE_ENDPOINT } from "../constants";

const axios = require("axios");

export async function getEasyQuestion(room_id) {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/difficulty/easy`, { params: { room: room_id } });
    console.log(res.data.question);
    return res.data.question;
}

export async function getMediumQuestion(room_id) {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/difficulty/medium`, { params: { room: room_id } });
    console.log(res.data.question);
    return res.data.question;
}

export async function getHardQuestion(room_id) {
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/difficulty/hard`, { params: { room: room_id } });
    console.log(res.data.question);
    return res.data.question;
}

export async function getRandomQuestion(room_id) {
    // TODO: handle data
    const res = await axios.get(QUESTION_SERVICE_ENDPOINT + `/random`, { params: { room: room_id } });
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
