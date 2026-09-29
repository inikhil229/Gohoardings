const fs = require("fs");
const path = require("path");
import { executeQuery } from "@/server/conn/conn";
import catchError from "@/server/middelware/catchError";

export default async function handler(req, res) {
  const method = req.method;
  switch (method) {
    case "GET":
      imagepath(req, res);
      break;
  }
}

export const update = catchError(async (req, res) => {
  try {
    const qry =
      "SELECT id, media_owner_code, thumbnail, thumb FROM goh_media LIMIT 20";
    const data = await executeQuery(qry, "test");

    if (data.length > 0) {
      // Update the URLs in the data array
      const promises = data.map(async (item) => {
        try {
          // Extract image name from thumb and thumbnail URLs
          const thumbImageName = item.thumb.match(/([^/]+)$/)[0];
          const thumbnailImageName = item.thumbnail.match(/([^/]+)$/)[0];

          // Specify the path to the directory you want to read
          const directoryPath = `./${item.media_owner_code}`;

          // Update thumb and thumbnail URLs with image names only
          const updatedThumbnail = `https://odoads.com/media/folder-name/media/${thumbnailImageName}`;
          const updatedThumb = `https://odoads.com/media/folder-name/media/${thumbImageName}`;

          const qry = `UPDATE goh_media SET thumbnail='${updatedThumbnail}', thumb='${updatedThumb}' WHERE id=${item.id}`;
          await executeQuery(qry, "test");

          // Read directory contents
          fs.readdir(directoryPath, async (err, files) => {
            if (err) {
              console.error("Error reading directory:", err);
              return;
            }

            // Filter out only directories00
            const directories = files.filter((file) =>
              fs.statSync(`${directoryPath}/${file}`).isDirectory()
            );

            // Rename directories asynchronously
            await Promise.all(
              directories.map((oldname) => {
                const oldPath = `${directoryPath}/${oldname}`;
                const newPath = `${directoryPath}/${oldname}_new`;
                return new Promise((resolve, reject) => {
                  fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                      console.error("Error renaming folder:", err);
                      reject(err);
                    } else {
                      console.log("Folder renamed successfully.");
                      resolve();
                    }
                  });
                });
              })
            );
          });

          return {
            id: item.id,
            thumbnail: updatedThumbnail,
            thumb: updatedThumb,
          };
        } catch (error) {
          // Handle individual query errors
          console.error("Error updating item:", item.id, error);
          return null; // or handle as needed
        }
      });

      // Wait for all promises to resolve
      const updatedData = await Promise.all(promises);

      return res
        .status(200)
        .json({ success: true, data: updatedData.filter(Boolean) });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "No data to update" });
    }
  } catch (error) {
    // Handle main try-catch errors
    console.error("Internal server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export const foldernameslog = catchError(async (req, res) => {
  const parentDirectory = "../al img folder/";

  // Read the contents of the directory
  fs.readdir(parentDirectory, async (err, files) => {
    if (err) {
      // Handle error if unable to read directory
      console.error('Error reading directory:', err);
      return res.status(500).send('Error reading directory');
    }

    // Filter out only directories
    const directories = files.filter(file => fs.statSync(parentDirectory + file).isDirectory());
    
    // Define an async function to execute the update query
    const updateDirectories = async () => {
      for (const item of directories) {
        const updateQry = `UPDATE all_vendors SET verifyed=1 WHERE code='${item}'`;
        await executeQuery(updateQry, 'test');
      }
    };

    // Call the async function to update directories
    await updateDirectories();

    // Send the directory names as response
    res.status(200).json({ directories });
  });
});

export const  folderrename = catchError(async (req, res) => {
  const oldName = "new_folder";
  const newName = "daynightmedia";
  const parentDirectory = "pages/api/";

  const oldFolderPath = path.join(parentDirectory, oldName);
  const newFolderPath = path.join(parentDirectory, newName);

  fs.rename(oldFolderPath, newFolderPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to rename subfolder" });
    }
    res.json({ message: "Subfolder renamed successfully" });
  });
});

export const codeeset = catchError(async (req, res) => {
  try {
    // SQL query to select distinct media_owner_code from goh_media table
    const selectQry =
      "SELECT DISTINCT mediaownercompanyname FROM goh_media_airport";

    // Execute the SQL query to get unique media_owner_code values
    const data = await executeQuery(selectQry);

    for (const item of data) {
      const { mediaownercompanyname } = item;

      // Convert mediaownercompanyname to lowercase and replace spaces with underscores
      const media_owner_code = mediaownercompanyname
        .toLowerCase()
        .replace(/\s+/g, "_");

      // SQL query to update media_owner_code in goh_media_mall table
      const updateQry = `UPDATE goh_media_airport SET media_owner_code='${media_owner_code}' WHERE mediaownercompanyname='${mediaownercompanyname}'`;
      // Execute the SQL insert query
      await executeQuery(updateQry);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Internal server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export const codeextract = catchError(async (req, res) => {
  try {
    // SQL query to select distinct media_owner_code from goh_media table
    const selectQry = "SELECT DISTINCT media_owner_code FROM goh_media_airport";

    // Execute the SQL query to get unique media_owner_code values
    const data = await executeQuery(selectQry);

    // Loop through the result and check if each media_owner_code already exists in all_vendors table
    for (let i = 0; i < data.length; i++) {
      const { media_owner_code } = data[i];

      if (media_owner_code != null) {
        // SQL query to check if media_owner_code already exists in all_vendors table
        const checkQry = `SELECT * FROM all_vendors WHERE code = '${media_owner_code}'`;

        // Execute the SQL check query
        const existingData = await executeQuery(checkQry, "test");

        // If the media_owner_code doesn't already exist in all_vendors table, insert it
        if (existingData.length === 0) {
          // Dynamic new_code value based on iteration count
          const new_code = `goh_v${i+877}`;

          // SQL query to insert data into all_vendors table with dynamic new_code
          const insertQry = `INSERT INTO all_vendors (code, new_code) VALUES ('${media_owner_code}', '${new_code}')`;

          // Execute the SQL insert query
          await executeQuery(insertQry, "test");
        }
      }
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Internal server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// export const imagepath = catchError(async (req, res) => {
//   try {
//     // SQL query to select distinct media_owner_code from goh_media table
//     const selectQry = "SELECT code,new_code FROM all_vendors WHERE verifyed=1 ";

//     // Execute the SQL query to get unique media_owner_code values
//     const data = await executeQuery(selectQry, "test");
    
//     let updatdata
//     const parentDirectory = "../al img folder/";
//     for (const item of data) {
//       const { code, new_code } = item;

//       const oldFolderPath = path.join(parentDirectory, code);
//       const newFolderPath = path.join(parentDirectory, new_code);

//       //query to update tables from gohoardi_goh

//       const updateQrygoh_media = `UPDATE goh_media SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE	media_owner_code = '${code}' `;
//       await executeQuery(updateQrygoh_media);

//       const updateQrygoh_mediaa = `UPDATE goh_mediaa SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE	media_owner_code = '${code}' `;
//       await executeQuery(updateQrygoh_mediaa);

//       const updateQrygoh_media_airport = `UPDATE goh_media_airport SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE	media_owner_code = '${code}' `;
//       await executeQuery(updateQrygoh_media_airport);

//       const updateQrygoh_media_digital = `UPDATE goh_media_digital SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE	media_owner_code = '${code}' `;
//       await executeQuery(updateQrygoh_media_digital);

//       const updateQrygoh_media_mall = `UPDATE goh_media_mall SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE	media_owner_code = '${code}' `;
//       await executeQuery(updateQrygoh_media_mall);

//       const updateQrygoh_media_transit = `UPDATE goh_media_transit SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE	media_owner_code = '${code}' `;
//       await executeQuery(updateQrygoh_media_transit);

//       fs.rename(oldFolderPath, newFolderPath, (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Failed to rename subfolder" });
//         }
//         res.json({ message: "Subfolder renamed successfully" });
//       });
   
//     }
//     return res.status(200).json({ success: true, updatdata });
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// });


export const imagepath = catchError(async (req, res) => {
  try {
    // SQL query to select distinct media_owner_code from all_vendors table where verifyed=1
    const selectQry = "SELECT code, new_code FROM all_vendors WHERE verifyed=1";

    // Execute the SQL query to get unique media_owner_code values
    const data = await executeQuery(selectQry, "test");
    
    let updateData = [];

    const parentDirectory = "../al img folder/";
    for (const item of data) {
      const { code, new_code } = item;

      try {
        const oldFolderPath = path.join(parentDirectory, code);
        const newFolderPath = path.join(parentDirectory, new_code);

        //query to update tables from goh_media
        const updateQueries = [
          `UPDATE goh_media SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE media_owner_code = '${code}'`,
          `UPDATE goh_mediaa SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE media_owner_code = '${code}'`,
          `UPDATE goh_media_airport SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE media_owner_code = '${code}'`,
          `UPDATE goh_media_digital SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE media_owner_code = '${code}'`,
          `UPDATE goh_media_mall SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE media_owner_code = '${code}'`,
          `UPDATE goh_media_transit SET thumb = REPLACE(thumb, '${code}.','') , thumbnail = REPLACE(thumbnail,'${code}.',''), thumb = REPLACE(thumb, '${code}','${new_code}'), thumbnail = REPLACE(thumbnail,'${code}','${new_code}') WHERE media_owner_code = '${code}'`
        ];

        for (const updateQuery of updateQueries) {
          await executeQuery(updateQuery);
        }

        fs.rename(oldFolderPath, newFolderPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to rename subfolder" });
          }
        });

        // Push the successfully updated code and new_code to updateData
        updateData.push({ code, new_code });
      } catch (error) {
        // Log the error along with the code and new_code values
        console.error("Error processing code:", code, "new_code:", new_code, "Error:", error);
        // You can choose to handle or log the error further if needed
      }
    }
    return res.status(200).json({ success: true, updateData });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});




