const fs  = require('fs')
class AppError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        const d = new Date()
        const date = d.getTime()
        fs.appendFileSync('Error.txt', `\n ${message} arrived on ${date} about ${message}`)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError