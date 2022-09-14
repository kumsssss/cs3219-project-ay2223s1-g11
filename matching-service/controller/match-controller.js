import {
  ormCreatePendingMatch as _createPendingMatch,
  ormGetFirstMatch as _getFirstMatch,
  ormDeletePendingMatch as _deletePendingMatch,
} from "../model/pending-match-orm.js";

// Expressed in milliseconds
export const TIMEOUT_INTERVAL = 5000

/**
 * Handles the logic of matching users.
 */
export const matchController = (io, socket) => {
  console.log(`IO: Socket with id: ${socket.id} connected`);

  socket.on("findMatch", async ({username, difficultyLevel}) => {

    const {hasFoundMatch, partnerUsername, partnerSocketId} = await findMatch(difficultyLevel);

    if (hasFoundMatch) {
      await handleMatchSuccess(io, socket, username, partnerUsername, partnerSocketId);
      return;
    }
    await createPendingMatch(username, socket.id, difficultyLevel);
    handleMatchFail(io, socket, username);
  });

  socket.on("disconnect", () =>
    console.log(`IO: Socket with id: ${socket.id} disconnected`)
  );
};

const createPendingMatch = async (username, socketId, difficultyLevel) => {
  try {
    await _createPendingMatch(username, socketId, difficultyLevel);
  } catch (err) {
    console.log(err);
  }
};

const deletePendingMatch = async (username) => {
  try {
    await _deletePendingMatch(username);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Returns a match if exists else return null.
 */
const findMatch = async (difficultyLevel) => {
  try {
    const match = await _getFirstMatch(difficultyLevel);
    if (match === null) {
      return { hasFoundMatch: false };
    }
    console.log(match);
    return { hasFoundMatch: true, partnerUsername: match.dataValues.username, partnerSocketId: match.dataValues.socketId };
  } catch (err) {
    console.log(err);
  }
};

const createRoomId = (socketIdOne, socketIdTwo) => {
  return `${socketIdOne}:${socketIdTwo}`;
};

const handleMatchSuccess = async (io, socket, username, partnerUsername, partnerSocketId) => {
  // handleMatchSuccess is delt by the aspect of the second user who request a match
  await deletePendingMatch(partnerUsername);

  const roomId = createRoomId(socket.id, partnerSocketId);
  io.to(socket.id).emit("matchSuccess", {partnerUsername: partnerUsername, roomId});
  io.to(partnerSocketId).emit("matchSuccess", {partnerUsername: username, roomId});
}

const handleMatchFail = async (io, socket, username) => {
  setTimeout(async () => {
    await deletePendingMatch(username);
    io.to(socket.id).emit("matchFail", {error: "Timeout"});
  }, TIMEOUT_INTERVAL)
}