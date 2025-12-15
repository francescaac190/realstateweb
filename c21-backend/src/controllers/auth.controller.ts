import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function registerUser(req: Request, res: Response) {
    try{
        const { name, email, password } = req.body;
        const result = await authService.register( name, email, password);

        res.status(201).json(result);
    } catch(err: any) {
        res.status(400).json({ error: err.message});
    }
}

export async function loginUser(req: Request, res: Response) {
    try { 
        const { email, password } = req.body;
        const result = await authService.login( email, password);

        res.status(201).json(result);
    } catch(err: any) {
        res.status(401).json({ error: err.message });
    }
}