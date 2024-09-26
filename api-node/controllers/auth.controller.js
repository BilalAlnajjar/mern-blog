import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import {errorHandler} from "../utils/error.js";

export const signUp = async (req,res,next) => {
   const {username,email,password} = req.body;

    if(
        !username || !password || !email ||
        username.trim() === '' || email.trim() === '' || password.trim() === '') {
        return next(errorHandler(400,'All fields are required'))
    }

    const hashPassword = bcryptjs.hashSync(password,10)

    const newUser = new User({
        username, // or username:username
        email, // or email:email
        password :hashPassword
    })

    try{
        await newUser.save()
        return res.status(200).json("sign up successfully" )
    }catch(err){
        next(err)
    }


}