import HistoryModel from './history-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.CLOUD_DB_URL : process.env.LOCAL_DB_URL;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


export async function getQuestionHistory(userName) {
    return HistoryModel.find({ userName: userName }).select('title topic difficulty -_id');
}

export async function addQuestionToHistory(data) {
    return HistoryModel.insertMany({ userName: data.userName, title: data.title, topic: data.topic, difficulty: data.difficulty});
}