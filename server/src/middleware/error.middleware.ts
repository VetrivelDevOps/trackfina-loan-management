import { Request, Response, NextFunction } from 'express';

// Rename the interface to avoid naming conflict
export interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: ErrorWithStatus, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[ERROR] ${statusCode} - ${message}`);
  console.error(err.stack);
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};

export class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}