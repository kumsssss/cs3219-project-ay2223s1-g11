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
router.post('/questions/difficulty/:difficulty', viewQuestionByDifficulty)
router.post('/questions/random', viewRandomQuestion)
router.get('/questions/topics', viewTopics)
router.get('/questions/topics/:topic', viewQuestionByTopic)

// Export API routes
export let apiRoutes = router;