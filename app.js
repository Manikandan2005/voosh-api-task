import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import userRoutes from './routes/AuthRoutes.js';
import thirdPartyService from './routes/ThirdPartyLogin.js'
import userOperations from './routes/userCrud.js'
import { uploadPhoto } from './controller/User.Controller.js'; // Import the photo upload function

dotenv.config();
const app = express();
const PORT = 8000;

app.use(cors({ origin: process.env.CLIENTURL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Middleware for handling file uploads
app.use('/uploads', express.static('uploads'));

app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRoutes);
app.use('/thirdpartyservice',thirdPartyService)
app.use('/userOperations',userOperations)

app.post('/userOperations/upload-photo', uploadPhoto); // Endpoint for uploading a photo

app.listen(PORT, () => console.log(`App is listening ${PORT}`));
