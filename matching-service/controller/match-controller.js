import {
    ormCreatePendingMatch as _createPendingMatch,
    ormDeletePendingMatch as _deletePendingMatch,
    ormDeleteIfPedningMatchExists as _deleteIfPendingMatchExists,
    ormGetMatchWithFilterKey as _getMatchWithFilterKey,
} from "../model/pending-match-orm.js";

import { ormCreateMatchInfo as _createMatchInfo } from "../model/match-info-orm.js";

// Expressed in milliseconds
export const TIMEOUT_INTERVAL = 5000;

/**
 * Handles the logic of matching users.
 */
export const matchController = (io, socket) => {
    console.log(`IO: Socket with id: ${socket.id} connected`);

    socket.on("findMatch", async ({ username, filterKey }) => {
        if (!username || !filterKey) {
            await handleInvalidMatchFail(
                io,
                socket,
                "Invalid matching request"
            );
            return;
        }

        const { hasFoundMatch, partnerUsername, partnerSocketId } =
            await findPendingMatch(username, filterKey);

        if (hasFoundMatch) {
            await handleMatchSuccess(
                io,
                socket,
                username,
                partnerUsername,
                partnerSocketId,
                filterKey
            );
        } else {
            const { isCreated, error } = await createPendingMatch(
                username,
                socket.id,
                filterKey
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

const createPendingMatch = async (username, socketId, filterKey) => {
    try {
        await _createPendingMatch(username, socketId, filterKey);
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
 * Returns a match with filterKey if exists else return null.
 */
const findPendingMatch = async (username, filterKey) => {
    try {
        const match = await _getMatchWithFilterKey(username, filterKey);
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

const createMatchInfo = async (firstUsername, secondUsername, filterKey) => {
    try {
        await _createMatchInfo(firstUsername, secondUsername, filterKey);
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
    filterKey
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

    createMatchInfo(username, partnerUsername, filterKey);
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
