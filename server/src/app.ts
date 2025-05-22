import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from '@routes/routes';
import cors from 'cors';
import errorHandler from './middleware/errors';

dotenv.config();
const app = express();
app.use(express.json()); //built-in body parser
app.use(cors());
app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {     
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});