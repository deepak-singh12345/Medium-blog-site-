import {Router} from 'express';
import { Request, Response } from 'express';
import { authMiddleware } from '../middleware/authorizationMiddleware';
import { createBlog, deleteBlog, getHomePageBlogs, publishBlog, readSingleBlog, updateBlog } from '../controller/blogController';

const userRouter=Router();

userRouter.post('/blogs/create', authMiddleware, createBlog);
userRouter.put('/blogs/:blogId', authMiddleware, updateBlog);
userRouter.delete('/blogs/:blogId', authMiddleware, deleteBlog);
userRouter.get('/blogs/:blogId', authMiddleware, readSingleBlog);
userRouter.get('/homepage', getHomePageBlogs);
userRouter.put('/blogs/publish/:blogId', authMiddleware, publishBlog);

export default userRouter;
