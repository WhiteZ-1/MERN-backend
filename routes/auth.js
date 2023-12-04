const express = require("express")
const User = require("../models/User")
const route = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const JWT_TOKEN= "zararisgoodman#$"

route.post('/createuser',
    // Condition adn errors
    body('email', "Plzz enter a valid email").isEmail(),
    body('name', "Name must be atleast 3 charactors long").isLength({ min: 3 }),
    body('password', "Password must be atleast 5 charactors long").isLength({ min: 5 }),
    
    async (req, res) => {
        // Conditions adn errors validators
        try{
        let success = false
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({success, errors: errors.array()})
        }

        

        let user = await User.findOne({email:req.body.email}) 
            if(user){
                return res.json({success,errors:"Sorry this user already exists"})
            }

        const salt = await bcrypt.genSalt(10)
        const secpass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass
        })

        const authtoken = jwt.sign({user:user.id}, JWT_TOKEN)
        success = true
        res.json({success,authtoken})
        }
        catch(error){
            console.error({error:error.message})
            res.status(500).send("Internal server error")
        }
})

route.post('/login',
    // Condition adn errors
    body('email', "Plzz enter a valid email").isEmail(),
    body('password', "Password should not be blank").notEmpty(),
    
    async (req, res) => {
        try{
        let success = false
        // Conditions adn errors validators
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({success, errors: errors.array()})
        }
            
        
        const {password,email} = req.body
        const user = await User.findOne({email:email})
        if (!user){
            return res.status(400).json({success,errors:"Plzz enter correct credentials 1"})
        }

        const compare = await bcrypt.compare(password,user.password)
        if (!compare){
            return res.status(400).json({success,errors:"Plzz enter correct credentials 2"})
        }

        const authtoken = jwt.sign({user:user.id}, JWT_TOKEN)
        success = true
        res.json({success , authtoken})
    }
    catch(error){
        console.error({error:error.message})
        res.status(500).send("Internal server error")
    }
    })

route.post('/getuser',fetchuser, async (req, res) => { 
    try {
        const userID = req.user
        const user = await User.findById(userID).select("-password")
        res.send(user)
    } catch(error){
        console.error({error:error.message})
        res.status(500).send("Internal server error")
    }

    })  


module.exports = route

