import mongoose from 'mongoose';
var Schema = mongoose.Schema
const testCasesSchema = new Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    }
});

let QuestionModelSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true,
        index: true
    },
    question: {
        type: String,
        required: true,
        unique: true
    },
    difficulty: {
        type: String,
        required: true,
        index: true
    },
    testCases: {
        type: [testCasesSchema]
    }
});

export default mongoose.model('QuestionModel', QuestionModelSchema);