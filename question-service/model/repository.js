import QuestionModel from './question-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.CLOUD_DB_URL : process.env.LOCAL_DB_URL;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


export async function getQuestionByDifficulty(difficultyLevel) {
    let count = await QuestionModel.countDocuments({ difficulty: difficultyLevel});
    let random = Math.floor(Math.random() * count);
    return QuestionModel.findOne({ difficulty: difficultyLevel }).skip(random);
}

export async function getRandomQuestion() {
    const count = await QuestionModel.estimatedDocumentCount();
    let random = Math.floor(Math.random() * count);
    return QuestionModel.findOne({}).skip(random);
}

export async function getQuestionByTopic(topic) {
    let count = await QuestionModel.countDocuments({ topic: topic });
    let random = Math.floor(Math.random() * count);
    return QuestionModel.findOne({ topic: topic }).skip(random);
}
