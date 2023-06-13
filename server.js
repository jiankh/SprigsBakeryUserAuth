const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors')
const corsOptions = require("./config/corsOptions")
const cookieParser = require('cookie-parser')
const connectDB =require('./config/dbConn')
const verifyJWT = require('./middleware/verifyJWT')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000

connectDB()

// CROS ORIGIN RESOURCE SHARE
//makes ur server accessible to everyone, ucan whitelist sites. the last two are basically your local host ips
app.use(cors(corsOptions))


app.use(express.urlencoded({ extended: false }))
//for handling urlencoded data or form-data submission

//built-in middleware for JSON
app.use(express.json())

//middleware for cookies
app.use(cookieParser())


app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

//EVERYTHING AFTER JWT WILL HAVE TO PASS VERIFICATION!
app.use(verifyJWT)
//add a route for a user info place or cart



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})