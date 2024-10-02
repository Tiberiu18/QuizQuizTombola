import express from 'express';
import Result from '../Models/ResultModel.js'; 
const router = express.Router();

// Obține leaderboard-ul pentru o competiție
router.get('/:competitionId', async (req, res) => {
    try {
        const results = await Result.find({ competitionId: req.params.competitionId })
            .sort({ score: -1, timeTaken: 1 }) // Ordonare: scor descrescător, timp crescut
            .limit(10); // Limităm la primii 10 utilizatori

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea leaderboard-ului" });
    }
});

export default router;
