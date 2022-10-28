import {
    assignRoom,
    createRoom,
    decrementUserCount,
    deleteRoomAssignment,
    incrementUserCount,
    isRoomCreated,
} from "../redis/datastore.js";

/**
 * Handles the logic of collaborating within a room.
 */
export const collaborationController = (io, socket) => {
    console.log(`IO: Socket with id: ${socket.id} connected`);

    socket.on("joinRoom", async ({ roomId }) => {
        socket.join(roomId);
        if (isRoomCreated(roomId)) {
            incrementUserCount(roomId);
            socket.to(roomId).emit("pullData");
        } else {
            createRoom(roomId);
            assignRoom(socket.id, roomId);
        }
    });

    socket.on("outgoingChanges", async ({ roomId, data }) => {
        socket.to(roomId).emit("incommingChanges", { data });
    });

    socket.on("pushEditorMode", async ({ roomId, data }) => {
        socket.to(roomId).emit("incommingEditorMode", { data });
    });

    socket.on("disconnect", async () => {
        const roomId = await deleteRoomAssignment(socket.id);
        if (roomId !== null) {
            decrementUserCount(roomId);
        }
        console.log(`IO: Socket with id: ${socket.id} disconnected`);
    });
};
