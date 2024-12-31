import express, {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/userModel';


const router = express.Router();

import userRouter from './userRouter';
import adminRouter from './adminRouter';

router.post('/signup', async(req:Request, res:Response):Promise<any> =>{
    try {

        const {firstName, lastName, userName, email, password} = req.body;

        if (!firstName || !lastName || !userName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({message:"Invalid password format"});
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword,
        });

        await newUser.save();

        res.status(201).json({message:"user created successfully", user:newUser});
    } catch (error:unknown) {
        if(error instanceof Error){
            res.status(500).json({message:"Internal Server error", error:error.message})
        } else {
            res.status(500).json({message: "Internal server error"})
        }
    }

})

router.get('/login', async(req:Request, res:Response):Promise<any> => {
    try {
        const {email, userName, password} = req.body;

        if(!password || (!email && !userName)){
            return res.status(400).json({message:"Email or username and password are required"})
        }

        const user = await User.findOne({
            $or: [{email}, {userName}]
        });

        if (!user){
            return res.status(400).json({message:"Invalid email/username or password"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid email/username or password"});
        }

        const secret = process.env.JWT_SECRET as string;

        const token = jwt.sign({
            userId:user._id, email:user.email, role:user.role
        }, secret, {expiresIn:'24h'});

        res.status(200).json({
            message:'Login successful',
            token,
        });
    } catch (error) {
        if (error instanceof Error){
            res.status(500).json({message:"Internal server error", error:error.message})
        }else {
            res.status(500).json({message:"Unknown error occured"});
        }
    }
})

router.use('/', userRouter);
router.use('/admin', adminRouter);


export default router;
