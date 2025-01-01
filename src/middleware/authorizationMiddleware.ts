import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import User from "../models/userModel";

interface DecodedToken{
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp:number;
}


export const authMiddleware = async(req:Request, res:Response, next:NextFunction): Promise<void> => {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(201).json({message:"Authorization token is missing or invalid"})
            return;
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET as string;

        const decoded = jwt.verify(token, secret) as DecodedToken;

        const userId = decoded.userId;
        const user = await User.findOne({_id:userId});
        if(!user){
            res.status(401).json({message:"Unauthorized: user not found for this token"})
            return;
        }

        req.user = {
            userId: decoded.userId,
            email:decoded.email,
            role:decoded.role,
        };

        next();
    } catch (error){
        res.status(401).json({message:"Unauthorized: Invalid or expired token"})
        return;
    }
};

