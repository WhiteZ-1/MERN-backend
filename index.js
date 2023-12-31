const express = require('express')
const connectToMongoose = require("./db")
var cors = require('cors')
connectToMongoose()

var app = express()

app.use(cors())
const port = 5000

app.use(express.json())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})