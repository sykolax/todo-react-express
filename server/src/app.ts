import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from '@routes/routes';
import cors from 'cors';
import errorHandler from './middleware/errors';
import cookieParser from 'cookie-parser'; 

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

dotenv.config();
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json()); //built-in body parser


app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {     
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});