const jwt = require('jsonwebtoken')


const verifyJWT = (req,res,next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    // if it does not start with authheader or if if doesnt start with bearer
    if (!authHeader?.startsWith('Bearer ')) return res.status(401)
    // console.log(authHeader)  //Bearer token
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded) => {
            if (err) return res.sendStatus(403)  //invalid token

            req.user = decoded.UserInfo.username

            next()
        }
    )
}

module.exports = verifyJWT