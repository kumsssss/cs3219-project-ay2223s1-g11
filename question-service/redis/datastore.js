import redis from 'ioredis'
import 'dotenv/config'

const client = redis.createClient({
    host: `${process.env.REDIS_URI}`,
    port: 6379
})
// await client.connect()

client.on('error', err => {
    console.log('Error ' + err);
});

export async function storeQuestion(room, question) {
    try {
        const isPresent = await getQuestion(room)
        if (!isPresent) {
            await client.set(room, question)
        }
    }
    catch (err) {
        console.log("Unable to store question into redis")
    }
}

export async function getQuestion(room) {
    try {
        const value = await client.get(room)
        if (value) {
            return value
        }
        return false;
    }
    catch (err) {
        console.log(err)
        return true
    }
}

export async function expireQuestion(room) {
    try {
        await client.del(room)
    }
    catch (err) {
        console.log("Unable to expire question")
    }
}

export function acquireLock(key, value) {
    result = execute(SETNX, key, value)
    if (result == "OK") {
        log("acquired lock by client %s for key %s", value, key)
        return true
    } else {
        log("couldn't acquire, retry after some time")
        return false;
    }
}

export function releaseLock(key, client) {
    value = execute(GET, key);
    if (client == value && value != null) {
        execute(DEL, key);
    } else {
        log("error while releasing lock for key %s", key);
    }
}

export let redisClient = client;