import mongoose from 'mongoose';

const resultSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true }, // în secunde
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
