/* test this code: https://youtu.be/K8YELRmUb5o?si=V0NfydWy-PFnObno&t=2452 */

import bcrypt from "bcrypt" //will allow us to encrypt passwords
import jwt from "jsonwebtoken" //will allow us to give the user a unique jwt that can be used for authorization
import User from "../models/User.js";

/*  REGISTER USER */

export const register = async(req, res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picurePath,
            friends,
            location,
            occupation
        } = req.body;


        const salt = await bcrypt.genSalt(); //this is going to create the salt with which we are going to encrypt the passwords
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picurePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions: Math.floor(Math.random()*10000)

        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        //201 means the newUser has been created
    }

    catch(err){
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */

export const login = async(req, res) =>{
    try{

        const { email, password} = req.body;
        const user = await User.findOne({email: email});

        if(!user) return res.status(400).json({msg: "User does not exist. "});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({msg: "Invalid credentials. "});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password;

        res.status(200).json({token, user});

    }

    catch(err){
        res.status(500).json({ error: err.message });
    }
};


 