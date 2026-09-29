const { executeQuery } = require("../conn/conn");
const jwtToken = require("jsonwebtoken");
const catchError = require("../middelware/catchError");
const ErrorHandle = require("../utils/Errorhandler");
const { sendEmail } = require("../middelware/sendEmail");
const { counters } = require("sharp");

// exports.message = catchError(async (req, res, next) => {
//   const { name, email, phone, message } = req.body;
//   const row =  await executeQuery('SELECT id,assigned FROM tblleads WHERE source = 3 order by id desc limit 0,1',[],"CRM",next)
//   const lastAssigned = row[0].assigned;

//   let assign;

//   if (lastAssigned == 7) {
//     assign = 40;
//   } else if (lastAssigned == 40) {
//     assign = 46;
//   } else if (lastAssigned == 46) {
//     assign = 40;
//   } else {
//     assign = 40;
//   }
//   const country = "IN"; // Or get this from req.body or elsewhere

//   const query = `
//     INSERT INTO tblleads
//     SET name='${name}', addedfrom=0, phonenumber='${phone}',
//         description='${message}', email='${email}', source=3,
//         status=2, assigned='${assign}', country='${country}',
//         dateadded=NOW(), dateassigned=NOW()
//   `;

//   // await sendEmail({email: "deepti@gohoardings.com", subject: "website lead", message: "Lead : - "+name+" with email : "+email+" and contact number : "+phone+". contacted you with message :- "+message+". Thank you have a great day."});
//   // await sendEmail({email: "vikas@gohoardings.com", subject: "website lead", message: "Lead : - "+name+" with email : "+email+" and contact number : "+phone+". contacted you with message :- "+message+". Thank you have a great day."});
//   await sendEmail({email: "design@goadvertising.in", subject: "website lead", message: "Lead : - "+name+" with email : "+email+" and contact number : "+phone+". contacted you with message :- "+message+". Thank you have a great day."});
//   // await sendEmail({email: "Deepali@gohoardings.com", subject: "website lead", message: "Lead : - "+name+" with email : "+email+" and contact number : "+phone+". contacted you with message :- "+message+". Thank you have a great day."});
//   const sql = await executeQuery(query,[],"CRM",next);
//   if (sql) {
//     return res
//       .status(200)
//       .json({ success: true, message: "Thanks, we will contact you soon!" });
//   }
// });

exports.message = catchError(async (req, res, next) => {
  const {
    name = "unknown",
    email = "unknown",
    phone = "not provided",
    message: userMessage = "not provided",
  } = req.body;

  // Get the last assigned value
  const row = await executeQuery(
    "SELECT id, assigned FROM tblleads WHERE source = 3 ORDER BY id DESC LIMIT 1",
    [],
    "CRM",
    next
  );

  const lastAssigned = row[0]?.assigned;
  let assign;

  // Rotate assignment
  if (lastAssigned == 7) assign = 40;
  else if (lastAssigned == 40) assign = 46;
  else if (lastAssigned == 46) assign = 40;
  else assign = 40;

  const country = "IN";

  // Use parameterized query for security
  const insertQuery = `
    INSERT INTO tblleads 
    SET name = ?, addedfrom = 0, phonenumber = ?, 
        description = ?, email = ?, source = 3, 
        status = 2, assigned = ?, country = ?, 
        dateadded = NOW(), dateassigned = NOW()
  `;

  const values = [name, phone, userMessage, email, assign, country];
  const sql = await executeQuery(insertQuery, values, "CRM", next);

  // Email content - cleaner formatting
  const emailMessage = `
   Hi Team,

   You have a new lead from Go Hoardings:

   Name: ${name},
   Email: ${email},
   Phone: ${phone},
   Message: ${userMessage}

   Regards,  
   Go Hoardings
   `.trim();

  const emailHTML = `
  <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
    <h2 style="color: #2a6ebb;">New Lead from Gohoardings.com </h2>
    <p><strong>Name:</strong> ${name || "Not provided"}</p>
    <p><strong>Email:</strong> ${email || "Not provided"}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p><strong>Message:</strong> ${userMessage || "Not provided"}</p>
    <hr />
    <p style="font-size: 12px;">This lead was submitted from the <strong>Go Hoardings</strong> website.</p>
  </div>
`;
  // Send the email
  await sendEmail({
    email: "abhishek@gohoardings.com",
    // bcc: "vikas@gohoardings.com, aman@gohoardings.com, abhishek@gohoardings.com",
    subject: "New Website Lead",
    message: emailMessage,
    html: emailHTML,
  });

  if (sql) {
    return res.status(200).json({
      success: true,
      message: "Thanks, we will contact you soon!",
    });
  }
});

exports.review = catchError(async (req, res, next) => {
  const { feedback, rating, ip } = req.body;
  const countryCode = req.cookies.countryCode || "IN";
  const result = await executeQuery(
    "SELECT * from goh_review WHERE ip_address = '" + ip + "'",
    [],
    countryCode,
    next
  );
  if (result.length == 0) {
    const cookieData = req.cookies;
    if (!cookieData) {
      return res.status(206).json({ message: "No Cookie Found" });
    }
    const token = cookieData.gohoardings;
    let sql;
    return jwtToken.verify(
      token,
      "thisismysecretejsonWebToken",
      async (err, user) => {
        if (err) {
          sql =
            "INSERT into goh_review (uid, Comments, rate, ip_address, source) VALUES ( 'unknown', '" +
            feedback +
            "'," +
            rating +
            ",'" +
            ip +
            "','gohoardings')";
        } else {
          const userID = user.id;
          sql =
            "INSERT into goh_review (uid, Comments, rate, ip_address, source) VALUES (" +
            userID +
            ", '" +
            feedback +
            "','" +
            rating +
            "','" +
            ip +
            "', 'gohoardings')";
        }

        const data = await executeQuery(sql, [], countryCode, next);
        if (data) {
          return res.status(200).json({
            success: true,
            message: "Thanks, we will contact you soon!",
          });
        }
      }
    );
  } else {
    return res
      .status(200)
      .json({ success: false, message: "Profile Already Exists" });
  }
});

exports.getReview = catchError(async (req, res, next) => {
  const countryCode = req.cookies.countryCode || "IN";
  const result = await executeQuery(
    "SELECT DISTINCT ip_address from goh_review",
    [],
    countryCode,
    next
  );
  if (result) {
    return res.status(200).json(result);
  }
});

exports.brangLogo = catchError(async (req, res, next) => {
  const countryCode = req.cookies.countryCode || "IN";
  const result = await executeQuery(
    "SELECT * from goh_client_logos",
    [],
    countryCode,
    next
  );
  if (result) {
    return res.status(200).json(result);
  }
});
