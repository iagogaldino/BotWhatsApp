import { NextFunction } from "express";
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { setSessionUser } from "../session-user";
export const SECRETKEY = 'seuSegredo';

// Middleware para verificar o token JWT
export const verifyToken = (req: Request & {user?: any}, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, SECRETKEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Falha na autenticação do token' });
        }
        setSessionUser( decoded );
        next();
    });
};
