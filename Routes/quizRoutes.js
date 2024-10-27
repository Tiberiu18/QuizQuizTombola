import express from 'express';
import Quiz from '../Models/QuizModel.js'; // Modelul pentru quiz-uri
import Question from '../Models/QuestionModel.js'; // Modelul pentru întrebări
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Crearea unui quiz nou cu 3 întrebări random

router.post('/generateQuizzes', asyncHandler(async (req, res) => {
    // Obține toate întrebările
    const questions = await Question.find();
    
    if (questions.length < 3) {
      return res.status(400).json({ message: 'Not enough questions to generate quizzes' });
    }
  
    // Creează toate combinațiile posibile de câte 3 întrebări
    const quizCombinations = getCombinations(questions, 3);
  
    // Creează quiz-urile pe baza acestor combinații
    const quizzes = quizCombinations.map(combination => ({
      title: `Quiz: ${combination.map(q => q.question).join(' - ')}`,
      description: 'Auto-generated quiz',
      questions: combination.map(q => q._id)
    }));
  
    // Inserează quiz-urile în baza de date
    const createdQuizzes = await Quiz.insertMany(quizzes);
  
    res.status(201).json({ message: `${createdQuizzes.length} quizzes generated`, quizzes: createdQuizzes });
  }));
  
  // Funcție pentru a genera toate combinațiile posibile de câte 3 întrebări
  function getCombinations(arr, size) {
    const result = [];
    const combination = (prefix, arr) => {
      if (prefix.length === size) {
        result.push(prefix);
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        combination([...prefix, arr[i]], arr.slice(i + 1));
      }
    };
    combination([], arr);
    return result;
  }

  router.delete('/:id', asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted' });
  }));

  
  router.put('/:id', asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  }));

  
  router.post('/', asyncHandler(async (req, res) => {
    const questions = await Question.find({ _id: { $in: req.body.questionIds } });
    if (questions.length !== req.body.questionIds.length) {
      return res.status(400).json({ message: 'Invalid question IDs' });
    }
    const quiz = new Quiz({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questionIds
    });
    await quiz.save();
    res.status(201).json(quiz);
  }));

  
  router.get('/', asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  }));

  
  router.get('/:id', asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  }));
  

export default router;
