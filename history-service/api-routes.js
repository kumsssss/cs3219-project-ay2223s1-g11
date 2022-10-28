import express from "express";
import { addQuestionToUserHistory, getUserQuestionHistory } from "./controller/history-controller.js";
let router = express.Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to history service API'
    });
});

// Questions routes
router.get('/history/:user', getUserQuestionHistory)
router.post('/history/:user', addQuestionToUserHistory)



// Export API routes
export let apiRoutes = router;