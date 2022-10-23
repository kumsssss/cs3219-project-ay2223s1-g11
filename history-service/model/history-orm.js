import { getQuestionHistory, addQuestionToHistory } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormGetUserQuestionHistory(userName) {
    try {
        const questions = await getQuestionHistory(userName);
        return questions;
    } catch (err) {
        console.log('ERROR: Could not query database to get question history');
        return { err };
    }
}

export async function ormAddQuestionToHistory(data) {
    try {
        const newQuestionToUserHistory = await addQuestionToHistory(data);
        newQuestionToUserHistory.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not add question to history in database');
        return { err };
    }
}
