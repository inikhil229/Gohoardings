const fs  = require('fs')
class ErrorHandle extends Error{
    constructor(message,apiAddrss,statusCode){

    super(message);
    this.statusCode = statusCode;

    const date = new Date()

fs.appendFileSync('Error.txt', `\n ${message} arrived on ${date} at ${apiAddrss}`)

   Error.captureStackTrace(this,this.constructor);
}}

module.exports = ErrorHandle;