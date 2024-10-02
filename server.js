import express from "express";
import productRoute from "./Routes/ProductRoutes.js";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import quizRouter from './Routes/quizRoutes.js';
import competitionRouter from './Routes/competitionRoutes.js';
import resultsRouter from './Routes/resultsRoutes.js';
import leaderboardRouter from './Routes/leaderboardRoutes.js';

dotenv.config();
connectDatabase();
const app = express();
app.use(express.json());



// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
// API pentru quiz-uri
app.use("/api/quizzes", quizRouter);

// API pentru competiții
app.use("/api/competitions", competitionRouter);

// API pentru rezultate
app.use("/api/results", resultsRouter);

// API pentru leaderboard
app.use("/api/leaderboard", leaderboardRouter);


// err handler
app.use(notFound);
app.use(errorHandler);




app.get("/",(req,res)=>{
    res.send("API is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running port ${PORT}...`));
