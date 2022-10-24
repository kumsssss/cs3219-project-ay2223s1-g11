import { VM } from "vm2";
const vm = new VM();
const currentRooms = new Map();

/**
 * Handles the logic of collaborating within a room.
 */
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

    socket.on("runJavascript", async ({ data }) => {
        const output = await run(data);
        socket.emit("evaluatedOutput", output);
    });

    socket.on("disconnect", () =>
        console.log(`IO: Socket with id: ${socket.id} disconnected`)
    );
};

const run = async (data) => {
    try {
        const evaluated = await vm.run(data);
        return { data: String(evaluated), error: null };
    } catch (e) {
        return { data: null, error: e.message };
    }
};
