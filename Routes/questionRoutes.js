import express from 'express';
import Question from '../Models/QuestionModel.js';  // Importă modelul întrebărilor
const router = express.Router();

// Adaugă o nouă întrebare (POST /api/questions)
router.post('/', async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;

        const newQuestion = new Question({
            question,
            options,
            correctAnswer
        });

        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);  // Cod 201 pentru resursa creată
    } catch (error) {
        res.status(500).json({ message: "Eroare la adăugarea întrebării" });
    }
});

// Obține toate întrebările (GET /api/questions)
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find({});
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea întrebărilor" });
    }
});

// Obține o întrebare specifică după ID (GET /api/questions/:id)
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: "Întrebarea nu a fost găsită" });
        }
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea întrebării" });
    }
});

// Modifică o întrebare existentă (PUT /api/questions/:id)
router.put('/:id', async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { question, options, correctAnswer },
            { new: true }  // Returnează întrebarea actualizată
        );

        if (updatedQuestion) {
            res.json(updatedQuestion);
        } else {
            res.status(404).json({ message: "Întrebarea nu a fost găsită pentru a fi actualizată" });
        }
    } catch (error) {
        res.status(500).json({ message: "Eroare la actualizarea întrebării" });
    }
});

// Șterge o întrebare (DELETE /api/questions/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (deletedQuestion) {
            res.json({ message: "Întrebarea a fost ștearsă cu succes" });
        } else {
            res.status(404).json({ message: "Întrebarea nu a fost găsită" });
        }
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergerea întrebării" });
    }
});

export default router;
