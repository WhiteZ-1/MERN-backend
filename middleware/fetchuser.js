const jwt = require("jsonwebtoken")
const JWT_TOKEN= "zararisgoodman#$"

const fetchuser = (req,res,next) =>{
    const token = req.header("Authorization")
    if(!token){
        res.status(401).send({error:"Acess denied"})
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN)
        req.user = data.user
        next()

    } 
    catch (error){
        res.status(500).send("Plzz authenticate your token")
    }
    
    
}

module.exports = fetchuser