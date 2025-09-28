import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.cookies['auth-token'];
    if (!token) {
        return res.status(401).json({ error: 'Missing auth-token cookie' });
    }
    try {
        const secret = process.env.JWT_SECRET!;
        const payload = jwt.verify(token, secret) as { userId: string };
        req.user = { userId: payload.userId };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
