import mongoose from 'mongoose';

const competitionSchema = mongoose.Schema({
    title: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    targetParticipants: { type: Number, required: true },
    currentParticipants: { type: Number, default: 0 },
    endDate: { type: Date, required: true },
    prize: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referință către modelul Product
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  }, {
    timestamps: true
  });
  
  const Competition = mongoose.model('Competition', competitionSchema);

  export default Competition;