const catchError = require("../middelware/catchError");
const {executeQuery} =  require('../conn/conn')
const xlsx = require('xlsx');
const redis = require('redis');
const client = redis.createClient()
    client.connect()


exports.allCity = catchError(async (req, res, next) => {
   
    const sql = await executeQuery("SELECT DISTINCT name FROM goh_cities","gohoardi_goh",next)
      if (sql) {
            res.send(sql)

    }});



exports.SiteMapProduct = catchError(async (req, res, next) => {
const  category_name  = req.query.email
    switch (category_name) {
        case "billboard":
            table_name = "goh_media";
            break;
        case "digital-billboard":
            table_name = "goh_media_digital";
            break;
        case "transit-media":
            table_name = "goh_media_transit";
            break;
        case "mall-media":
            table_name = "goh_media_mall";
            break;
        case "airport-media":
            table_name = "goh_media_airport";
            break;
        case "inflight_media":
            table_name = "goh_media_inflight";
            break;
        case "lift-branding":
            table_name = "goh_media_office";
            break;
        default:
            table_name = "goh_media";
    }
        const sql = await executeQuery("SELECT DISTINCT page_title, category_name FROM " + table_name + " WHERE  category_name = '"+category_name+"' &&  page_title IS NOT NULL","gohoardi_goh",next)
            if (sql) {   
                return res.send(sql)
            }
        })


 
 
   