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
exports.publishBlog = exports.getHomePageBlogs = exports.readSingleBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const blogModel_1 = __importDefault(require("../models/blogModel"));
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: "Unauthorized: user not found" });
            return;
        }
        const userid = req.user.userId;
        const newBlog = new blogModel_1.default({
            title,
            content,
            createdBy: userid
        });
        yield newBlog.save();
        res.status(201).json({ message: "Blog created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "unknown error" });
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { blogId } = req.params;
        const { title, content, published } = req.body;
        if (!title && !content) {
            res.status(400).json({ message: "At least one field (title or content) is required to update" });
            return;
        }
        const blog = yield blogModel_1.default.findById(blogId);
        if (!blog) {
            res.status(404).json({ message: "blog not found" });
            return;
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== blog.createdBy.toString()) {
            res.status(403).json({ message: "Forbidden: You do not have permission to update this content" });
            return;
        }
        if (title)
            blog.title = title;
        if (content)
            blog.content = content;
        yield blog.save();
        res.status(200).json({ message: "Blog updated successfully", blog });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "unknown error" });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { blogId } = req.params;
        const blog = yield blogModel_1.default.findById(blogId);
        if (!blog) {
            res.status(404).json({ message: "blog not found" });
            return;
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== blog.createdBy.toString()) {
            res.status(403).json({ message: "Forbidden: You do not have permission to update this content" });
            return;
        }
        blog.deleted = true;
        yield blog.save();
        res.status(200).json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "unknown error" });
    }
});
exports.deleteBlog = deleteBlog;
const readSingleBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        const blog = yield blogModel_1.default.findById(blogId);
        if (!blog || blog.deleted == true) {
            res.status(404).json({ message: "blog not found" });
            return;
        }
        res.status(200).json({ message: "Blog found", blog });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "unknown error" });
    }
});
exports.readSingleBlog = readSingleBlog;
const getHomePageBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; //10 blogs per page
        const skip = (page - 1) * limit;
        const blogs = yield blogModel_1.default.find({ deleted: { $ne: true } }).skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalBlogs = yield blogModel_1.default.countDocuments({ deleted: { $ne: true }, published: true });
        const totalPages = Math.ceil(totalBlogs / limit);
        res.status(200).json({
            blogs,
            totalBlogs,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
});
exports.getHomePageBlogs = getHomePageBlogs;
const publishBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { blogId } = req.params;
        const blog = yield blogModel_1.default.findById(blogId);
        if (!blog) {
            res.status(404).json({ message: "blog not found" });
            return;
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== blog.createdBy.toString()) {
            res.status(403).json({ message: "Forbidden: You do not have permission to update this content" });
            return;
        }
        blog.published = true;
        yield blog.save();
        res.status(200).json({ message: "Blog published successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "unknown error" });
    }
});
exports.publishBlog = publishBlog;
