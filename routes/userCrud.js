import express from "express"
import authController from "../controller/Auth.Controller.js"
import { verifyToken } from "../controller/middleware/verifyToken.js"

const router = express.Router()

router.get('/profile',verifyToken,authController.profile)  // adding the middleware to ensure security
router.post('/upload-photo', verifyToken, uploadPhoto);
router.get('/profile/:id', verifyToken, authController.getUserProfile);

export default router