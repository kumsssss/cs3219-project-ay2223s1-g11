import {
    ormCreatePendingMatch as _createPendingMatch,
    ormDeletePendingMatch as _deletePendingMatch,
    ormDeleteIfPedningMatchExists as _deleteIfPendingMatchExists,
    ormGetMatchWithDifficulty as _getMatchWithDifficulty,
    ormGetMatchWithTopic as _getMatchWithTopic,
} from "../model/pending-match-orm.js";

import { ormCreateMatchInfo as _createMatchInfo } from "../model/match-info-orm.js";

// Expressed in milliseconds
export const TIMEOUT_INTERVAL = 5000;

/**
 * Handles the logic of matching users.
 */
export const matchController = (io, socket) => {
    console.log(`IO: Socket with id: ${socket.id} connected`);

    socket.on("findMatch", async ({ username, difficultyLevel, topic }) => {
        if (topic === undefined) {
            topic = null;
        }

        if (difficultyLevel === undefined) {
            difficultyLevel = null;
        }

        if (topic == null && difficultyLevel == null) {
            await handleInvalidMatchFail(
                io,
                socket,
                "At least difficulty Level of topic level must exist"
            );
            return;
        }

        const { hasFoundMatch, partnerUsername, partnerSocketId } =
            await findPendingMatch(username, difficultyLevel, topic);

        if (hasFoundMatch) {
            await handleMatchSuccess(
                io,
                socket,
                username,
                partnerUsername,
                partnerSocketId,
                difficultyLevel,
                topic
            );
        } else {
            const { isCreated, error } = await createPendingMatch(
                username,
                socket.id,
                difficultyLevel,
                topic
            );
            if (isCreated) {
                handleTimeoutMatchFail(io, socket, username);
            } else {
                handleErrorMatchFail(io, socket, error);
            }
        }
    });

    socket.on("disconnect", async () => {
        // Delete the pending match immediately
        await deletePendingMatch(socket.id);
        console.log(`IO: Socket with id: ${socket.id} disconnected`);
    });
};

const createPendingMatch = async (
    username,
    socketId,
    difficultyLevel,
    topic
) => {
    try {
        await _createPendingMatch(username, socketId, difficultyLevel, topic);
        return { isCreated: true, error: null };
    } catch (err) {
        console.log(err);
        return { isCreated: false, error: err };
    }
};

const deletePendingMatch = async (socketId) => {
    try {
        await _deletePendingMatch(socketId);
    } catch (err) {
        console.log(err);
        return false;
    }
};

/**
 * Returns a match with topic if exists else return null.
 */
const findPendingMatch = async (username, difficultyLevel, topic) => {
    try {
        let match = null;
        if (difficultyLevel == null) {
            match = await _getMatchWithTopic(username, topic);
        }

        if (topic == null) {
            match = await _getMatchWithDifficulty(username, difficultyLevel);
        }

        if (match === null) {
            return { hasFoundMatch: false };
        }

        return {
            hasFoundMatch: true,
            partnerUsername: match.dataValues.username,
            partnerSocketId: match.dataValues.socketId,
        };
    } catch (err) {
        console.log(err);
        return {
            hasFoundMatch: false,
            partnerUsername: null,
            partnerSocketId: null,
        };
    }
};

const createMatchInfo = async (
    firstUsername,
    secondUsername,
    difficultyLevel,
    topic
) => {
    try {
        await _createMatchInfo(
            firstUsername,
            secondUsername,
            difficultyLevel,
            topic
        );
        return { isCreated: true, error: null };
    } catch (err) {
        console.log(err);
        return { isCreated: false, error: err };
    }
};

// Since usernames are guaranteed to be unique it can be used
// to create the roomId such that usernames a < username b
// then ab is the roomID
const createRoomId = (usernameOne, usernameTwo) => {
    if (usernameOne.localeCompare(usernameTwo) < 0) {
        return usernameOne + usernameTwo;
    }
    return usernameTwo + usernameOne;
};

// handleMatchSuccess is triggered and handled by invocation from
// the second user who wishes to be matched
const handleMatchSuccess = async (
    io,
    socket,
    username,
    partnerUsername,
    partnerSocketId,
    difficultyLevel,
    topic
) => {
    const roomId = createRoomId(username, partnerUsername);

    io.to(socket.id).emit("matchSuccess", {
        partnerUsername: partnerUsername,
        roomId,
    });
    io.to(partnerSocketId).emit("matchSuccess", {
        partnerUsername: username,
        roomId,
    });

    createMatchInfo(username, partnerUsername, difficultyLevel, topic);
};

const handleErrorMatchFail = async (io, socket, error) => {
    let message = error;
    if (error.name === "ValidationError") {
        message = Object.values(err.errors).map((val) => val.message);
    }
    io.to(socket.id).emit("matchFail", { error: message });
};

const handleInvalidMatchFail = async (io, socket, error_msg) => {
    io.to(socket.id).emit("matchFail", { error: error_msg });
};

const handleTimeoutMatchFail = async (io, socket) => {
    setTimeout(async () => {
        if (_deleteIfPendingMatchExists(socket.id)) {
            io.to(socket.id).emit("matchFail", { error: "Timeout" });
        }
    }, TIMEOUT_INTERVAL);
};
