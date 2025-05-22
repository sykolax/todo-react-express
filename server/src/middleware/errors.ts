import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Optional: log to console

    res.status(500).json({
      error: true,
      message: err.message || 'Something went wrong',
    });
}

export default errorHandler;