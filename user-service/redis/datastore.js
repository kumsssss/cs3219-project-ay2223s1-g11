import redis from 'redis'
import 'dotenv/config'

// const url = `redis://${secrets.USER_SERVICE_REDIS_USERNAME}:${secrets.USER_SERVICE_REDIS_PASSWORD}@${secrets.USER_SERVICE_REDIS_URL}:${secrets.USER_SERVICE_REDIS_PORT}`;
const url = `redis://${process.env.CLOUD_REDIS_USERNAME}:${process.env.CLOUD_REDIS_PASSWORD}@${process.env.CLOUD_REDIS_URL}:${process.env.CLOUD_REDIS_PORT}`;
const client = redis.createClient({
    url
})

await client.connect()

client.on('error', err => {
    console.log('Error ' + err);
});

export async function setToken(token) {
    try {
        const isPresent = await getToken(token)
        if (!isPresent) {
            await client.set(token, 0)
            await client.expire(token, 60 * 60 * 2)
        }
    }
    catch (err) {
        console.log("Unable to set token")
    }
}

export async function getToken(token) {
    try {
        const value = await client.get(token)
        if (value) {
            return true
        }
        else {
            return false
        }
    } 
    catch(err) {
        console.log(err)
        return true
    }
}

export async function expireToken(token) {
    try {
        await client.del(token)
    }
    catch (err) {
        console.log("Unable to expire token")
    }
}