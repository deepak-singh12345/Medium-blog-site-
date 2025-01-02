import { Router } from "express";
import { adminLogin, adminSignup, deleteBlog, deleteUser, getAllUsers, getSingleUser } from "../controller/adminController";
import { authMiddleware } from "../middleware/authorizationMiddleware";

const adminRouter = Router();

adminRouter.post('/registerAdmin', adminSignup);
adminRouter.get('/loginAdmin', adminLogin);
adminRouter.get('/allUsers', authMiddleware, getAllUsers);
adminRouter.get('/user/:userId', authMiddleware, getSingleUser);
adminRouter.delete('/deleteUser/:userId', authMiddleware, deleteUser);
adminRouter.delete('/deleteBlog/:blogId', authMiddleware, deleteBlog);

export default adminRouter;
