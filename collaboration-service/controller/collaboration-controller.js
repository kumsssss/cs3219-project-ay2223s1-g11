import { VM } from "vm2";
import {
    assignRoom,
    createRoom,
    decrementUserCount,
    deleteRoomAssignment,
    incrementUserCount,
    isRoomCreated,
} from "../redis/datastore.js";
const vm = new VM();

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

    socket.on("runJavascript", async ({ roomId, data }) => {
        const output = await run(data);
        socket.to(roomId).emit("evaluatedOutput", output);
    });

    socket.on("disconnect", async () => {
        const roomId = await deleteRoomAssignment(socket.id);
        if (roomId !== null) {
            decrementUserCount(roomId);
        }
        console.log(`IO: Socket with id: ${socket.id} disconnected`);
    });
};

const run = async (data) => {
    try {
        const evaluated = await vm.run(data);
        return { data: String(evaluated), error: null };
    } catch (e) {
        return { data: null, error: e.message };
    }
};
