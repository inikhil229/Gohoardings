const { executeQuery } = require("../conn/conn");
const catchError = require("../middelware/catchError");

exports.companyStaff = catchError(async (req, res, next) => {
    const sql = "SELECT *  FROM tblstaff WHERE active=1"
   const data = await executeQuery(sql,[],"CRM")
        if (!data) {
            return res.status(206).json({success:false, message: "Data Not Found"})
        } else {
            return res.status(200).json(data)
        }
 
})

exports.goh_quick_links = catchError(async (req, res, next) => {
    const cookieData = req.cookies;
    const countryCode = cookieData.selected_country || "IN"; // Default to India
   const data = await executeQuery("SELECT * FROM goh_quick_links",[],countryCode)
        if (!data) {
            return res.status(206).json({success:false, message: "Data Not Found"})
        } else {
            return res.status(200).json(data)
        }
   
})


// exports.goh_faqs = catchError(async (req, res, next) => {  
//     const cookieData = req.cookies;
//     const countryCode = cookieData.selected_country || "IN"; // Default to India
//     const data = await executeQuery("SELECT * FROM goh_faqs",[],countryCode)
//         if (!data) {
//             return res.status(206).json({success:false,message: "Data Not Found"})
//         } else {
//             return res.status(200).json(data)
//         }
  
// })


exports.goh_media_and_news = catchError(async (req, res, next) => {
    const cookieData = req.cookies;
    const countryCode = cookieData.selected_country || "IN"; // Default to India
   const data = await executeQuery("SELECT * FROM goh_media_and_news",[],countryCode)
        if (!data) {
            return res.status(206).json({success:false,message: "Data Not Found"})
        } else {

            return res.status(200).json(data)
        }
 
})


exports.goh_testimonials = catchError(async (req, res, next) => {
    const cookieData = req.cookies;
    const countryCode = cookieData.selected_country || "IN"; // Default to India
   const data = await executeQuery("SELECT * FROM goh_testimonials", [],countryCode)
        if (!data) {

            return res.status(206).json({success:false,message: "Data Not Found"})
        } else {

            return res.status(200).json(data)
        }
 
})


