const ErrorHandle = require('../utils/Errorhandler')
module.exports = (err, req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message ;
     if(err.name == "CastError"){
        const message = `Resouces Not Found.Invalif ${err.path}`
        err = new ErrorHandle(message, 206) 
     }
     if(err.code === 11000){
        const message = 'Json token is invalid, try again'
        err = new ErrorHandle(message, 206)
     }
     if(err.code === "JsonWebTokenError"){
        const message = `Duplicte ${Object.keys(err.keyvalue)} Entered`
        err = new ErrorHandle(message, 206)
     }
     if(err.code === "TokenExpiredError"){
        const message = 'Json token is invalid, try again'
        err = new ErrorHandle(message, 206)
     }
     if(err.code === "jwt malformed"){
        const message = 'User NOT Found '
        err = new ErrorHandle(message, 206)
     }
     


    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        statusCode:err.statusCode,
        error:err.stack
    })
}