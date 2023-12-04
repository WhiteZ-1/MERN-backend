const express = require("express")
const fetchuser = require("../middleware/fetchuser")
const Note = require("../models/Note")
const route = express.Router()
const { body, validationResult } = require('express-validator');



route.get("/fetchallnotes", fetchuser, async(req,res)=>{
    const notes = await Note.find({user:req.user})
    res.send(notes)
})


route.post("/addnote",fetchuser,
body('title', "Title must be atleast 3 charactors long").isLength({ min: 3 }),
body('description', "Description must be atleast 5 charactors long").isLength({ min: 5 }),

async(req,res)=>{
    
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const{title,description,tag} = req.body

        const note = new Note({title,description,tag,user:req.user})
        
        const savedNote = await note.save()

        res.send(savedNote)

    }
    catch(error){
        console.error({error:error.message})
        res.status(500).send("Internal server error")
    }
})

route.put("/update/:id",fetchuser,
body('title', "title must be atleast 3 charactors long").isLength({ min: 3 }),
body('description', "description must be atleast 5 charactors long").isLength({ min: 5 }),
body('tag', "tag must be atleast 3 charactors long").isLength({ min: 3 }),

async(req,res)=>{
    
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const{title,description,tag} = req.body
        const newNote={}
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        let note  = await Note.findById(req.params.id)

        if(!note){
            return res.status(404).send("Not Found")
        }

        if(note.user.toString() !== req.user){
            return res.status(400).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
        
        res.send(note)

    }
    catch(error){
        console.error({error:error.message})
        res.status(500).send("Internal server error")
    }
})

route.delete("/delete/:id",fetchuser,
async(req,res)=>{
    
    try {

        let note  = await Note.findById(req.params.id)

        if(!note){
            return res.status(404).send("Not Found")
        }

        if(note.user.toString() !== req.user){
            return res.status(400).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        
        res.send(note)

    }
    catch(error){
        console.error({error:error.message})
        res.status(500).send("Internal server error")
    }
})

module.exports = route