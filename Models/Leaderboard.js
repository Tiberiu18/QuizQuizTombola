import mongoose from 'mongoose';

const leaderboardSchema = mongoose.Schema({
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    leaderboard: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true },
        timeTaken: { type: Number, required: true }
    }]
}, {
    timestamps: true
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;
