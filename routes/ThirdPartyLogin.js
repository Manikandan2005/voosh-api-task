import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';

const router = express.Router();

// Google OAuth routes

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  authController.handleGoogleCallback);

//we can Add routes for other OAuth providers (Facebook, Twitter, GitHub) similarly

export default router;
