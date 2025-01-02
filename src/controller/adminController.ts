import { Request, Response } from 'express'
import User from '../models/userModel'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Blog from '../models/blogModel'
import { resolveSoa } from 'dns'

export const adminSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, userName, email, password } = req.body

    if (!firstName || !lastName || !userName || !email || !password) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' })
      return
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Invalid password format' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      role: 'admin'
    })

    await newUser.save()

    res
      .status(201)
      .json({ message: 'admin registered successfully', user: newUser })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: 'Internal Server error', error: error.message })
    } else {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, userName, password } = req.body

    if (!password || (!email && !userName)) {
      return res
        .status(400)
        .json({ message: 'Email or username and password are required' })
    }

    const user = await User.findOne({
      $or: [{ email }, { userName }]
    })

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid email/username or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: 'Invalid email/username or password' })
    }

    const secret = process.env.JWT_SECRET as string

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      message: 'Login successful',
      token
    })
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message })
    } else {
      res.status(500).json({ message: 'Unknown error occured' })
    }
  }
}

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role != 'admin') {
      res
        .status(403)
        .json({ message: 'You are not authorized to access this route' })
      return
    }

    const allUsers = await User.find().select(
      'firstName lastName userName email verified blogsCount profilePic deleted deletedAt deletedBy createdAt createdBy'
    )
    // console.log(allUsers);
    res.status(200).json({ message: 'query successful', users: allUsers })
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'unknown error'
      })
  }
}

export const getSingleUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role != 'admin') {
      res
        .status(403)
        .json({ message: 'You are not authorized to access this route' })
      return
    }

    const { userId } = req.params

    const userDetails = await User.findById(userId)
    if (!userDetails) {
      res.status(400).json({ message: 'user not found invalid userId' })
      return
    }
    const userBlogs = await Blog.find({ createdBy: userId })

    res
      .status(200)
      .json({
        message: 'query successful',
        user: userDetails,
        blogs: userBlogs
      })
    return
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'unknown error'
      })
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role != 'admin') {
      res
        .status(403)
        .json({ message: 'You are not authorized to access this route' })
      return
    }

    const { userId } = req.params

    const { reason } = req.body

    const deletedUser = await User.findByIdAndDelete(userId)

    if (deletedUser) {
        res.status(200).json({message:"user deleted successfully", deleteUser})
        return;
    } else {
        res.status(400).json({message: "user not found "});
        return;
    }
  } catch (error) {}
}

export const deleteBlog = async(req:Request, res:Response): Promise<void> => {
    try {
        if(req.user?.role != 'admin'){
            res
        .status(403)
        .json({ message: 'You are not authorized to access this route' })
      return;
        }

        const {blogId} = req.params;

        const {reason} = req.body;

        const deletedBlog = await Blog.findByIdAndDelete(blogId);


    if (deletedBlog) {
        res.status(200).json({message:"blog deleted successfully", deletedBlog})
        return;
    } else {
        res.status(400).json({message: "blog not found "});
        return;
    }
    } catch (error) {

    }
}
