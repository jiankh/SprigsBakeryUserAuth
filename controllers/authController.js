
const User = require('../model/User')  //SCHEMA model

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req,res) => {
    const { user, pwd } = req.body 
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password required'})

    //checking if user exist
    const foundUser = await User.findOne( { username: user }).exec()
    if (!foundUser) return res.sendStatus(401)  //unauthorized

    //evaluate password
    const match = await bcrypt.compare( pwd, foundUser.password ) //outputs T/F
    if (match) {
        //can add roles HERE

        const accessToken = jwt.sign(
            {   'UserInfo': {
                'username': foundUser.username
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m'}
        )

        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )

        foundUser.refreshToken = refreshToken //update the refresh token from the user schema
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, secure:true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})  //save token as http. ADD secure:true later
        res.json({ accessToken }) //save access token in memory and not localstorage/cookie
    } else {
        res.sendStatus(401)
    }
}

module.exports = {handleLogin}