import express from 'express';
import Quiz from '../Models/QuizModel.js'; // Trebuie să creezi acest model
const router = express.Router();

// Obține toate quiz-urile
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea quiz-urilor" });
    }
});

// Obține un quiz specific după ID
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (quiz) {
            res.json(quiz);
        } else {
            res.status(404).json({ message: "Quiz-ul nu a fost găsit" });
        }
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea quiz-ului" });
    }
});

export default router;
