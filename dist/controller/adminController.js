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
exports.deleteBlog = exports.deleteUser = exports.getSingleUser = exports.getAllUsers = exports.adminLogin = exports.adminSignup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blogModel_1 = __importDefault(require("../models/blogModel"));
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        if (!firstName || !lastName || !userName || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({ message: 'Invalid password format' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new userModel_1.default({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            role: 'admin'
        });
        yield newUser.save();
        res
            .status(201)
            .json({ message: 'admin registered successfully', user: newUser });
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ message: 'Internal Server error', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.adminSignup = adminSignup;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userName, password } = req.body;
        if (!password || (!email && !userName)) {
            return res
                .status(400)
                .json({ message: 'Email or username and password are required' });
        }
        const user = yield userModel_1.default.findOne({
            $or: [{ email }, { userName }]
        });
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid email/username or password' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: 'Invalid email/username or password' });
        }
        const secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, secret, { expiresIn: '24h' });
        res.status(200).json({
            message: 'Login successful',
            token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(500)
                .json({ message: 'Internal server error', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occured' });
        }
    }
});
exports.adminLogin = adminLogin;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) != 'admin') {
            res
                .status(403)
                .json({ message: 'You are not authorized to access this route' });
            return;
        }
        const allUsers = yield userModel_1.default.find().select('firstName lastName userName email verified blogsCount profilePic deleted deletedAt deletedBy createdAt createdBy');
        // console.log(allUsers);
        res.status(200).json({ message: 'query successful', users: allUsers });
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'unknown error'
        });
    }
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) != 'admin') {
            res
                .status(403)
                .json({ message: 'You are not authorized to access this route' });
            return;
        }
        const { userId } = req.params;
        const userDetails = yield userModel_1.default.findById(userId);
        if (!userDetails) {
            res.status(400).json({ message: 'user not found invalid userId' });
            return;
        }
        const userBlogs = yield blogModel_1.default.find({ createdBy: userId });
        res
            .status(200)
            .json({
            message: 'query successful',
            user: userDetails,
            blogs: userBlogs
        });
        return;
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'unknown error'
        });
    }
});
exports.getSingleUser = getSingleUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) != 'admin') {
            res
                .status(403)
                .json({ message: 'You are not authorized to access this route' });
            return;
        }
        const { userId } = req.params;
        const { reason } = req.body;
        const deletedUser = yield userModel_1.default.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(200).json({ message: "user deleted successfully", deleteUser: exports.deleteUser });
            return;
        }
        else {
            res.status(400).json({ message: "user not found " });
            return;
        }
    }
    catch (error) { }
});
exports.deleteUser = deleteUser;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) != 'admin') {
            res
                .status(403)
                .json({ message: 'You are not authorized to access this route' });
            return;
        }
        const { blogId } = req.params;
        const { reason } = req.body;
        const deletedBlog = yield blogModel_1.default.findByIdAndDelete(blogId);
        if (deletedBlog) {
            res.status(200).json({ message: "blog deleted successfully", deletedBlog });
            return;
        }
        else {
            res.status(400).json({ message: "blog not found " });
            return;
        }
    }
    catch (error) {
    }
});
exports.deleteBlog = deleteBlog;
