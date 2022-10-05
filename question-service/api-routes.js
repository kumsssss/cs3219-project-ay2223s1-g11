import express from "express";
import { viewQuestionByDifficulty, viewRandomQuestion, viewQuestionByTopic, viewTopics} from "./controller/questions-controller.js";
let router = express.Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to question service API'
    });
});

// Questions routes
router.get('/questions/difficulty/:level', viewQuestionByDifficulty)
router.get('/questions/random', viewRandomQuestion)
router.get('/questions/topics', viewTopics)
router.get('/questions/topics/:topic', viewQuestionByTopic)

// Export API routes
export let apiRoutes = router;