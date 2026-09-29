// pages/api/chatbot.js
const { executeQuery } = require('../../../server/conn/conn');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, countryCode = 'IN' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Parse user query
    const parsedQuery = parseUserQuery(message.toLowerCase());
    
    // Generate SQL query
    const sqlQuery = generateSQLQuery(parsedQuery);
    
    // Execute query
    const results = await executeQuery(sqlQuery, [], countryCode);
    
    // Format response
    const response = formatResponse(results, parsedQuery);

    return res.status(200).json({
      message: response,
      results: results,
      count: results.length
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    return res.status(500).json({
      error: 'Failed to process query',
      details: error.message
    });
  }
}

function parseUserQuery(query) {
  const parsed = {
    mediaType: [],
    limit: 50
  };

  // Detect media types
  const mediaTypeMap = {
    'hoarding': 'goh_media',
    'billboard': 'goh_media',
    'led': 'goh_media_digital',
    'digital': 'goh_media_digital',
    'screen': 'goh_media_digital',
    'bus': 'goh_media_transit',
    'transit': 'goh_media_transit',
    'mall': 'goh_media_mall',
    'airport': 'goh_media_inflight',
    'metro': 'goh_media_transit',
    'unipole': 'goh_media',
    'gantry': 'goh_media'
  };

  for (const [keyword, table] of Object.entries(mediaTypeMap)) {
    if (query.includes(keyword) && !parsed.mediaType.includes(table)) {
      parsed.mediaType.push(table);
    }
  }

  // Default to all traditional media if none specified
  if (parsed.mediaType.length === 0) {
    parsed.mediaType = ['goh_media', 'goh_media_digital'];
  }

  // Extract city
  const cities = [
    'delhi', 'mumbai', 'bangalore', 'pune', 'hyderabad', 'chennai', 
    'kolkata', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
    'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri',
    'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik',
    'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad',
    'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi', 'howrah',
    'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai',
    'raipur', 'kota', 'chandigarh', 'guwahati', 'noida', 'gurugram'
  ];

  for (const city of cities) {
    if (query.includes(city)) {
      parsed.city = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Extract price range
  const priceMatch = query.match(/under (\d+)|below (\d+)|less than (\d+)|(\d+) or less/);
  if (priceMatch) {
    parsed.maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4]);
  }

  const minPriceMatch = query.match(/above (\d+)|over (\d+)|more than (\d+)|(\d+) or more/);
  if (minPriceMatch) {
    parsed.minPrice = parseInt(minPriceMatch[1] || minPriceMatch[2] || minPriceMatch[3] || minPriceMatch[4]);
  }

  const rangeMatch = query.match(/between (\d+) and (\d+)|(\d+) to (\d+)/);
  if (rangeMatch) {
    parsed.minPrice = parseInt(rangeMatch[1] || rangeMatch[3]);
    parsed.maxPrice = parseInt(rangeMatch[2] || rangeMatch[4]);
  }

  // Extract illumination
  if (query.includes('lit') || query.includes('illuminated') || query.includes('backlit')) {
    parsed.illumination = 'Lit';
  } else if (query.includes('non lit') || query.includes('non-lit') || query.includes('unlit')) {
    parsed.illumination = 'Non Lit';
  }

  // Extract category
  if (query.includes('outdoor') || query.includes('ooh')) {
    parsed.category = 'Outdoor';
  } else if (query.includes('indoor')) {
    parsed.category = 'Indoor';
  }

  return parsed;
}

function generateSQLQuery(parsedQuery) {
  const { mediaType, city, maxPrice, minPrice, illumination, limit } = parsedQuery;

  // Build UNION query for multiple media types
  const queries = mediaType.map(table => {
    let conditions = ["status = 'Active'"];

    if (city) {
      conditions.push(`city_name LIKE '%${city}%'`);
    }

    if (maxPrice) {
      conditions.push(`price <= ${maxPrice}`);
    }

    if (minPrice) {
      conditions.push(`price >= ${minPrice}`);
    }

    if (illumination) {
      conditions.push(`illumination = '${illumination}'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    return `
      SELECT 
        id,
        medianame,
        city_name,
        location,
        price,
        size,
        illumination,
        latitude,
        longitude,
        thumbnail,
        category_name,
        subcategory,
        '${table}' as media_type
      FROM ${table}
      ${whereClause}
    `;
  });

  const unionQuery = queries.join(' UNION ALL ');
  
  return `
    ${unionQuery}
    ORDER BY price ASC
    LIMIT ${limit}
  `;
}

function formatResponse(results, parsedQuery) {
  if (results.length === 0) {
    return `I couldn't find any media matching your criteria. Try adjusting your search parameters like location, price range, or media type.`;
  }

  const { city, maxPrice, minPrice } = parsedQuery;
  
  let response = `I found ${results.length} media options`;
  
  if (city) {
    response += ` in ${city}`;
  }

  if (maxPrice && minPrice) {
    response += ` between ₹${minPrice.toLocaleString()} and ₹${maxPrice.toLocaleString()}`;
  } else if (maxPrice) {
    response += ` under ₹${maxPrice.toLocaleString()}`;
  } else if (minPrice) {
    response += ` above ₹${minPrice.toLocaleString()}`;
  }

  response += `. Here are the top results:\n\n`;

  // Show top 5 results in detail
  results.slice(0, 5).forEach((media, index) => {
    response += `${index + 1}. **${media.medianame}**\n`;
    response += `   📍 ${media.location}, ${media.city_name}\n`;
    response += `   💰 Price: ₹${media.price?.toLocaleString() || 'N/A'}\n`;
    response += `   📐 Size: ${media.size || 'N/A'}\n`;
    response += `   💡 ${media.illumination || 'N/A'}\n\n`;
  });

  if (results.length > 5) {
    response += `... and ${results.length - 5} more options available.`;
  }

  return response;
}