import { getRandomQuestion, getQuestionByDifficulty, getQuestionByTopic, getTopics } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormGetRandomQuestion() {
    try {
        const question = await getRandomQuestion();
        return question;
    } catch (err) {
        console.log('ERROR: Could not query database to get question');
        return { err };
    }
}

export async function ormGetQuestionByDifficulty(difficultyLevel) {
    try {
        const question = await getQuestionByDifficulty(difficultyLevel);
        return question;
    } catch (err) {
        console.log('ERROR: Could not query database to get question');
        return { err };
    }
}

export async function ormGetQuestionByTopic(topic) {
    try {
        const question = await getQuestionByTopic(topic);
        return question;
    } catch (err) {
        console.log('ERROR: Could not query database to get question');
        return { err };
    }
}

export async function ormGetTopics() {
    try {
        const topics = await getTopics();
        return topics;
    } catch (err) {
        console.log('ERROR: Could not query database to get topics');
        return { err };
    }
}

