import express from 'express';
import Competition from '../Models/CompetitionModel.js'; // 
const router = express.Router();

// Obține toate competițiile
router.get('/', async (req, res) => {
    try {
        const competitions = await Competition.find({});
        res.json(competitions);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea competițiilor" });
    }
});

// Obține o competiție specifică după ID
router.get('/:id', async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (competition) {
            res.json(competition);
        } else {
            res.status(404).json({ message: "Competiția nu a fost găsită" });
        }
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea competiției" });
    }
});
// Creează o competiție nouă (acces doar pentru admin)
router.post('/', async (req, res) => {
    try {
        const { title, quizId, targetParticipants, endDate, prizeId } = req.body;

        // Creează competiția cu referință la produsul 'prizeId'
        const competition = new Competition({
            title,
            quizId,
            targetParticipants,
            endDate,
            prize: prizeId // prize este acum un ObjectId care face referință la Product
        });

        const createdCompetition = await competition.save();
        res.status(201).json(createdCompetition);
    } catch (error) {
        res.status(500).json({ message: "Eroare la crearea competiției" });
    }
});


export default router;
