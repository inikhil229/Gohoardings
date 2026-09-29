const jwtToken = require('jsonwebtoken')
const cookie = require('cookie')
const catchError = require('./catchError');

export const createToken = catchError(async (userid, statuscode, res) => {
    const token = jwtToken.sign({id: userid}, "thisismysecretejsonWebToken", {
        expiresIn: "7d",
    });
    const option = {
        path: '/',
        httpOnly:false,
        expires: new Date(Date.now() + 7 * 24 * 3600000)
    } 
    return res.status(statuscode).setHeader("Set-Cookie",cookie.serialize(`SocialAuto`, token, option)).json({
        success: true,
        message: "Your can countinue"
    })  
}) 

export const verifyToken = async (req, res, next) => {

    const cookieData = req.cookies;
    if (!cookieData) {
        return res.status(400).json({message: "No Cookie Found"}) 
    }
    const key = `SocialAuto`
    const token = cookieData[key];
    if (!token) {
        return res.status(206).json({message: "No Token Found"})
    } else {
        return jwtToken.verify(token,  "thisismysecretejsonWebToken", async (err, user) => {
            if (err) {
                return res.status(206).json({message: "InValid Token"});
            } else {
        const data = user.id
        if(data){
          req.id = {userid:  data}
       
        }
            }
        })
    }
    
}

export const extractUserIdFromCookie =async (req, res) => {
    const cookieHeader = req.headers.cookie;
    let userid = null;
    if (cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      const token = cookies.SocialAuto;
      const decodedToken = jwtToken.decode(token);
      userid = decodedToken ? decodedToken.id : null;
    }
    req.userid = userid; 

  };
  

  
