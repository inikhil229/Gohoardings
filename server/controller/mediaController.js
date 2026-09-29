const { executeQuery } = require("../conn/conn");
const jwtToken = require("jsonwebtoken");
const catchError = require("../middelware/catchError");
const redis = require("redis");
const ErrorHandle = require("../utils/Errorhandler");
const client = redis.createClient();
const { promisify } = require("util");

client.connect();

exports.city = catchError(async (req, res, next) => {
  const { value } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to "IN"
  let citystart = "";
  if (value) {
    citystart = " WHERE name LIKE '" + value + "%'";
  }
  const data = await client.get(`cities${citystart}`);
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const sql = await executeQuery(
      "SELECT DISTINCT name FROM goh_cities " + citystart + "  LIMIT 8",
      [],
      countryCode,
      next,
    );
    if (sql) {
      client.setEx(
        `cities${citystart}`,
        process.env.REDIS_TIMEOUT,
        JSON.stringify(sql),
      );
      return res.status(200).json(sql);
    }
  }
});

exports.state_name = catchError(async (req, res, next) => {
  const { state_name, pages } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to "IN"
  const pagination = pages ? pages : 10;
  const sql = await executeQuery(
    "SELECT * FROM `tblstates` WHERE `name` = '" + state_name + "'",
    "gohoardi_goh",
    next,
  );
  if (sql && sql.length > 0) {
    const resultArray = await executeQuery(
      "SELECT * FROM `goh_cities` WHERE `state_id` = " + sql[0].id + "",
      "gohoardi_goh",
      next,
    );

    if (resultArray && Array.isArray(resultArray) && resultArray.length > 0) {
      const names = resultArray.map((row) => row.id);

      const data =
        "mediaownercompanyname, thumb, category_name, page_title,subcategory, medianame, price, location, state, city_name, width, height, foot_fall, illumination, latitude, longitude";
      const query =
        "SELECT * FROM (" +
        "SELECT " +
        data +
        " FROM goh_media WHERE city IN (" +
        names +
        ") " +
        "UNION " +
        "SELECT " +
        data +
        " FROM goh_media_digital WHERE city IN (" +
        names +
        ") " +
        "UNION " +
        "SELECT " +
        data +
        " FROM goh_media_transit WHERE city IN (" +
        names +
        ") " +
        "UNION " +
        "SELECT " +
        data +
        " FROM goh_media_mall WHERE city IN (" +
        names +
        ") " +
        "UNION " +
        "SELECT " +
        data +
        " FROM goh_media_airport WHERE city IN (" +
        names +
        ") " +
        "UNION " +
        "SELECT " +
        data +
        " FROM goh_media_inflight WHERE city IN (" +
        names +
        ") " +
        "UNION " +
        "SELECT " +
        data +
        " FROM goh_media_office WHERE city IN (" +
        names +
        ") " +
        ") AS combined_query " +
        "LIMIT " +
        pagination +
        "";
      const result = await executeQuery(query, [], countryCode, next);

      return res.status(200).json(result);
    }
    return res.send([]);
  }

  let citystart = "";
  if (value) {
    citystart = " WHERE name LIKE '" + value + "%'";
  }
  const data = await client.get(`cities${citystart}`);
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const sql = await executeQuery(
      "SELECT DISTINCT name FROM goh_cities " + citystart + "  LIMIT 8",
      "gohoardi_goh",
      next,
    );
    if (sql) {
      client.setEx(
        `cities${citystart}`,
        process.env.REDIS_TIMEOUT,
        JSON.stringify(sql),
      );
      return res.status(200).json(sql);
    }
  }
});

// exports.SearchData = catchError(async (req, res, next) => {
//   console.log("inside search data api ",req.body)
//   // const { category_name, city_name } = req.body;

//   const cookieData = req.cookies;
//   console.log(cookieData)
//    const city = cookieData.city_name ? cookieData.city_name : "delhi";
//    const category_name = cookieData.category_name;
//   const countryCode = cookieData.selected_country || "IN"; // Default to "IN"
//   // const key = `${category_name + city_name}`;
//   const key = `${category_name}_${city}_${countryCode}`;

//   if (!cookieData) {
//     return res.status(204).json({ message: "No Cookie Found" });
//   }
//   console.log("cookieData found",cookieData);
//   switch (category_name) {
//     case "billboard":
//       table_name = "goh_media";
//       break;
//     case "digital-billboard":
//       table_name = "goh_media_digital";
//       break;
//     case "transit-media":
//       table_name = "goh_media_transit";
//       break;
//     case "mall-media":
//       table_name = "goh_media_mall";
//       break;
//     case "airport-media":
//       table_name = "goh_media_airport";
//       break;
//     case "inflight-media":
//       table_name = "goh_media_inflight";
//       break;
//     case "lift-branding":
//       table_name = "goh_media_office";
//       break;
//     default:
//       table_name = "goh_media";
//   }
//   let sql;
//   console.log("after sql line")
//   const token = cookieData.gohoardings;
//   console.log("this is the token",token)
//   return jwtToken.verify(
//     token,
//     "thisismysecretejsonWebToken",
//     async (err, user) => {
//       if (err) {
//         sql =
//           "SELECT DISTINCT * FROM " +
//           table_name +
//           " WHERE city_name='" +
//           city_name +
//           "' && price > 1 &&  price != 'Ask Price'";
//       } else {
//         const userID = user.id;
//         sql =
//           "SELECT DISTINCT media.*, cart.campaigid, cart.userid, cart.isDelete FROM " +
//           table_name +
//           " AS media LEFT JOIN goh_shopping_carts_item AS cart ON media.code=cart.mediaid AND cart.userid = '" +
//           userID +
//           "' WHERE media.city_name = '" +
//           city +
//           "' && media.price > 1 &&  media.price != 'Ask Price' ORDER BY `cart`.`userid` DESC ";
//       }

//       const data = await client.get(key);
//       console.log("data from redis",data)
//       if (data) {
//         return res.status(200).json(JSON.parse(data));
//       } else {
//         const dataLimit = await executeQuery(sql, [], countryCode, next);
//         if (dataLimit) {
//           client.setEx(
//             key,
//             process.env.REDIS_TIMEOUT,
//             JSON.stringify(dataLimit),
//           );
//           return res.status(200).json(dataLimit);
//         }
//       }
//     },
//   );
// });

exports.SearchData = catchError(async (req, res, next) => {

  const cookieData = req.cookies;

  if (!cookieData) {
    return res.status(204).json({ message: "No Cookie Found" });
  }

  const city = cookieData.city_name || "delhi";
  const category_name = cookieData.category_name;
  const countryCode = cookieData.selected_country || "IN";

  let table_name;

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
    case "inflight-media":
      table_name = "goh_media_inflight";
      break;
    case "lift-branding":
      table_name = "goh_media_office";
      break;
    default:
      table_name = "goh_media";
  }

  const token = cookieData.gohoardings;
  let userID = null;

  // Verify token (don't fail if it's invalid)
  if (token) {
    try {
      const decoded = jwtToken.verify(token, "thisismysecretejsonWebToken");
      userID = decoded.id;
    } catch (err) {
      console.log("Invalid token");
    }
  }

  // Different cache key for logged-in users
  const key = userID
    ? `${category_name}_${city}_${countryCode}_${userID}`
    : `${category_name}_${city}_${countryCode}`;

  const cached = await client.get(key);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  let sql;

  if (userID) {
    sql = `
      SELECT DISTINCT
        media.*,
        cart.campaigid,
        cart.userid,
        cart.isDelete
      FROM ${table_name} AS media
      LEFT JOIN goh_shopping_carts_item AS cart
        ON media.code = cart.mediaid
        AND cart.userid='${userID}'
      WHERE media.city_name='${city}'
        AND media.price > 1
        AND media.price != 'Ask Price'
      ORDER BY cart.userid DESC
    `;
  } else {
    sql = `
      SELECT DISTINCT *
      FROM ${table_name}
      WHERE city_name='${city}'
        AND price > 1
        AND price != 'Ask Price'
    `;
  }

  const result = await executeQuery(sql, [], countryCode, next);

  if (result) {
    await client.setEx(
      key,
      Number(process.env.REDIS_TIMEOUT),
      JSON.stringify(result),
    );

    return res.status(200).json(result);
  }
});

exports.mediaData = catchError(async (req, res, next) => {
  try {
    const { category_name, noofPage } = req.body;
    const pagination = noofPage ? parseInt(noofPage, 10) : 8;
    const cookies = req.cookies;

    if (!cookies) {
      return res.status(204).json({ message: "No Cookie Found" });
    }

    const countryCode = cookies.selected_country || "IN"; // Default to India if not set
    const token = cookies.gohoardings;
    const cacheKey = `${category_name}_${pagination}_${countryCode}`;

    const tableMap = {
      billboard: "goh_media",
      "digital-billboard": "goh_media_digital",
      "transit-media": "goh_media_transit",
      "mall-media": "goh_media_mall",
      "airport-media": "goh_media_airport",
      "inflight-media": "goh_media_inflight",
      "lift-branding": "goh_media_office",
    };
    const table_name = tableMap[category_name] || "goh_media";

    console.log(
      `Fetching data for category: ${category_name}, Country: ${countryCode}, Table: ${table_name}`,
    );

    // Clear Redis cache to get fresh data
    await client.del(cacheKey);

    // Check Redis cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    let sql;
    let userID = null;

    // Verify JWT Token
    const user = await new Promise((resolve, reject) => {
      jwtToken.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) resolve(null);
        else resolve(decodedUser);
      });
    });

    if (user) {
      userID = user.id;
      sql = `
        SELECT DISTINCT media.medianame, media.areadescription, media.card_rate, media.category_name, 
        media.city_name, media.code, media.foot_fall, media.footfall, media.ftf, media.height, media.width, 
        media.id, media.illumination, media.isBooked, media.latitude, media.longitude, media.location, 
        media.page_title, media.subcategory, media.thumb, media.thumbnail, media.price, media.size, media.state, 
        cart.campaigid, cart.userid, cart.isDelete 
        FROM ${table_name} AS media 
        LEFT JOIN goh_shopping_carts_item AS cart 
        ON media.code = cart.mediaid AND cart.userid = '${userID}' 
        WHERE media.price > 1 AND media.price != 'Ask Price' 
        ORDER BY cart.userid DESC 
        LIMIT ${pagination}
      `;
    } else {
      sql = `
        SELECT DISTINCT medianame, areadescription, card_rate, category_name, city_name, code, foot_fall, footfall, 
        ftf, height, width, id, illumination, isBooked, latitude, longitude, location, page_title, subcategory, 
        thumb, thumbnail, price, size, state 
        FROM ${table_name} 
        WHERE price > 1 AND price != 'Ask Price' 
        LIMIT ${pagination}
      `;
    }

    console.log(`Executing Query for ${countryCode}:`, sql);

    // Fetch data from the correct database based on countryCode
    const dataLimit = await executeQuery(sql, [], countryCode, next);

    if (dataLimit && dataLimit.length > 0) {
      await client.setEx(
        cacheKey,
        process.env.REDIS_TIMEOUT,
        JSON.stringify(dataLimit),
      );
      return res.status(200).json(dataLimit);
    } else {
      return res.status(200).json({ message: "No Data Found" });
    }
  } catch (error) {
    console.error("Error in mediaData API:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

exports.getCityData = catchError(async (req, res, next) => {
  const { city } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const data =
    "thumb,medianame,category_name, page_title,subcategory, price, code";
  const result = await executeQuery(
    "SELECT " +
      data +
      " FROM goh_media WHERE city_name = '" +
      city +
      "' UNION SELECT " +
      data +
      " FROM goh_media_digital WHERE city_name = '" +
      city +
      "' UNION SELECT " +
      data +
      " FROM goh_media_transit WHERE city_name = '" +
      city +
      "' UNION SELECT " +
      data +
      " FROM goh_media_mall WHERE city_name = '" +
      city +
      "' UNION SELECT " +
      data +
      " FROM goh_media_airport WHERE city_name = '" +
      city +
      "'",
    [],
    countryCode,
    next,
  );
  if (result) {
    // client.setEx(key,process.env.REDIS_TIMEOUT,JSON.stringify(result))
    return res.send(result);
  } else {
    return res.send("No Data");
  }
  // }
});
