"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorizationMiddleware_1 = require("../middleware/authorizationMiddleware");
const blogController_1 = require("../controller/blogController");
const userRouter = (0, express_1.Router)();
userRouter.post('/blogs/create', authorizationMiddleware_1.authMiddleware, blogController_1.createBlog);
userRouter.put('/blogs/:blogId', authorizationMiddleware_1.authMiddleware, blogController_1.updateBlog);
userRouter.delete('/blogs/:blogId', authorizationMiddleware_1.authMiddleware, blogController_1.deleteBlog);
userRouter.get('/blogs/:blogId', authorizationMiddleware_1.authMiddleware, blogController_1.readSingleBlog);
userRouter.get('/homepage', blogController_1.getHomePageBlogs);
userRouter.put('/blogs/publish/:blogId', authorizationMiddleware_1.authMiddleware, blogController_1.publishBlog);
exports.default = userRouter;
