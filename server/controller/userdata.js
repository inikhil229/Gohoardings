const { executeQuery } = require('../conn/conn');
const catchError = require('../middelware/catchError');
const redis = require('redis');
const axios = require('axios');
const crypto = require('crypto');

const client = redis.createClient();
client.connect();

exports.allcompanyData = catchError(async (req, res, next) => {
    const userId = req.id;
    const result = await executeQuery("SELECT * FROM tblclients WHERE userid = " + userId, [], "CRM");
    if (result) {
        return res.status(200).json(result);
    }
});

exports.Profile = catchError(async (req, res, next) => {
    const userId = req.id;
    const countryCode = req.cookies.selected_country || "IN";
    const search_activity = 'user, phone, campaign_name, start_date, end_date, city, pincode, address, campaign_city, media_type, status, payment_status, code';
    const sql = await executeQuery("SELECT " + search_activity + " FROM goh_campaign WHERE user='" + userId + "' AND status = 1", [], countryCode);

    if (sql) {
        req.getItemdata = sql;
        next();
    }
});

exports.getItemid = catchError(async (req, res, next) => {
    const userId = req.id;
    const countryCode = req.cookies.selected_country || "IN";

    const sql = await executeQuery("SELECT mediaid, mediatype FROM goh_shopping_carts_item WHERE userid=" + userId, [], countryCode);
    if (sql) {
        const newdata = await alldata(sql, countryCode, next);
        const data = req.getItemdata;

        if (newdata) {
            for (let i = 0; i < data.length; i++) {
                data[i].page_title = newdata[i]?.page_title || null;
                data[i].illumination = newdata[i]?.illumination || null;
                data[i].subcategory = newdata[i]?.subcategory || null;
            }
        }
        return res.status(200).json({ message: data });
    }
});

const alldata = async (data, countryCode, next) => {
    let promises = [];

    data.forEach((obj) => {
        let table_name;
        switch (obj.mediatype) {
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

        promises.push(
            executeQuery(
                `SELECT media.code, media.illumination, media.page_title, media.subcategory FROM ${table_name} AS media WHERE media.code='${obj.mediaid}'`,
                [],
                countryCode
            )
        );
    });

    try {
        const results = await Promise.allSettled(promises);
        return results
            .filter(result => result.status === "fulfilled")
            .map(result => result.value[0]); // Extract the first row from each result
    } catch (err) {
        return [];
    }
};

const WEBHOOK_SECRET = '7650c3b9224b7e059a7eab393f39ee3a8f5a74f129a9f5cebd7dde04a4f317090316b0b8428833d464d7269578a4eb4a';

function verifySignature(body, signature) {
    if (typeof body !== 'string') {
        body = JSON.stringify(body);
    }
    const digest = crypto.createHmac('sha1', WEBHOOK_SECRET).update(body).digest('hex');
    return signature === digest;
}

exports.tawkto = catchError(async (req, res, next) => {
    const { visitor } = req.body;
    const countryCode = req.cookies.selected_country || "IN";
    const text = req.body.message.text;
    const phoneRegex = /Phone : (\d+)/;
    const match = text.match(phoneRegex);
    const phoneNumber = match && match[1] ? match[1] : "1234567890";

    if (!verifySignature(req.body, req.headers['x-tawk-signature'])) {
        const q = `INSERT INTO enquiry (name, email, phone, message) VALUES ('name', 'email@email.com', '9765432356', 'error')`;
        await executeQuery(q, [], countryCode);
        return res.send("error");
    }

    const result = await sendtawktolead(visitor.name, visitor.email, phoneNumber, visitor.city);
    res.send(result);
});

async function sendtawktolead(name, email, phone, city) {
    try {
        const url = `https://rocket.gohoardings.com/test?name=${name}&email=${email}&phone=${phone}&city=${city}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Axios error:', error.message);
        return false;
    }
}
