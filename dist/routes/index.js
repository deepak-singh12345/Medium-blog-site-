"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
const userRouter_1 = __importDefault(require("./userRouter"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        if (!firstName || !lastName || !userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Invalid password format" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.default({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json({ message: "user created successfully", user: newUser });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server error", error: error.message });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
router.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userName, password } = req.body;
        if (!password || (!email && !userName)) {
            return res.status(400).json({ message: "Email or username and password are required" });
        }
        const user = yield userModel_1.default.findOne({
            $or: [{ email }, { userName }]
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid email/username or password" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email/username or password" });
        }
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({
            userId: user._id, email: user.email, role: user.role
        }, secret, { expiresIn: '24h' });
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
        else {
            res.status(500).json({ message: "Unknown error occured" });
        }
    }
}));
router.use('/', userRouter_1.default);
router.use('/admin', adminRouter_1.default);
exports.default = router;
