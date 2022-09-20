import redis from 'redis'
import 'dotenv/config'

const client = redis.createClient({
    host:`${process.env.REDIS_URI}`,
    port:6379
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