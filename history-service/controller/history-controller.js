import { ormGetUserQuestionHistory as _getUserQuestionHistory, ormAddQuestionToHistory as _addQuestionToHistory } from "../model/history-orm.js";

export async function getUserQuestionHistory(req, res) {
    try {
        let userName = req.params.user;
        if (!userName) {
            return res.status(404).json({ message: "userName must be provided when requesting question history" });
        }
        const questions = await _getUserQuestionHistory(userName);
        res.status(200).json({ questionHistory: questions });
    } catch (err) {
        res.status(500).json({message: "Database failure when trying to get questions"});
    }
}

export async function addQuestionToUserHistory(req, res) {
    try {
        let questionInfo = req.body.question;
        let userName = req.params.user;
        if (!userName) {
            return res.status(404).json({ message: "userName must be provided when adding to question history" });
        }
        if (!questionInfo || !questionInfo.title || !questionInfo.topic || !questionInfo.difficulty) {
            return res.status(404).json({ message: "All question details must be provided when adding to question history" });
        }
        const response = await _addQuestionToHistory({ userName: userName, title: questionInfo.title, difficulty: questionInfo.difficulty, topic: questionInfo.topic });
        if (response.err) {
            return res.status(500).json({ message: "Unable to add question to user's question history" });
        }
        return res.status(201).json({ message: "Question added to user's history successfully!" });
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when adding question to user history!' })
    }
}