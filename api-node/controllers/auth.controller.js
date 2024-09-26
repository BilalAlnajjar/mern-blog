import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken"

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

export const signIn = async (req,res,next) => {
    const { email ,password } = req.body
    if(!email || !password || email === "" || password === ""){
        next(errorHandler(400,"all fields are required"))
    }
    try{
        const validUser = await User.findOne({ email })
        if(!validUser){
            return next(errorHandler(400,"User not found"))
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if (!validPassword){
            return next(errorHandler(400,"invalid password"))
        }

        const token = jwt.sign(
            {id:validUser._id},process.env.JWT_SECRET
        )
        const {password:pass,...rest} = validUser._doc
        res.status(200).cookie('access_token',token,{
            httpOnly:true
        }).json(rest)

    }catch (error) {
        next(error)
    }
}