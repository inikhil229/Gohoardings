const { executeQuery } = require("../server/conn/conn"); // adjust path

async function fetchMedia(filters, countryCode = "IN") {
  let base = `SELECT id, category, medianame, city, area, price, foot_fall, isBooked
              FROM media_master WHERE status = 1`;
  const params = [];

  if (filters.category) { base += " AND category LIKE ?"; params.push('%' + filters.category + '%'); }
  if (filters.city) { base += " AND city LIKE ?"; params.push('%' + filters.city + '%'); }
  if (filters.max_price) { base += " AND price <= ?"; params.push(filters.max_price); }
  if (filters.min_price) { base += " AND price >= ?"; params.push(filters.min_price); }
  if (filters.min_footfall) { base += " AND foot_fall >= ?"; params.push(filters.min_footfall); }
  if (filters.isBooked !== undefined && filters.isBooked !== null) {
    base += " AND isBooked = ?"; 
    params.push(filters.isBooked);
  }

  base += " ORDER BY foot_fall DESC LIMIT 50";

  return await executeQuery(base, params, countryCode);
}
