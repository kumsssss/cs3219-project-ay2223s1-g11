import { USER_SERVICE_ENDPOINT } from "../constants";

const axios = require("axios");

export async function createUser(data) {
    const res = await axios.post(USER_SERVICE_ENDPOINT + `/`, data);
    console.log(res);
    return res;
}

export async function loginUser(data) {
    const res = await axios.post(USER_SERVICE_ENDPOINT + `/login`, data);
    console.log(res);
    return res;
}

export async function logoutUser(data, jwt) {
    const headers = {
        Authorization: jwt,
    };

    const res = await axios.post(USER_SERVICE_ENDPOINT + `/logout`, data, { headers: headers });
    console.log(res);
    return res;
}

export async function changePassword(data) {
    const res = await axios.post(USER_SERVICE_ENDPOINT + `/change`, data);
    console.log(res);
    return res;
}

export async function deleteUser(data, jwt) {
    const headers = {
        Authorization: jwt,
    };

    const res = await axios.post(USER_SERVICE_ENDPOINT + `/delete`, data, { headers: headers });
    console.log(res);
    return res;
}
