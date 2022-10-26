import mongoose from 'mongoose';
var Schema = mongoose.Schema

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
    lastAttempt: {
        type: Date,
        required: true
    },
    question: {
        type: String,
        required: true
    }
});

export default mongoose.model('HistoryModel', HistoryModelSchema);