import redis from 'ioredis'
import 'dotenv/config'

const client = redis.createClient({
    host: `${process.env.CLOUD_REDIS_URL}`,
    port: `${process.env.CLOUD_REDIS_PORT}`,
    username: `${process.env.CLOUD_REDIS_USERNAME}`,
    password: `${process.env.CLOUD_REDIS_PASSWORD}`
})

console.log(client)

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

export let redisClient = client;