import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const handleGoogleCallback = (req, res) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Set cookie with token
    res.redirect('/profile'); // Redirect to profile page after successful authentication
  })(req, res);
};

export default {
  handleGoogleCallback,
};
