import redis from "redis";
import "dotenv/config";

const ROOM_PREFIX = "room:";
const SOCKET_PREFIX = "socket:";

const client = redis.createClient({
    host: `${process.env.REDIS_URI}`,
    port: 6379,
});

await client.connect();

client.on("error", (err) => {
    console.log("DB Error: " + err);
});

/**
 * Returns true if the room is already created.
 */
export async function isRoomCreated(roomId) {
    try {
        const value = await client.get(ROOM_PREFIX + roomId);
        if (value) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("DB Error: Unable to check if room is created");
    }
}

/**
 * Creates a room with the given Room ID
 */
export async function createRoom(roomId) {
    try {
        await client.set(ROOM_PREFIX + roomId, "1");
    } catch (err) {
        console.log("DB Error: Unable to create room");
    }
}

/**
 * Deletes room from database.
 */
export async function incrementUserCount(roomId) {
    try {
        const value = await client.get(ROOM_PREFIX + roomId);
        if (value) {
            await client.set(roomId, String(parseInt(value) + 1));
        } else {
            await client.set(roomId, "1");
        }
    } catch (err) {
        console.log("DB Error: Unable to increment user count");
    }
}

/**
 * Deletes room from database.
 */
export async function decrementUserCount(roomId) {
    try {
        const value = await client.get(ROOM_PREFIX + roomId);
        if (value) {
            if (parseInt(value) <= 1) {
                await client.del(roomId);
            } else {
                await client.set(roomId, String(parseInt(value) - 1));
            }
        }
    } catch (err) {
        console.log("DB Error: Unable to decrement user count");
    }
}

/**
 * Deletes room from database.
 */
export async function deleteRoom(roomId) {
    try {
        await client.del(ROOM_PREFIX + roomId);
    } catch (err) {
        console.log("DB Error: Unable to delete room");
    }
}

/**
 * Assigns socket ID to room ID.
 */
export async function assignRoom(socketId, roomId) {
    try {
        await client.set(SOCKET_PREFIX + socketId, roomId);
    } catch (err) {
        console.log("DB Error: Unable to assign room to socket");
    }
}

/**
 * Delete room ID assigned to socket ID and returns the previously assigned room ID.
 */
export async function deleteRoomAssignment(socketId) {
    try {
        const roomId = client.get(SOCKET_PREFIX);
        await client.del(SOCKET_PREFIX + socketId);
        return roomId;
    } catch (err) {
        console.log("DB Error: Unable to delete assigned room to socket");
        return null;
    }
}
