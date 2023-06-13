const User = require('../model/User')

const handleLogout = async (req,res) => {
    //on Client must delete access Token

    const cookies =req.cookies
    if ( !cookies?.jwt ) return res.sendStatus(204) //no jwt cookie found, so we dont need to delete. just send ok status

    const refreshToken = cookies.jwt

    //check if this refreshToken is in the DB
    const foundUser = await User.findOne({ refreshToken }).exec()

    if (!foundUser) { //if we have a jwt cookie BUT we did not find a user with that jwt token
        res.clearCookie('jwt', { httpOnly:true, sameSite:'None', secure:true})
        return res.sendStatus(204)
    }

    //Now if we have a cookie and we did find a user with it
    foundUser.refreshToken = ""
    const result = await foundUser.save()

    res.clearCookie('jwt', {httpOnly:true, sameSite: 'None', secure:true })
    res.sendStatus(204)

}

module.exports = { handleLogout }