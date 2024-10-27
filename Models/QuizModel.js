import mongoose from 'mongoose';

const quizSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    timeLimit: { type: Number, required: false, default: 180 },

    
    // Referință la întrebările din QuestionModel
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,  // Fiecare întrebare va fi un ObjectId din QuestionModel
            ref: 'Question',  // Referință către colecția Question
            required: true
        }
    ]
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
