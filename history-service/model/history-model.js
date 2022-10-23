import mongoose from 'mongoose';
var Schema = mongoose.Schema

let QuestionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    }
});

let HistoryModelSchema = new Schema({
    userName: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    questions: {
        type: [QuestionSchema]
    }
});

export default mongoose.model('HistoryModel', HistoryModelSchema);