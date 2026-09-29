const { executeQuery } = require("../conn/conn");
const catchError = require("../middelware/catchError");
const redis = require("redis");
const client = redis.createClient();
client.connect();

exports.Nearproduct = catchError(async (req, res, next) => {
  const { code, category_name } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${code + category_name}`;
  const noOfLogo = 2;
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
  const data = await client.get(key);
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const result = await executeQuery(
      "SELECT * FROM " + table_name + " WHERE code='" + code + "' LIMIT 1",
      [],
      countryCode,
      next,
    );
    if (!result) {
      return res.send({ err: "Empty", message: "Media Not Found" });
    } else {
      const lat = parseFloat(result[0].latitude + parseFloat(`0.${noOfLogo}`));
      const long = parseFloat(
        result[0].longitude + parseFloat(`0.${noOfLogo}`),
      );
      const sql =
        "SELECT  * FROM " +
        table_name +
        " WHERE  latitude BETWEEN  '" +
        lat +
        "' AND  '" +
        result[0].latitude +
        "' ||  longitude BETWEEN  '" +
        result[0].longitude +
        "'  AND  '" +
        long +
        "'";
      const data = await executeQuery(sql, "bb", next);
      if (!data) {
        return res.send({ resolve: "Empty", message: "Media Not Found" });
      } else {
        client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(data));
        return res.send(data);
      }
    }
  }
});

exports.NearproductByLocation = catchError(async (req, res, next) => {
  const { category_name, city_name, loca, noOfLogo } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${category_name + city_name + loca + noOfLogo}`;
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
  const data = await client.get(key);
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const result = await executeQuery(
      "SELECT * FROM " +
        table_name +
        " WHERE location='" +
        loca +
        "' && city_name='" +
        city_name +
        "'",
      [],
      countryCode,
      next,
    );
    if (result) {
      return res.send(result);
    }
  }
});

exports.product = catchError(async (req, res, next) => {
  const { page_title, category_name, code } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  let table_name = "goh_media";

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

  const key = `${page_title}_${category_name}_${code}`;
  const cachedData = await client.get(key);
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }
  const sqlQuery = `
    SELECT medianame, areadescription, card_rate, category_name, city_name, code, foot_fall, footfall, 
           ftf, height, width, id, illumination, isBooked, latitude, longitude, location, 
           page_title, subcategory, thumb, thumbnail, price,price_format , size, state 
    FROM ${table_name} 
    WHERE TRIM(page_title) = ? AND TRIM(code) = ?
  `;

  try {
    const result = await executeQuery(
      sqlQuery,
      [page_title, code],
      countryCode,
      req,
    );

    if (result.length > 0) {
      await client.setEx(
        key,
        process.env.REDIS_TIMEOUT,
        JSON.stringify(result),
      );
      return res.json(result); // Return all results
    } else {
      return res.json({ message: "No data found", success: false });
    }
  } catch (error) {
    console.error("Database Query Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

exports.latlongdata = catchError(async (req, res, next) => {
  const { lat, long } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const data = `id,illumination,height, width,ftf,code, latitude, longitude,mediaownercompanyname,price, thumb, category_name, subcategory, medianame,price,city_name,page_title,  ( 3959 * acos(cos( radians( ${lat} ) ) *cos( radians( latitude ) ) *cos(radians( longitude ) - radians( ${long} )) +sin(radians(${lat})) *sin(radians(latitude)))) distance`;
  const sql = await executeQuery(
    "SELECT " +
      data +
      " FROM goh_media HAVING distance < 3 UNION SELECT " +
      data +
      " FROM goh_media_digital HAVING distance < 3 UNION SELECT " +
      data +
      " FROM goh_media_transit HAVING distance < 3 UNION SELECT " +
      data +
      " FROM goh_media_mall HAVING distance < 3 UNION SELECT " +
      data +
      " FROM goh_media_airport HAVING distance < 3 UNION SELECT " +
      data +
      " FROM goh_media_inflight HAVING distance < 3 UNION SELECT " +
      data +
      " FROM goh_media_office HAVING distance < 3",
    [],
    countryCode,
    next,
  );
  if (sql) {
    return res.status(200).json(sql);
  }
});
