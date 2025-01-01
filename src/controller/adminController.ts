import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from 'bcryptjs';

export const adminSignup = async(req:Request, res:Response):Promise<void> => {
    try {

        const {firstName, lastName, userName, email, password} = req.body;

        if (!firstName || !lastName || !userName || !email || !password){
            res.status(400).json({message:"All fields are required"});
            return;
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({message:"Email already in use"});
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            res.status(400).json({message:"Invalid password format"});
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword,
            role:"admin",
        });

        await newUser.save();

        res.status(201).json({message:"admin registered successfully", user:newUser});
    } catch (error:unknown) {
        if(error instanceof Error){
            res.status(500).json({message:"Internal Server error", error:error.message})
        } else {
            res.status(500).json({message: "Internal server error"})
        }
    }

}
