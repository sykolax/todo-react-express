import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from '@routes/routes';

dotenv.config();
const app = express();
app.use(express.json()); //built-in body parser
app.use('/api', router);

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
    response.status(200).send("Hello World!");
});

app.listen(PORT, () => {     
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});