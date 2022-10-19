const axios = require("axios");
const baseUrl = "http://localhost:8000/api/user";

async function createUser(data) {
    const res = await axios.post(baseUrl + `/`, data);
    console.log(res);
    return res;
}

async function loginUser(data) {
    const res = await axios.post(baseUrl + `/login`, data);
    console.log(res);
    return res;
}

async function logoutUser(data, jwt) {
    const headers = {
        Authorization: jwt,
    };

    const res = await axios.post(baseUrl + `/logout`, data, { headers: headers });
    console.log(res);
    return res;
}

async function changePassword(data) {
    const res = await axios.post(baseUrl + `/change`, data);
    console.log(res);
    return res;
}

async function deleteUser(data, jwt) {
    const headers = {
        Authorization: jwt,
    };

    const res = await axios.post(baseUrl + `/delete`, data, { headers: headers });
    console.log(res);
    return res;
}

module.exports = { createUser, loginUser, logoutUser, changePassword, deleteUser };
