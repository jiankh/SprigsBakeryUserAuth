const User = require('../model/User')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies
    if ( !cookies?.jwt ) return res.sendStatus(401)
    //^ check if thre is any cookies and then if there is any jwt property
    
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403) //Forbidden

    //Evaluate the jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403)  //if error or the username does not match the token then FORBIDDEN

            //RESIGN A NEW token if is verified
            const accessToken = jwt.sign(
                { 'UserInfo': {
                    'username':decoded.username
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expires: '30s'}
            )

            res.json({ accessToken })
        }
    )   
}

module.exports = { handleRefreshToken }