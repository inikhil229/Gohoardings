const catchError = require("../middelware/catchError");
const request = require('request')
const  {executeQuery} = require("../conn/conn");
const bcrypt = require("bcryptjs");
const jwtToken = require('jsonwebtoken');
const cookie = require('cookie')
const {token} = require("../middelware/token");
const {sendEmail} = require("../middelware/sendEmail");
const ErrorHandle = require("../utils/Errorhandler");



exports.sendOTP = catchError(async (req, res, next) => {
    const {email} =req.query

    if (!email) {
        res.status(206).json({success:false, message: "Wrong Input"})
    }

    const result =await executeQuery("SELECT email from tblcontacts WHERE phonenumber= '" + email + "'",[],"CRM",next)
     if (result.length == 0) {
            return res.status(206).json({success:false,message: "Account Not Found"})

        } else {
            let otp = Math.floor(100000 + Math.random() * 900000);
            request({
                url: process.env.otpUrl,
                method: process.env.otpMethod,
                form: {
                    'authkey': process.env.otpauthkey,
                    'mobiles': email,
                    'message': `${otp} is your one-time OTP for login into the Gohoardings account.`,
                    'sender': process.env.otpSender,
                    'route': process.env.otpRoute,
                    'DLT_TE_ID': process.env.otpDLT_TE_ID
                }
            },async function (error, response, body) {
                if (error) {
                    res.status(400).json({message: error.message})
                } else {
                    const sql = await executeQuery("UPDATE tblcontacts SET phone_otp = " + otp + " WHERE phonenumber = '" + email + "'",[],"CRM",next)
            
                        if (sql) {
                            return res.status(200).json({success: true, message: "Mobile OTP Send.."})
                        }
                   
                }
            })
        }
    })



exports.sendPasswordEmail = catchError(async (req, res, next) => {
    const {email} = req.query
    if (!email) {
        res.status(206).json({message: "Wrong Input"})
    }

   const confirm = await  executeQuery("SELECT userid from tblcontacts WHERE  email='" + email + "'",[],"CRM", next)
       if (confirm.length == 0) {
        next(new ErrorHandle("Email Invalid", `The query in which error occurred sendPasswordEmail Api`,206))
            return res.status(206).json({success:false, message: "Email Invalid"})
        } else {
            let otp = Math.floor(100000 + Math.random() * 900000);
            const message = `${otp} is your one-time OTP for login into the Gohoardings account.`;
            const subject = "Reset password gohoardings.com"
            try {
                await sendEmail({email: email, subject: subject, message: message});
                const sql = "UPDATE tblcontacts SET email_otp=" + otp + " WHERE email='" + email + "'"
                await executeQuery(sql,"gohoardi_crmapp", next)
                 return res.status(200).json({success: true, message: `Email send on ${email}`})
            } catch (error) {
                return res.status(206).json({message: error.message})
            }
        }
    })


exports.checkOTP = catchError(async (req, res, next) => {
    const {otp} = req.body
    const cookieData = req.cookies;
    const countryCode = cookieData.selected_country || "IN"; // Default to India
    if (!otp) {
        return res.status(206).json({success:false, message: "OTP Invalid"})
    }
    const sql =await  executeQuery("SELECT userid from tblcontacts WHERE phone_otp=" + otp + " || email_otp=" + otp + "",[],"CRM", next )

   
        if (sql.length == 0) {
            return res.status(206).json({success:false, message: "OTP Not Match, Try After 1min"})
        } else {
            const userid = sql[0].userid;
            const token = jwtToken.sign({id: userid}, "thisismysecretejsonWebToken", {
                expiresIn: "120000",
            });
            return res.status(200).json({success: true, message: token})
        }
   
})

exports.changePassword = catchError(async (req, res, next) => {

    const {password, confirmpasswords, expire} = req.body
    if (!expire) {
        return res.status(206).json({success:false, message: "Otp Expire"});
    }
    if (password == confirmpasswords) {
    
        jwtToken.verify(expire, "thisismysecretejsonWebToken", async (err, user) => {
            if (err) {
                return res.status(206).json({success:false, message: "Time Out"});
            } else {
                const userid = user.id;
                const finalPassword = bcrypt.hashSync(password, 8)
                const sqlQuery = await executeQuery("UPDATE tblcontacts SET password ='" + finalPassword + "' WHERE userId = " + userid + "",[],"CRM",next);
    if(sqlQuery){
        token(userid, 200, res)
    }
       }
        })
    } else {
     
        return res.status(206).json({success:false, message: "Password not matched"})
    }
})

exports.loginwithOTP = catchError(async (req, res, next) => {

    const {otp} = req.body
    if (!otp) {
        return res.status(206).json({success:false, message: "OTP Invalid"})
    }

    const sql =await executeQuery( "SELECT userid from tblcontacts WHERE phone_otp=" + otp + "",[],"CRM", next)

        if (!sql) {
            return res.status(206).json({success:false, message: "OTP Invalid"})
        } else if (sql.length == 0) {
            return res.status(206).json({success:false, message: "OTP Not Match, Try After 1min"})
        } else {
            const userid = sql[0].userid;
            res.setHeader("Set-Cookie",cookie.serialize('gohoardings',{expires: Date.now()}))
            token(userid, 200, res)
        }

})
