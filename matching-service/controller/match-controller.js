import {
  ormCreatePendingMatch as _createPendingMatch,
  ormGetFirstMatch as _getFirstMatch,
  ormDeletePendingMatch as _deletePendingMatch,
} from "../model/pending-match-orm.js";

/**
 * Handles the logic of matching users.
 */
export const matchController = (io, socket) => {
  console.log(`IO: Socket with id: ${socket.id} connected`);

  socket.on("findMatch", async (difficultyLevel) => {
    console.log(`Level: ${difficultyLevel}`);

    const { hasFoundMatch, partnerSocketId } = await findMatch(difficultyLevel);
    if (hasFoundMatch) {
      await deletePendingMatch(socket.id);
      const roomId = createRoomId(socket.id, partnerSocketId);
      io.to(socket.id).emit("matchSuccess", roomId);
      io.to(partnerSocketId).emit("matchSuccess", roomId);
      return;
    }
    await createPendingMatch(socket.id, difficultyLevel);
  });

  socket.on("disconnect", () =>
    console.log(`IO: Socket with id: ${socket.id} disconnected`)
  );
};

const createPendingMatch = async (socketId, difficultyLevel) => {
  try {
    await _createPendingMatch(socketId, difficultyLevel);
  } catch (err) {
    console.log(err);
  }
};

const deletePendingMatch = async (socketId) => {
  try {
    await _deletePendingMatch(socketId);
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
      return { hasFoundMatch: false, partnerSocketId: null };
    }
    console.log(match);
    return { hasFoundMatch: true, partnerSocketId: match.dataValues.socketId };
  } catch (err) {
    console.log(err);
  }
};

const createRoomId = (socketIdOne, socketIdTwo) => {
  return `${socketIdOne}:${socketIdTwo}`;
};
