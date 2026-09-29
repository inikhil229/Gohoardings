const catchError = require("../middelware/catchError");
const jwtToken = require("jsonwebtoken");
const redis = require("redis");
const { executeQuery } = require("../conn/conn");
const client = redis.createClient();
client.connect();

exports.categorieFilter = catchError(async (req, res, next) => {
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const data = await client.get("category");
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const result = await executeQuery(
      "SELECT p_id,name FROM tblmedia_categories",
      [],
      countryCode
    );
    if (result) {
      client.setEx(
        "category",
        process.env.REDIS_TIMEOUT,
        JSON.stringify(result)
      );
      return res.status(200).json(result);
    }
  }
});

exports.mapFilter = catchError(async (req, res, next) => {
  const { distance, selected, tbl, city } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${distance + selected + tbl + city}`;
  const data = await client.get(key);
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const result = await executeQuery(
      "SELECT  * FROM " +
        tbl +
        " WHERE illumination='" +
        illumna +
        "' || subcategory= '" +
        catego +
        "'  &&  subcategory= '" +
        catego +
        "' &&  illumination='" +
        illumna +
        "'",
      [],
      countryCode
    );
    if (!result) {
      return res.status(206).json({ success: false, message: "No data" });
    } else {
      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(result));
      return res.send(result);
    }
  }
});

exports.locationFilter = catchError(async (req, res) => {
  console.log("inside location filter");
  const { category_name, illumination, table, city, locations } = req.body;
  const SubCategory = category_name.toString();
  const newSubCate = SubCategory.replace(/,/g, "','");
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const illumantios = illumination.toString();
  const newIllumantion = illumantios.replace(/,/g, "','");

  const makeStringfylocation = JSON.stringify(locations);
  const newLocation = makeStringfylocation.substring(
    1,
    makeStringfylocation.length - 1
  );
  switch (table) {
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
  let addsubcategoryQuery = "";
  let addillumantionQuery = "";
  let addlovationQuery = "";
  if (newSubCate) {
    addsubcategoryQuery = "&& subcategory IN ('" + newSubCate + "')";
  }
  if (newIllumantion) {
    addillumantionQuery = "&& illumination IN ('" + newIllumantion + "')";
  }
  if (newLocation) {
    addlovationQuery = "&& location IN (" + newLocation + ")";
  }

  const sql =
    "SELECT * FROM " +
    table_name +
    " WHERE city_name='" +
    city +
    "'  " +
    addsubcategoryQuery +
    " " +
    addillumantionQuery +
    " " +
    addlovationQuery +
    " ";
  const data = await executeQuery(sql, [], countryCode, next);
  if (data) {
    return res.status(200).json(data);
  }
});

exports.iconFilter = catchError(async (req, res, next) => {
  const { datas, tbl, city, minLatitude, maxLatitude, uniqueValues } = req.body;
  const promise = [];
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${
    datas + tbl + city + minLatitude + maxLatitude + uniqueValues
  }`;
  const value = await client.get(key);
  if (value) {
    return res.send(JSON.parse(value));
  } else {
    switch (datas) {
      case "restaurant":
        table_name = "testing_only_restaurants";
        break;
      case "hospital":
        table_name = "testing_only_hospitals";
        break;
      case "bar":
        table_name = "testing_only_bars";
        break;
      case "education":
        table_name = "testing_only_schools";
        break;
      case "hotel":
        table_name = "testing_only_hotels";
        break;
      case "spa":
        table_name = "testing_only_spas";
        break;
      case "cinema":
        table_name = "testing_only_cinemas";
        break;
      case "gym":
        table_name = "testing_only_gyms";
        break;
      case "restaurant":
        table_name = "testing_only_restaurants";
        break;
      case "hospital":
        table_name = "testing_only_hospitals";
        break;
      default:
        table_name = "testing_only_restaurants";
    }
    promise.push(
      new Promise(async (resolve, reject) => {
        const sql = await executeQuery(
          "SELECT * FROM " +
            table_name +
            " WHERE mp_lat IN (" +
            uniqueValues +
            ")",
          [],
          countryCode
        );
        if (!sql) {
          reject(sql);
        } else {
          resolve(sql);
        }
      })
    );

    try {
      const data = await Promise.allSettled(promise);
      let result = [];
      data.forEach((element) => {
        result.push(element.value);
      });

      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(result));
      return res.status(200).json(result);
    } catch (err) {
      return false;
    }
  }
});

//media filters
exports.filterData = catchError(async (req, res, next) => {
  const { category_name, illunation, categorys, city_name } = req.body;
  const SubCategory = categorys.toString();
  const illumantios = illunation.toString();
  const newIllumantion = illumantios.replace(/,/g, "','");
  const newSubCate = SubCategory.replace(/,/g, "','");
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  if (!cookieData) {
    return res.status(204).json({ message: "No Cookie Found" });
  }

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
  let addsubcategoryQuery = "";
  let addillumantionQuery = "";
  let addlovationQuery = "";
  if (newSubCate) {
    addsubcategoryQuery = "&& subcategory IN ('" + newSubCate + "')";
  }
  if (newIllumantion) {
    addillumantionQuery = "&& illumination IN ('" + newIllumantion + "')";
  }

  const result = await executeQuery(
    "SELECT * FROM " +
      table_name +
      " WHERE  city_name='" +
      city_name +
      "' " +
      addsubcategoryQuery +
      " " +
      addillumantionQuery +
      "",
    [],
    countryCode
  );
  if (result) {
    return res.status(200).json(result);
  }
});

exports.mapMarkersData = catchError(async (req, res, next) => {
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const { NorthLat, SouthLat, NorthLong, SouthLong } = req.body;
  const key = `${NorthLat + SouthLat + NorthLong + SouthLong}`;
  const value = await client.get(key);
  if (value) {
    return res.send(JSON.parse(value));
  } else {
    const positions =
      "WHERE  media.latitude BETWEEN  '" +
      SouthLat +
      "' AND  '" +
      NorthLat +
      "' &&  media.longitude BETWEEN  '" +
      SouthLong +
      "'  AND  '" +
      NorthLong +
      "'";
    const data2 =
      "media.id, media.illumination, media.height,media.width,media.ftf,media.code, media.latitude, media.longitude,media.page_title,media.mediaownercompanyname,media.price, media.thumb, media.category_name, media.subcategory, media.medianame, media.price, media.city_name";
    const sql = await executeQuery(
      "SELECT " +
        data2 +
        " FROM goh_media as media " +
        positions +
        " UNION SELECT " +
        data2 +
        " FROM goh_media_digital as media " +
        positions +
        " UNION SELECT " +
        data2 +
        " FROM goh_media_transit as media " +
        positions +
        " UNION SELECT " +
        data2 +
        " FROM goh_media_mall as media " +
        positions +
        " UNION SELECT " +
        data2 +
        " FROM goh_media_airport as media " +
        positions +
        " UNION SELECT " +
        data2 +
        " FROM goh_media_inflight as media " +
        positions +
        " UNION SELECT " +
        data2 +
        " FROM goh_media_office as media " +
        positions +
        "",
      [],
      countryCode
    );
    if (sql) {
      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(sql));
      return res.status(200).json(sql);
    }
  }
});
exports.subcategoryFilter = catchError(async (req, res, next) => {
  const { category_name, subcategory, city } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${countryCode}:${city + category_name + subcategory}`; // Include countryCode in the cache key

  const value = await client.get(key);
  if (value) {
    return res.send(JSON.parse(value));
  } else {
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
      case "inflight_media":
        table_name = "goh_media_inflight";
        break;
      case "lift-branding":
        table_name = "goh_media_office";
        break;
      default:
        table_name = "goh_media";
    }

    let cityData = "";
    if (city) {
      cityData = ` AND city_name='${city}' `;
    }

    // Get the appropriate database pool based on the countryCode
    const sql =
      `SELECT * FROM ${table_name} WHERE subcategory = '${subcategory}' ` +
      cityData;

    try {
      const data = await executeQuery(sql, [], countryCode); // Use executeQuery with countryCode
      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(data)); // Cache data with country-specific key
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
});

exports.LocationFilter = catchError(async (req, res, next) => {
  const { category_name, location, city } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${countryCode}:${city + category_name + location}`; // Include countryCode in the cache key

  const value = await client.get(key);
  if (value) {
    return res.send(JSON.parse(value));
  } else {
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
      case "inflight_media":
        table_name = "goh_media_inflight";
        break;
      case "lift-branding":
        table_name = "goh_media_office";
        break;
      default:
        table_name = "goh_media";
    }

    let cityData = "";
    if (city) {
      cityData = ` AND city_name='${city}' `;
    }

    // Get the appropriate database pool based on the countryCode
    const sql =
      `SELECT * FROM ${table_name} WHERE location = '${location}' ` +
      cityData;

    try {
      const data = await executeQuery(sql, [], countryCode); // Use executeQuery with countryCode
      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(data)); // Cache data with country-specific key
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
});

exports.illuminationfilter = catchError(async (req, res, next) => {
  const { category_name, illumination, city } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India
  const key = `${countryCode}:${city + category_name + illumination}`; // Include countryCode in the cache key

  const value = await client.get(key);
  if (value) {
    return res.send(JSON.parse(value));
  } else {
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
      case "inflight_media":
        table_name = "goh_media_inflight";
        break;
      case "lift-branding":
        table_name = "goh_media_office";
        break;
      default:
        table_name = "goh_media";
    }

    let cityData = "";
    if (city) {
      cityData = ` AND city_name='${city}' `;
    }

    // Get the appropriate database pool based on the countryCode
    const sql =
      `SELECT * FROM ${table_name} WHERE illumination = '${illumination}' ` +
      cityData;

    try {
      const data = await executeQuery(sql, [], countryCode); // Use executeQuery with countryCode
      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(data)); // Cache data with country-specific key
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
});
