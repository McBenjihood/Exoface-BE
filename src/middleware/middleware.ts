import type { Request, Response, NextFunction } from 'express';

export const RequestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now());
    next();
};