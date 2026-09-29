const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const request = require("request");
const { executeQuery } = require("../conn/conn");
const jwtToken = require("jsonwebtoken");
const catchError = require("../middelware/catchError");
const { token } = require("../middelware/token");

exports.register = catchError(async (req, res, next) => {
  console.log("inside register")
  if (!req.body) {
    return res.status(206).json({ success: false, message: "User data Null" });
  }
  const { email, phone } = req.body;
  console.log("this is the data",email,phone)
  const data = await executeQuery(
    "SELECT email FROM tblcontacts WHERE email='" +
      email +
      "' ||  phonenumber=" +
      phone +
      "",
    [],
    "CRM",
    next,
  );
  if (data.length == []) {
     console.log("inside if length is 0")
    const user = await executeQuery(
      "SELECT userid  FROM  tblcontacts ORDER BY userid DESC LIMIT 1",
      [],
      "CRM",
      next,
    );
    console.log("after if block")
    const userid = user[0].userid + 1;
    let otp = Math.floor(100000 + Math.random() * 900000);
    console.log("this is the otp ",otp)
    request(
      {
        url: "https://api.msg91.com/api/sendhttp.php",
        method: "POST",
        form: {
          authkey: "280862A8xB5Zeo9OK45d020be9",
          mobiles: phone,
          message: `${otp} is your one-time OTP for login into the Gohoardings account.`,
          sender: "GOHOOH",
          route: "4",
          DLT_TE_ID: "1307165770131175060",
        },
      },
      async function (error, response, body) {
        if (error) {
          console.log("inside error ,some error")
          res.status(400).json({ message: error.message });
        } else {
          const hello = await executeQuery(
            "INSERT INTO  tblcontacts (phone_otp,userid) VALUES  (" +
              otp +
              "," +
              userid +
              ")",
            [],
            "CRM",
            next,
          );
          if (hello) {
            console.log("inside if block of hello")
            const sql =
              "Insert into tblclients (userid) values (" + userid + ")";
            await executeQuery(sql, [], "CRM", next);
            console.log("return res and otp is already sent ")
            return res.status(200).json({
              success: true,
              message: "your otp sent on your mobile number",
            });
          }
        }
      },
    );
  } else {
    console.log("inside else , profile already exist")
    return res.status(206).json({
      success: false,
      message: "Profile Already Exists",
    });
  }
});

exports.registerLogin = catchError(async (req, res, next) => {
  const { name, email, phone, password: Npassword, otp } = req.body;
  const password = bcrypt.hashSync(Npassword, 8);
  const data = await executeQuery(
    "UPDATE tblcontacts SET firstname = '" +
      name +
      "', email='" +
      email +
      "', phonenumber=" +
      phone +
      ", password='" +
      password +
      "'  WHERE phone_otp = " +
      otp +
      " ",
    [],
    "CRM",
    next,
  );
  if (data) {
    const sql = "SELECT userid FROM tblcontacts WHERE phone_otp = " + otp + " ";
    const user = await executeQuery(sql, [], "CRM", next);
    if (user.length == 0) {
      return res.status(206).json({ success: false, message: "Otp Invalid" });
    } else {
      const userid = user[0].userid;
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("gohoardings", { expires: Date.now() }),
      );
      token(userid, 200, res);
    }
  }
});

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  const cookieData = req.cookies;
  const countryCode = cookieData.selected_country || "IN"; // Default to India

  const data = await executeQuery(
    "SELECT * FROM tblcontacts WHERE email ='" + email + "' ",
    [],
    "CRM",
    next,
  );
  if (!data.length == 0) {
    const keypassword = data[0].password;
    if (!keypassword) {
      return res
        .status(206)
        .json({ success: false, message: "Invalid Email and password" });
    } else {
      const confimPassword = bcrypt.compareSync(password, keypassword);
      if (!confimPassword) {
        return res.status(206).json({
          success: false,
          message: "Wrong Email & Password",
        });
      }

      const userid = data[0].userid;
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("gohoardings", { expires: Date.now() }),
      );
      token(userid, 200, res);
    }
  } else {
    return res
      .status(206)
      .json({ success: false, message: "Invalid Email and password" });
  }
});

exports.googleLogin = catchError(async (req, res, next) => {
  const { name, email, givenName, imageUrl } = req.body;
  const selectResult = await executeQuery(
    "SELECT * FROM tblcontacts WHERE email='" + email + "'",
    [],
    "CRM",
    next,
  );
  if (selectResult.length == 0) {
    const result = await executeQuery(
      "SELECT userid From tblcontacts ORDER By userid DESC LIMIT 1",
      [],
      "CRM",
      next,
    );
    const userid = JSON.stringify(result[0].userid + 1);
    const password = bcrypt.hashSync(userid, 8);

    const data = await executeQuery(
      "Insert into tblcontacts (firstname, email, password, userid, profile_image, provider, phonenumber) VALUES ('" +
        name +
        "','" +
        email +
        "','" +
        password +
        "'," +
        userid +
        ",'" +
        imageUrl +
        "','Google', 00000)",
      [],
      "CRM",
      next,
    );
    if (data) {
      const sql = "Insert into tblclients (userid) values (" + userid + ")";
      await executeQuery(sql, [], "CRM", next);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("gohoardings", { expires: Date.now() }),
      );
      token(userid, 200, res);
    }
  } else {
    const userid = selectResult[0].userid;

    token(userid, 200, res);
  }
});

exports.linkdinLogin = catchError(async (req, res, next) => {
  const { session } = req.body;
  if (!session) {
    return res.status(204).json({ message: "user undefined" });
  }

  const { email, name, image } = session.user;
  const selectResult = await executeQuery(
    "SELECT * FROM tblcontacts WHERE email='" + email + "'",
    [],
    "CRM",
    next,
  );
  if (selectResult.length == 0) {
    const result = await executeQuery(
      "SELECT userid From tblcontacts ORDER By userid DESC LIMIT 1",
      [],
      "CRM",
      next,
    );
    if (result) {
      const userid = JSON.stringify(result[0].userid + 1);
      const password = bcrypt.hashSync(userid, 8);

      const userData = await executeQuery(
        `Insert into tblcontacts (firstname, email, password, userid, profile_image, provider) VALUES ('${name}','${email}','${password}','${userid}','${image}','linkdin')`,
        [],
        "CRM",
        next,
      );
      if (userData) {
        const sql = await executeQuery(
          "Insert into tblclients (userid) values (" + userid + ")",
          [],
          "CRM",
          next,
        );
        if (sql) {
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("gohoardings", { expires: Date.now() }),
          );
          token(userid, 200, res);
        }
      }
    }
  } else {
    const userid = selectResult[0].userid;
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("gohoardings", { expires: Date.now() }),
    );
    token(userid, 200, res);
  }
});

exports.getuser = catchError(async (req, res, next) => {
  const userId = req.id;

  if (!userId) {
    return res.status(404).json({ message: "Token Valid" });
  } else {
    const data = await executeQuery(
      "SELECT userid,firstname, email, phonenumber,profile_image, provider  FROM tblcontacts WHERE userid='" +
        userId +
        "'",
      [],
      "CRM",
      next,
    );
    if (!data) {
      return res
        .status(206)
        .json({ success: false, message: "User Not found" });
    } else {
      return res.status(200).json(data);
    }
  }
});

exports.logout = catchError(async (req, res) => {
  const userid = req.id;
  if (!userid) {
    return res
      .status(206)
      .json({ success: false, message: "No user found Plese Login Again" });
  }
  const option = {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    httpOnly: false,
    sameSite: "strict",
  };
  return res
    .status(200)
    .setHeader(
      "Set-Cookie",
      cookie.serialize("gohoardings", "thisismysecretejsonWebToken", option),
    )
    .json({
      success: true,
      message: "User Logout SuccessFully",
    });
});

exports.companyDetails = catchError(async (req, res, next) => {
  const {
    company,
    city,
    phone,
    address,
    website,
    state,
    zip_code,
    pan,
    gstin,
  } = req.body;
  const userId = req.id;
  let sql;
  if (!pan) {
    sql = await executeQuery(
      "UPDATE  tblclients SET  company='" +
        company +
        "', phonenumber='" +
        phone +
        "', city='" +
        city +
        "', zip='" +
        zip_code +
        "',state='" +
        state +
        "', address='" +
        address +
        "', website='" +
        website +
        "',  gstin='" +
        gstin +
        "' WHERE userid=" +
        userId +
        " ",
      [],
      "CRM",
      next,
    );
  } else {
    sql = await executeQuery(
      "UPDATE  tblclients SET  company='" +
        company +
        "', phonenumber='" +
        phone +
        "', city='" +
        city +
        "', zip='" +
        zip_code +
        "',state='" +
        state +
        "', address='" +
        address +
        "', website='" +
        website +
        "', pan='" +
        pan +
        "', gstin='" +
        gstin +
        "' WHERE userid=" +
        userId +
        " ",
      [],
      "CRM",
      next,
    );
  }
  if (!sql) {
    return res.status(206).json({ sucess: false, message: "Updation failed" });
  } else {
    return res
      .status(200)
      .json({ sucess: true, message: "Company Data Updated" });
  }
});

exports.resetPasswordEmail = catchError(async (req, res, next) => {
  const { code } = req.query;
  const cookieData = req.cookies;
  if (!cookieData) {
    return res.status(400).json({ message: "No Cookie Found" });
  }
  const token = cookieData.gohoardings;
  if (!token) {
    return res.status(400).json({ message: "No Token Found" });
  } else {
    if (token === code) {
      return jwtToken.verify(
        token,
        "thisismysecretejsonWebToken",
        async (err, user) => {
          if (err) {
            return res.status(400).json({ message: "InValid Token" });
          } else {
            const userId = user.id;
            const { password, confirmPassword } = req.body;
            if (password == confirmPassword) {
              const finalPassword = bcrypt.hashSync(password, 8);
              const sql = await executeQuery(
                "UPDATE tblcontacts SET password ='" +
                  finalPassword +
                  "' WHERE id='" +
                  userId +
                  "'",
                [],
                "CRM",
                next,
              );
              if (sql) {
                return res.status(200).json({ message: result });
              }
            } else {
              return res
                .status(206)
                .json({ success: false, message: "Password not matched" });
            }
          }
        },
      );
    } else {
      return res
        .status(206)
        .json({ success: false, message: "Verfication failed" });
    }
  }
});

exports.updateProfile = catchError(async (req, res, next) => {
  const { firstname, phonenumber, newPassword, confirmPassword } = req.body;
  const userId = req.id;
  if (!userId) {
    return res.status(404).json({ message: "Token Valid" });
  } else {
    let changePassword = "";
    if (newPassword == confirmPassword) {
      const finalPassword = bcrypt.hashSync(confirmPassword, 8);
      changePassword = ", password = '" + finalPassword + "'";
    } else {
      return res
        .status(206)
        .json({ success: false, message: "Your Password Not Matched" });
    }
    let sql = await executeQuery(
      "UPDATE tblcontacts SET firstname='" +
        firstname +
        "', phonenumber=" +
        phonenumber +
        " " +
        changePassword +
        " WHERE userid=" +
        userId +
        "",
      [],
      "CRM",
      next,
    );
    if (sql) {
      return res.status(200).json({ sucess: true, message: "Profile Updated" });
    }
  }
});

exports.updateImage = catchError(async (req, res, next) => {
  const { filename } = req.file;
  const userId = req.id;
  let sql;
  if (filename) {
    const image = `http://${req.headers.host}/images/profile_image/${filename}`;
    sql = await executeQuery(
      "UPDATE tblcontacts SET  profile_image='" +
        image +
        "' WHERE userid=" +
        userId +
        "",
      [],
      "CRM",
      next,
    );
    if (sql) {
      return res.status(200).json({ sucess: true, message: " Updated" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Please select an image" });
    }
  } else {
    return res
      .status(204)
      .json({ success: false, message: "Please Select Image" });
  }
});
