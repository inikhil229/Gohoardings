const jwtToken = require('jsonwebtoken')
const cookie = require('cookie')
const catchError = require('./catchError')

exports.token = catchError(async (userid, statuscode, res) => {

    const token = jwtToken.sign({id: userid}, "thisismysecretejsonWebToken", {
        expiresIn: "7d",
    });
    const option = {
        path: '/',
        httpOnly:true,
        expires: new Date(Date.now() + 7 * 24 * 3600000),
        httpOnly: false,
        sameSite: 'strict',
    }
  
    return res.status(statuscode).setHeader("Set-Cookie",cookie.serialize('gohoardings', token, option)).json({
        success: true,
        message: "Login Successfully"
    })
   
})

exports.verifyToken = catchError(async (req, res, next) => {

    const cookieData = req.cookies;
    if (!cookieData) {
        return res.status(400).json({message: "No Cookie Found"})
    }
    const token = cookieData.gohoardings;
    if (!token) {
        return res.status(400).json({message: "No Token Found"})
    } else {
        return jwtToken.verify(token,  "thisismysecretejsonWebToken", async (err, user) => {
            if (err) {
                return res.status(206).json({message: "InValid Token"});
            } else {
         
                req.id = user.id;
                next()
            }
        })
    }
})









 