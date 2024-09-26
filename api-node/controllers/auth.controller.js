import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"

export const signUp = async (req,res) => {
   const {username,email,password} = req.body;

    if(!username || !password || !email || username === '' || email === '' || password === '') {
        return res.status(400).json({message: 'All fields are required'});
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
        return res.status(500).json({message :err.message })
    }


}