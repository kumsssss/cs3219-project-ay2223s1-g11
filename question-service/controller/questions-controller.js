// Import contact model
import {
    ormGetRandomQuestion as _getRandomQuestion,
    ormGetQuestionByDifficulty as _getQuestionByDifficulty,
    ormGetQuestionByTopic as _getQuestionByTopic,
    ormGetTopics as _getTopics,
} from "../model/questions-orm.js";
import {
    storeQuestion,
    getQuestion,
    redisClient as redis,
    expireQuestion,
} from "../redis/datastore.js";
import { lock } from "simple-redis-mutex";

export async function viewRandomQuestion(req, res) {
    try {
        let room = req.body.room;
        if (!room) {
            return res
                .status(404)
                .json({ message: "RoomId must be provided when requesting a question" });
        }
        let key = room + "key";
        const unlock = await lock(redis, key);
        const questionFromCache = await getQuestion(req.body.room);
        if (questionFromCache) {
            await expireQuestion(room);
            await unlock();
            return res.status(200).json({ question: JSON.parse(questionFromCache) });
        }
        const question = await _getRandomQuestion();
        await storeQuestion(room, JSON.stringify(question));
        await unlock();
        return res.status(200).json({ question: question });
    } catch (err) {
        return res.status(500).json({ message: "Database failure when getting random question" });
    }
}

export async function viewQuestionByDifficulty(req, res) {
    try {
        let room = req.body.room;
        if (!room) {
            return res
                .status(404)
                .json({ message: "RoomId must be provided when requesting a question" });
        }
        let difficultyLevel = req.params.difficulty;
        let level = difficultyLevel.toLowerCase();
        if (level !== "easy" && level !== "medium" && level !== "hard") {
            return res.status(400).json({ message: "invalid difficulty level" });
        }
        let key = room + "key";
        const unlock = await lock(redis, key);
        const questionFromCache = await getQuestion(req.body.room);
        if (questionFromCache) {
            await expireQuestion(room);
            await unlock();
            return res.status(200).json({ question: JSON.parse(questionFromCache) });
        }
        const question = await _getQuestionByDifficulty(level);
        await storeQuestion(room, JSON.stringify(question));
        await unlock();
        return res.status(200).json({ question: question });
    } catch (err) {
        return res
            .status(500)
            .json({ message: `Database failure when getting ${req.params.difficulty} question` });
    }
}

export async function viewQuestionByTopic(req, res) {
    try {
        let topic = req.params.topic;
        let room = req.body.room;
        if (!room) {
            return res
                .status(404)
                .json({ message: "RoomId must be provided when requesting a question" });
        }
        let key = room + "key";
        const unlock = await lock(redis, key);
        const questionFromCache = await getQuestion(req.body.room);
        if (questionFromCache) {
            await expireQuestion(room);
            await unlock();
            return res.status(200).json({ question: JSON.parse(questionFromCache) });
        }
        const question = await _getQuestionByTopic(topic);
        await storeQuestion(room, JSON.stringify(question));
        await unlock();
        return res.status(200).json({ question: question });
    } catch (err) {
        return res
            .status(500)
            .json({ message: `Database failure when getting ${req.params.topic} question` });
    }
}

export async function viewTopics(req, res) {
    try {
        const topics = await _getTopics();
        return res.status(200).json({ topics: topics });
    } catch (err) {
        return res.status(500).json({ message: "Database failure when getting question topics" });
    }
}
