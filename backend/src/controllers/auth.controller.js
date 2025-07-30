import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { fullName, username, email, age, password } = req.body;
  
    try {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
  
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullName,
        email,
        username,
        age,
        password: hashedPassword,
      });
  
      if (newUser) {
        generateToken(newUser._id, res);
        await newUser.save();
  
        res.status(200).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          age: newUser.age,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("error in signup controller:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: "invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"})
        }
        
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({message: "internal server error"})
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "logged out sucessfully"})
    
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({message: "Internal server error"})
    }
}
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({message: "profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
        res.status(200).json({updatedUser})
    } catch (error) {
        console.log("error in update profile:", error)
        res.status(500).json({message: "internal server error"})
    }
}
export const checkAuth =  (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth controller: ", error.message)
        res.status(500).json({message: "internal server error"})
    }
}

export const checkUsernameAvailability = async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({ available: true });
  } catch (error) {
    console.log("error in checkUsernameAvailability:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
