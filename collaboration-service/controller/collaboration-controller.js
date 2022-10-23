/**
 * Handles the logic of collaborating within a room.
 */
const currentRooms = new Map();

export const collaborationController = (io, socket) => {
    console.log(`IO: Socket with id: ${socket.id} connected`);

    socket.on("joinRoom", async ({ roomId }) => {
        socket.join(roomId);
        if (currentRooms.has(roomId)) {
            socket.emit("incommingChanges", { data: currentRooms.get(roomId) });
        } else {
            currentRooms.set(currentRooms.set(roomId, ""));
        }
    });

    socket.on("outgoingChanges", async ({ roomId, data }) => {
        currentRooms.set(roomId, data);
        socket.broadcast.emit("incommingChanges", { data });
    });

    socket.on("disconnect", () =>
        console.log(`IO: Socket with id: ${socket.id} disconnected`)
    );
};
