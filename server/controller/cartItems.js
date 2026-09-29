const jwtToken = require("jsonwebtoken");
const catchError = require("../middelware/catchError");
const fetch = require("node-fetch");
const { executeQuery } = require("../conn/conn");
const path = require("path");
const { sendEmail } = require("../middelware/sendEmail");
const XLSX = require("xlsx");
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const redis = require("redis");
const client = redis.createClient();
client.connect();
const pptx = new pptxgen();

async function planMail(data, email, next, req) {
  const excelPath = await excel(data, req, next);
  const PPTPath = await powerpoint(data, next);
  const message = `Your Media add on a Campaingn your Campain id is campaign-TEST`;
  await sendEmail({
    email: email,
    subject:
      "Download Plan-Your Campaign Planned with Gohoardings.com is ready",
    message: message,
    attachments: [
      { fileName: "test-1", path: excelPath },
      { fileName: "test-2", path: PPTPath },
    ],
  });
}

exports.ppt = catchError(async (req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Cookies:", req.cookies);

  const { ID } = req.body;
  const countryCode = req.cookies?.selected_country || "IN";

  if (!ID) {
    return res
      .status(400)
      .json({ success: false, message: "Missing campaign ID" });
  }

  try {
    const sql = await executeQuery(
      "SELECT DISTINCT mediaid, userid, mediatype FROM goh_shopping_carts_item WHERE campaigid = ? AND status = 1",
      [ID],
      countryCode,
    );

    if (!sql || sql.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No data found for this campaign" });
    }

    let file = await alldata2(sql, ID, countryCode); // ✅ Pass countryCode here
    if (!file) {
      return res
        .status(500)
        .json({ success: false, message: "File generation failed" });
    }

    const filePath = file;
    const fileName = "plan.pptx";

    try {
      const fileStat = fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Length": fileStat.size,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (err) {
      console.error("File error:", err);
      return res
        .status(500)
        .json({ success: false, message: "File not found or unreadable" });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

const alldata2 = async (data, ID, countryCode) => {
  // ✅ Accept countryCode
  var table_name;
  let promises = [];

  data.map((obj) => {
    try {
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
        new Promise(async (resolve, reject) => {
          try {
            const sql = await executeQuery(
              "SELECT media.id, media.thumb, media.medianame, media.mediaownercompanyname, media.location, media.illumination, media.city_name, media.state, media.area as 'size', media.price, media.pricetype, media.foot_fall, media.subcategory, media.geolocation FROM " +
                table_name +
                " AS media WHERE media.code = ?",
              [obj.mediaid], // ✅ Use parameterized queries to prevent SQL injection
              countryCode,
            );

            if (!sql || sql.length === 0) {
              reject("No media found for media ID: " + obj.mediaid);
            } else {
              resolve(sql);
            }
          } catch (err) {
            reject(err);
          }
        }),
      );
    } catch (err) {
      console.error("Error in processing media data:", err);
    }
  });

  try {
    const data = await Promise.allSettled(promises);
    let result = [];

    data.forEach((element) => {
      if (element.status === "fulfilled") {
        result.push(element.value[0]);
      } else {
        console.error("Promise rejected:", element.reason);
      }
    });

    if (result.length === 0) {
      return null; // ✅ Return null if no data is found
    }

    let file = convertJsonToPPT(result, ID);
    return file;
  } catch (err) {
    console.error("Error in alldata2:", err);
    return null;
  }
};

const excel = (ID, req, next) => {
  const countryCode = req.cookies.selected_country || "IN";

  return new Promise(async (resolve, reject) => {
    if (!ID) {
      reject(new Error("Invalid ID"));
    }
    const result = await executeQuery(
      "SELECT DISTINCT mediaid, userid, mediatype FROM goh_shopping_carts_item WHERE campaigid = " +
        ID +
        " && status=1",
      [],
      countryCode,
    );

    if (!result) {
      reject(result);
    } else {
      let file = await alldata(result, ID);
      if (!file) {
        reject(new Error("Invalid file"));
      }

      resolve(file);
    }
  });
};

exports.excel = catchError(async (req, res, next) => {
  const { ID } = req.body;
  console.log(req.cookies);
  const countryCode = req.cookies.selected_country || "IN";

  if (!ID) {
    return res.status(206).json({ success: false, message: "Try Again" });
  }

  const sql = await executeQuery(
    "SELECT DISTINCT mediaid, userid, mediatype FROM goh_shopping_carts_item WHERE campaigid = ? AND status=1",
    [ID],
    countryCode,
  );

  if (sql) {
    let file = await alldata(req, sql, ID, next); // ✅ Pass req to alldata
    if (!file) {
      return res.status(206).json({ success: false, message: "Try Again" });
    }

    const filePath = file;
    const fileName = "plan.xlsx";
    const fileStat = fs.statSync(filePath);

    res.writeHead(200, {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Length": fileStat.size,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
});

const alldata = async (req, data, ID, next) => {
  // ✅ req is now a parameter
  const arr = data;
  const countryCode = req.cookies.selected_country || "IN";
  var table_name;
  let promises = [];

  arr.map((obj) => {
    try {
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
        new Promise(async (resolve, reject) => {
          const sql = await executeQuery(
            `SELECT media.id, media.medianame as 'Media name', media.location, media.illumination, media.city_name as City, media.state, media.width as 'Width (feet)', media.height as 'Height (feet)', media.widthunit as 'Area in', media.price as Price, media.pricetype as 'Price type', media.ftf as 'Foot Fall', media.subcategory as Category, media.geolocation FROM ${table_name} AS media WHERE media.code = ?`,
            [obj.mediaid],
            countryCode,
          );

          if (!sql || sql.length === 0) {
            return reject("No data found");
          } else {
            return resolve(sql);
          }
        }),
      );
    } catch (err) {
      return { success: false, message: "Database Error" };
    }
  });

  try {
    const data = await Promise.allSettled(promises);
    let result = [];
    data.forEach((element) => {
      if (element.status === "fulfilled") {
        result.push(element.value[0]);
      }
    });

    if (result.length === 0) {
      return { success: false, message: "Data Not Found" };
    }

    const file = convertJsonToExcel(result, ID);
    return file;
  } catch (err) {
    return err;
  }
};

const convertJsonToExcel = async (data, ID) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, "students");
  // Generate buffer
  XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

  // Binary string
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  const dirPath0 = __dirname.replace(/\.next.*/i, "");
  const dirPath1 = path.join(dirPath0, "server");
  const dirPath = dirPath1.replace("\\pages\\api", "");
  const filePath = path.join(dirPath, "excel", `GOH${ID}.xlsx`);
  XLSX.writeFile(workBook, filePath);

  return filePath;
};

const powerpoint = (ID, next) => {
  const countryCode = req.cookies.selected_country || "IN";
  return new Promise(async (resolve, reject) => {
    if (!ID) {
      reject(new Error("Invalid ID"));
    }
    const sql = await executeQuery(
      "SELECT DISTINCT mediaid, userid, mediatype FROM goh_shopping_carts_item WHERE campaigid = " +
        ID +
        " && status=1",
      [],
      countryCode,
    );

    if (!sql) {
      reject(sql);
    } else {
      let file = await alldata2(sql, ID, next);
      if (!file) {
        reject(new Error("Invalid file"));
      }
      resolve(file);
    }
  });
};

const convertJsonToPPT = async (data, ID) => {
  // 1. Create a new Presentation
  let pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";

  // 2. Add a Slide
  let slide1 = pres.addSlide();

  // Image by local URL
  slide1.addImage({
    path: "https://gohoardings.com/images/web_pics/headerppt.jpg",
    w: "100%",
    h: "100%",
  });

  data.forEach((element) => {
    const thumb = element.thumb.startsWith("https")
      ? element.thumb
      : `https://${element.mediaownercompanyname
          .trim()
          .split(" ")
          .slice(0, 2)
          .join("_")
          .toLowerCase()}.odoads.com/media/${element.mediaownercompanyname
          .trim()
          .split(" ")
          .slice(0, 2)
          .join("_")
          .toLowerCase()}/media/images/new${element.thumb}`;

    const slide = (element.code = pres.addSlide());
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.25,
      y: 2.25,
      w: 5.5,
      h: 4.5,
      fill: { color: "FFFFFF" },
      shadow: { type: "outer", angle: 45, blur: 5, offset: 2, color: "808080" },
    });
    slide.addImage({ path: thumb, w: "50%", h: "50%", x: "5%", y: "35%" });

    let textboxText = [
      {
        text: "Site name : " + element.medianame + "",
        options: { fontSize: 20, color: "000000", breakLine: true },
      },
      {
        text: "Media Type : " + element.subcategory + "",
        options: { fontSize: 20, color: "000000", breakLine: true },
      },
    ];
    let textboxText2 = [
      {
        text: "CAMPAIGN DETAILS OF",
        options: { fontSize: 24, color: "000000", breakLine: true, bold: true },
      },
    ];
    let textboxText3 = [
      {
        text: "SITE",
        options: { fontSize: 24, color: "000000", breakLine: true, bold: true },
      },
    ];
    let textboxText4 = [
      {
        text: "Name : " + element.medianame + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "Media Type : " + element.subcategory + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "City : " + element.city_name + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "Location : " + element.location + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "GEO Location : " + element.geolocation + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "Size : " + element.size + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "Illumination : " + element.illumination + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "Price : " + element.price + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
      {
        text: "Foot fall : " + element.foot_fall + "",
        options: { fontSize: 15, color: "000000", breakLine: true },
      },
    ];
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: "0%",
      y: "0%",
      w: "100%",
      h: "20%",
      fill: { color: "FFFF00" },
      line: { type: "none" },
    });
    slide.addText(textboxText, {
      w: "100%",
      h: "20%",
      x: "3%",
      y: "0%",
      fontSize: 24,
    });
    slide.addText(textboxText2, {
      w: "35%",
      h: "20%",
      x: "62%",
      y: "-2%",
      fontSize: 24,
    });
    slide.addText(textboxText3, {
      w: "20%",
      h: "20%",
      x: "75%",
      y: "3%",
      fontSize: 24,
    });
    slide.addText(textboxText4, {
      w: "35%",
      h: "20%",
      x: "65%",
      y: "28%",
      fontSize: 16,
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: "60%",
      y: "10%",
      w: "0.2%",
      h: "80%",
      fill: { color: "000000" },
      line: { type: "none" },
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: "62%",
      y: "20%",
      w: "1.5%",
      h: "35%",
      fill: { color: "FFFF00" },
      line: { type: "none" },
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: "65%",
      y: "80%",
      w: "30%",
      h: "2%",
      fill: { color: "000000" },
      line: { type: "none" },
    });
    slide.addImage({
      path: "https://gohoardings.com/images/web_pics/logo.png",
      w: "20%",
      h: "5%",
      x: "70%",
      y: "85%",
    });
  });

  let slide3 = pres.addSlide();
  slide3.addImage({
    path: "https://gohoardings.com/images/web_pics/footerppt.jpg",
    w: "100%",
    h: "100%",
  });

  // path of file to create and name
  const dirPath0 = __dirname.replace(/\.next.*/i, "");
  const dirPath1 = path.join(dirPath0, "server");
  const dirPath = dirPath1.replace("\\pages\\api", "");
  var filePath = path.join(dirPath, "ppt", `GOH${ID}.pptx`);

  // 4. Save the Presentation
  try {
    await pres.writeFile(filePath);
    return filePath;
  } catch (error) {
    return "Error in creating PPT";
  }
};

exports.addOnCart = catchError(async (req, res, next) => {
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  if (!cookieData) {
    return res.status(206).json({ success: false, message: "No Cookie Found" });
  }
  const token = cookieData.gohoardings;
  return jwtToken.verify(
    token,
    "thisismysecretejsonWebToken",
    async (err, user) => {
      if (err || !token) {
        return res.status(206).json({ success: false, message: "Login First" });
      } else {
        const userid = user.id;
        const { code, category_name, page_title, illumination, subcategory } =
          req.body.media;
        const checkData = await executeQuery(
          "SELECT * From goh_shopping_carts_item WHERE userid='" +
            userid +
            "'&& mediaid = '" +
            code +
            "' && campaigid='" +
            userid +
            "' && mediatype='" +
            category_name +
            "' && isDelete=0 ",
          [],
          countryCode,
        );
        if (checkData.length == 0) {
          const result = await executeQuery(
            "INSERT INTO goh_shopping_carts_item (userid, mediaid, campaigid, mediatype, status, page_title , illumination, subcategory ) VALUES ('" +
              userid +
              "','" +
              code +
              "','" +
              userid +
              "','" +
              category_name +
              "',0,'" +
              page_title +
              "','" +
              illumination +
              "','" +
              subcategory +
              "')",
            [],
            countryCode,
          );
          if (result) {
            return res.status(200).json({
              success: true,
              message: "This Media added successfully ",
            });
          }
        } else {
          return res.status(200).json({
            success: true,
            message: "This Media you already selected ",
          });
        }
      }
    },
  );
});

exports.campaineId = catchError(async (req, res, next) => {
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  const result = await executeQuery(
    "SELECT MAX(campaigid) as campaigid FROM goh_shopping_carts_item",
    [],
    countryCode,
  );
  if (result) {
    campaign_id = result[0].campaigid + 1;
    next();
  }
});

exports.editCart = catchError(async (req, res, next) => {
  const { campingid, campaingn } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  const userId = req.id;
  let promises = [];
  if (!userId) {
    return res.status(404).json({ message: "Token Valid" });
  } else {
    const data = await executeQuery(
      "SELECT * FROM tblcontacts WHERE userid='" + userId + "'",
      [],
      "CRM",
    );
    if (data) {
      campaingn.map((el) => {
        promises.push(
          new Promise(async (resolve, reject) => {
            const sql = await executeQuery(
              `UPDATE goh_campaign SET status=0 WHERE campaign_name LIKE '%` +
                campingid +
                `'`,
              [],
              countryCode,
            );
            if (!sql) {
              return reject(sql);
            } else {
              const value = await executeQuery(
                "UPDATE goh_shopping_carts_item SET isDelete=0,status=0 WHERE userid=" +
                  userId +
                  " && campaigid='" +
                  campingid +
                  "'",
                [],
                countryCode,
              );

              if (!value) {
                return reject(value);
              } else {
                return resolve(value);
              }
            }
          }),
        );
      });
      try {
        const data = await Promise.all(promises);
        return res.status(200).json({ success: true, message: "EDIT CART" });
      } catch (err) {
        return res.status(400).json({ success: false, message: "Try Later" });
      }
    }
  }
});

exports.processdCart = catchError(async (req, res, next) => {
  console.log("inside processdCart function");
  var { products, campainName } = req.body;
  const newCampain = campainName.replace(/ /g, "_");
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  const userId = req.id;
  const campaign_name = campaign_id;
  let promises = [];
  if (!userId) {
    return res.status(404).json({ message: "Token Valid" });
  } else {
    const result = await executeQuery(
      "SELECT * FROM tblcontacts WHERE userid='" + userId + "'",
      [],
      "CRM",
    );
    const phone = result[0].phonenumber;
    const userEmail = result[0].email;

    products.map((el) => {
      promises.push(
        new Promise(async (resolve, reject) => {
          const sql = await executeQuery(
            "INSERT into goh_campaign (user, phone, campaign_name, start_date, end_date, campaign_city, media_type, address, city, created_by, code) VALUES (" +
              userId +
              ",'" +
              phone +
              "', '" +
              newCampain +
              "-" +
              campaign_name +
              "','" +
              el.start_date.slice(0, 10) +
              "','" +
              el.end_date.slice(0, 10) +
              "','" +
              el.medianame +
              "','" +
              el.category_name +
              "','" +
              el.address +
              "','" +
              el.city_name +
              "','user','" +
              el.code +
              "')",
            [],
            countryCode,
          );

          if (!sql) {
            return reject(sql);
          } else {
            const data = await executeQuery(
              "UPDATE goh_shopping_carts_item SET isDelete=1,status=1, campaigid = " +
                campaign_id +
                " WHERE userid=" +
                userId +
                " && mediaid='" +
                el.code +
                "'",
              [],
              countryCode,
            );
            if (!data) {
              return reject(data);
            } else {
              return resolve(data);
            }
          }
        }),
      );
    });

    try {
      const data = await Promise.all(promises);
      // await sendEmail({email: "bussduro@gmail.com", subject: "Gohoadings Solutions : India's Largest Outdoor Advertising Company", message: "message" });
      planMail(campaign_name, userEmail, next, req);
      return res.status(200).json({
        success: true,
        message:
          "Please check your email for the details report and we will be in touch shortly",
        result: data,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: "Try Later" });
    }
  }
});

exports.deleteFromCart = catchError(async (req, res, next) => {
  const userid = req.id;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  const { code } = req.body;
  const key = `${userid}+user`;
  const data = await client.get(code);
  if (data) {
    return res.send(JSON.parse(data));
  } else {
    const result = await executeQuery(
      "UPDATE goh_shopping_carts_item SET isDelete=1 WHERE userid='" +
        userid +
        "' && mediaid='" +
        code +
        "'",
      [],
      countryCode,
    );
    if (result) {
      client.setEx(key, process.env.REDIS_TIMEOUT, JSON.stringify(result));
      return res.status(200).json({ success: true, message: "Done" });
    }
  }
});

exports.useritems = catchError(async (req, res, next) => {
  const user = req.id;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  const result = await executeQuery(
    `SELECT COUNT(userid) AS item FROM goh_shopping_carts_item WHERE userid = ${user} && isDelete=0`,
    [],
    countryCode,
  );
  if (result) {
    return res.status(200).json(result);
  }
});

exports.getUserCartItem = catchError(async (req, res, next) => {
  const user = req.id;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  const result = await executeQuery(
    `SELECT * FROM goh_shopping_carts_item WHERE userid = ${user} && isDelete= 0 `,
    [],
    countryCode,
  );
  if (result) {
    req.data = result;
    next();
  }
});

exports.cartiemfromdb = catchError(async (req, res, next) => {
  const arr = req.data;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN";
  var table_name;
  let promises = [];
  arr.map((obj) => {
    try {
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
        new Promise(async (resolve, reject) => {
          const result = await executeQuery(
            "SELECT media.*,cart.isDelete FROM  " +
              table_name +
              " AS media INNER JOIN goh_shopping_carts_item AS cart ON media.code='" +
              obj.mediaid +
              "' && cart.isDelete = 0  WHERE cart.userid = '" +
              obj.userid +
              "'",
            [],
            countryCode,
          );
          if (!result) {
            reject(result);
          } else {
            resolve(result);
          }
        }),
      );
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Database Error" });
    }
  });
  try {
    const data = await Promise.allSettled(promises);
    let result = [];
    data.forEach((element) => {
      result.push(element.value[0]);
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ success: false, message: "Database Error" });
  }
});
