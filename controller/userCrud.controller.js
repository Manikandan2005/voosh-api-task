import prisma from '../lib/PrismaClient.js';
import bcrypt from 'bcrypt';
import multer from 'multer';

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await prisma.user.findOne({
      where: { id: userId },
      select: { id: true, username: true, email: true, /* we can add other profile fields as needed */ },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, phone, email, password } = req.body;

    // Update user profile details
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        phone,
        email,
        // Hash the password if entered for change
        password: password ? await bcrypt.hash(password, 10) : undefined,
      },
    });

    // Omiting sensitive fields from the response for security
    const { password: userPassword, ...userInfo } = updatedUser;

    return res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};






const uploadPhoto = async (req, res) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); //upload directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
  });
  const upload = multer({ storage: storage }).single('photo');
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error' });
      } else if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



const profileVisibility = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming you have a role field in your user model

    // Get the requested user's profile
    const requestedUserId = req.params.id; // Assuming you send the user ID in the request params
    const requestedUser = await prisma.user.findOne({
      where: { id: requestedUserId },
      select: { id: true, username: true, email: true, isPublic: true }, // Assuming isPublic is a field indicating profile privacy
    });

    if (!requestedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the requesting user is an admin or if the requested profile is public
    if (userRole === 'admin' || requestedUser.isPublic) {
      return res.status(200).json(requestedUser);
    } else {
      return res.status(403).json({ message: 'You are not authorized to view this profile' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};




export default {
  getUserProfile,
  updateUserProfile,
  profileVisibility,
  uploadPhoto
};
