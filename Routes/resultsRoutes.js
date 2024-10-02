import express from 'express';
import Result from '../Models/ResultModel.js'; 
const router = express.Router();

// Salvează rezultatul unui utilizator pentru un quiz
router.post('/', async (req, res) => {
    try {
        const { quizId, score, timeTaken } = req.body;
        const userId = req.user._id; // Asumă că user-ul este autentificat

        const result = new Result({
            userId,
            quizId,
            score,
            timeTaken,
            date: Date.now()
        });

        const createdResult = await result.save();
        res.status(201).json({ message: "Result saved successfully", result: createdResult });
    } catch (error) {
        res.status(500).json({ message: "Eroare la salvarea rezultatului" });
    }
});

// Obține rezultatele unui utilizator
router.get('/:userId', async (req, res) => {
    try {
        const results = await Result.find({ userId: req.params.userId });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea rezultatelor" });
    }
});

export default router;
