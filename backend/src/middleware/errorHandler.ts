import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors
    });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists'
    });
  }

  res.status(error.status || 500).json({
    error: error.message || 'Internal server error'
  });
};
