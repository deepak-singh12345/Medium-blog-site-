import { Request, Response } from "express";
import Blog from "../models/blogModel";

export const createBlog = async(req:Request, res:Response): Promise<void> => {
    try{
        const {title, content} = req.body;

        if (!title || !content){
            res.status(400).json({message:"All fields are required"});
            return;
        }

        if(!req.user || !req.user.userId){
            res.status(401).json({message: "Unauthorized: user not found"})
            return;
        }

        const userid = req.user.userId;


        const newBlog = new Blog({
            title,
            content,
            createdBy:userid
        })

        await newBlog.save();
        res.status(201).json({message:"Blog created successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error instanceof Error ? error.message: "unknown error"})
    }
}


export const updateBlog = async(req:Request, res:Response): Promise<void> => {
    try {
        const {blogId} = req.params;
        const {title, content, published} = req.body;

        if(!title && !content){
            res.status(400).json({message: "At least one field (title or content) is required to update"});
            return;
        }

        const blog = await Blog.findById(blogId);

        if(!blog){
            res.status(404).json({message:"blog not found"});
            return;
        }

        if(req.user?.userId !== blog.createdBy.toString()){
            res.status(403).json({message: "Forbidden: You do not have permission to update this content"});
            return;
        }

        if(title) blog.title = title;
        if(content) blog.content = content;

        await blog.save();
        res.status(200).json({message: "Blog updated successfully", blog});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error instanceof Error ? error.message: "unknown error"})
    }
}

export const deleteBlog = async(req:Request, res:Response): Promise<void> => {
    try {
        const {blogId} = req.params;

        const blog = await Blog.findById(blogId);

        if(!blog){
            res.status(404).json({message:"blog not found"});
            return;
        }

        if(req.user?.userId !== blog.createdBy.toString()){
            res.status(403).json({message: "Forbidden: You do not have permission to update this content"});
            return;
        }

        blog.deleted = true;
        await blog.save();
        res.status(200).json({message: "Blog deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error instanceof Error ? error.message: "unknown error"})
    }
}


export const readSingleBlog = async (req:Request, res:Response): Promise<void> => {
    try {
        const {blogId} = req.params;

        const blog = await Blog.findById(blogId);

        if(!blog || blog.deleted == true){
            res.status(404).json({message:"blog not found"});
            return;
        }

        res.status(200).json({message: "Blog found", blog});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error instanceof Error ? error.message: "unknown error"})
    }
}

export const getHomePageBlogs = async (req:Request, res:Response): Promise<void> => {
    try {
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = 10; //10 blogs per page

        const skip: number = (page-1) * limit;

        const blogs = await Blog.find({deleted: {$ne: true}}).skip(skip).limit(limit).sort({createdAt: -1});

        const totalBlogs = await Blog.countDocuments({deleted: {$ne: true}, published:true});

        const totalPages = Math.ceil(totalBlogs/limit);

        res.status(200).json({
            blogs,
            totalBlogs,
            totalPages,
            currentPage: page,
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
}

export const publishBlog = async(req:Request, res:Response): Promise<void> => {
    try {
        const {blogId} = req.params;

        const blog = await Blog.findById(blogId);

        if(!blog){
            res.status(404).json({message:"blog not found"});
            return;
        }

        if(req.user?.userId !== blog.createdBy.toString()){
            res.status(403).json({message: "Forbidden: You do not have permission to update this content"});
            return;
        }

        blog.published = true;
        await blog.save();
        res.status(200).json({message: "Blog published successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error instanceof Error ? error.message: "unknown error"})
    }
}
