import User from "../Models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
 
//register user

export const registerUser = async(req,res)=>{
    try {
        const {username,email,password,role} = req.body;
        const hashpassword = await bcrypt.hash(password,10)
        //console.log(hashpassword);
        const newUser = new User({username,email,password:hashpassword,role})
        await newUser.save();
        res.status(200).json({message:"user registered successfuly",data:newUser})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//login user
export const loginUser = async(req,res)=>{
    try {
        const {email,password,} = req.body;
        const user = await User.findOne({email})
        if (!user) {
                return res.status(404).json({message:"User not found"})            
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if (!passwordMatch) {
            return res.status(400).json({message:"Invalid password"})    
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        user.token = token
        await user.save();
        res.status(200).json({message:"user logged in successfully ",token :token})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//get user

export const getUser = async (req, res) => {
    try {
      //const userId = req.user._id;
      const user = await User.find();
      res.status(200).json({ message: "Authorized User", data: user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };