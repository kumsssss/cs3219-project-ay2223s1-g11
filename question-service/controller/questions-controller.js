// Import contact model
import { ormGetRandomQuestion as _getRandomQuestion, ormGetQuestionByDifficulty as _getQuestionByDifficulty, ormGetQuestionByTopic as _getQuestionByTopic } from '../model/questions-orm.js';


export async function viewRandomQuestion(req, res) {
    try {
        const question = await _getRandomQuestion();
        return res.status(200).json({ question: question });
    } catch (err) {
        res.status(500).json({ message: 'Database failure when getting random question'});
    }
};

export async function viewQuestionByDifficulty(req, res) {
    try {
        let difficultyLevel = req.params.level;
        let level = difficultyLevel.toLowerCase();
        if (level == "easy" || level == "medium" || level == "hard") {
            const question = await _getQuestionByDifficulty(level);
            return res.status(200).json({ question: question });
        } else  {
            res.status(400).json({ message: "invalid difficulty level"});
        }
    } catch (err) {
        res.status(500).json({ message: `Database failure when getting ${req.params.level} question` });
    }
};

export async function viewQuestionByTopic(req, res) {
    try {
        let topic = (req.params.topic).toLowerCase();
        const question = await _getQuestionByDifficulty(topic);
        return res.status(200).json({ question: question });
    } catch (err) {
        res.status(500).json({ message: `Database failure when getting ${req.params.level} question` });
    }
};