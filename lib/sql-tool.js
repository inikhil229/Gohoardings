// lib/sql-tool.js
const { DynamicTool } = require("@langchain/core/tools");
const { executeQuery } = require("../server/conn/conn");

// Database schema knowledge
const SCHEMA_INFO = {
  tables: {
    'goh_media': 'Billboards/Outdoor media',
    'goh_media_digital': 'Digital media screens(LEDs)',
    'goh_media_mall': 'Mall advertising spaces',
    'goh_media_inflight': 'In-flight media',
    'goh_media_airport': 'Airport advertising',
    'goh_media_transit': 'Transit media (buses, trains, etc.)'
  },
  commonFields: {
    // Identification
    'id': 'Primary key identifier',
    'medianame': 'Name of the media unit',
    'code': 'Unique code for the media',
    
    // Location
    'city': 'City name ',
    'city_name': 'Full city name (use for filtering)',
    'state': 'State name',
    'district': 'District name',
    'city_area': 'Specific area within city',
    'location': 'General location description',
    'address': 'Full address',
    
    // Pricing
    'price': 'Current price',
    'price_2': 'Alternative price',
    'card_rate': 'Standard rate card price',
    'pricetype': 'Type of pricing',
    
    // Specifications
    'size': 'Overall size description',
    'width': 'Width measurement',
    'height': 'Height measurement',
    'widthunit': 'Unit for width',
    'heightunit': 'Unit for height',
    
    // Status & Availability
    'status': 'Current status',
    'isBooked': 'Booking status (0/1)',
    
    // Media Owner
    'mediaownercompanyname': 'Media owner company name',
    'mediacompanyname': 'Media company name',
    'mediaownername': 'Contact person name'
  }
};

// Safety validation function
function isSafeSQL(sql) {
  const dangerousKeywords = ['insert', 'update', 'delete', 'drop', 'alter', 'create', 'grant', 'revoke', 'truncate', 'exec', 'execute', 'shutdown'];
  const sqlLower = sql.toLowerCase();
  
  // Check for dangerous operations
  for (const keyword of dangerousKeywords) {
    if (new RegExp(`\\b${keyword}\\b`).test(sqlLower)) {
      return false;
    }
  }
  
  // Ensure it's a SELECT query
  if (!sqlLower.trim().startsWith('select')) {
    return false;
  }
  
  // Prevent potentially dangerous patterns
  const dangerousPatterns = [
    /information_schema/i,
    /sys\./i,
    /mysql\./i,
    /pg_/i,
    /--/,
    /\/\*/,
    /union.*select/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sqlLower)) {
      return false;
    }
  }
  
  return true;
}

// Add LIMIT if not present
function addLimitToQuery(sql) {
  const sqlLower = sql.toLowerCase();
  if (!sqlLower.includes('limit') && !sqlLower.includes('fetch next')) {
    // Check if there's already a WHERE clause or other conditions
    if (sqlLower.includes('where')) {
      return sql.replace(/;?$/, ' LIMIT 10');
    } else {
      return sql.replace(/;?$/, ' LIMIT 10');
    }
  }
  return sql;
}

// Validate table name against known schema
function isValidTable(tableName) {
  const validTables = Object.keys(SCHEMA_INFO.tables);
  return validTables.includes(tableName.toLowerCase());
}

// Smart query formatting
function formatSQLQuery(sql) {
  let formattedSQL = sql.trim();
  
  // Remove JSON markers if present
  formattedSQL = formattedSQL.replace(/^```json|```$/g, '').trim();
  formattedSQL = formattedSQL.replace(/^```sql|```$/g, '').trim();
  
  // Ensure proper termination
  if (!formattedSQL.endsWith(';')) {
    formattedSQL += ';';
  }
  
  return formattedSQL;
}

const queryDbTool = new DynamicTool({
  name: "query-mysql",
  description: `Executes SQL against Gohoardings DB. 
    Available tables: ${Object.entries(SCHEMA_INFO.tables).map(([k, v]) => `${k} (${v})`).join(', ')}
    
    Common fields: id, medianame, code, city_name, price, status, location, size, mediaownercompanyname
    
    Always use appropriate table based on media type.
    Return only top 10 rows unless specifically asked for more.
    
    Input format: Raw SQL query string or JSON with {sql: "query", countryCode: "IN"}`,
  
  func: async (input) => {
    try {
      let sqlQuery;
      let countryCode = "IN";
      
      console.log("Tool received input:", input);
      
      // Parse input - handle both JSON and raw SQL
      try {
        const parsedInput = JSON.parse(input);
        if (parsedInput.sql) {
          sqlQuery = parsedInput.sql;
          countryCode = parsedInput.countryCode || "IN";
        } else {
          sqlQuery = input;
        }
      } catch (e) {
        sqlQuery = input;
      }
      
      // Format the SQL query
      sqlQuery = formatSQLQuery(sqlQuery);
      
      // Safety validation
      if (!isSafeSQL(sqlQuery)) {
        return "Error: Query contains unsafe operations. Only SELECT queries are allowed with approved syntax.";
      }
      
      // Validate table name in query (basic check)
      const tableMatch = sqlQuery.match(/from\s+(\w+)/i);
      if (tableMatch && !isValidTable(tableMatch[1])) {
        return `Error: Table '${tableMatch[1]}' is not a valid table. Available tables: ${Object.keys(SCHEMA_INFO.tables).join(', ')}`;
      }
      
      // Add LIMIT for safety (if not already present and not aggregating)
      if (!sqlQuery.toLowerCase().includes('count(') && 
          !sqlQuery.toLowerCase().includes('group by') &&
          !sqlQuery.toLowerCase().includes('limit')) {
        sqlQuery = addLimitToQuery(sqlQuery);
      }
      
      console.log("Executing SQL:", sqlQuery);
      
      // Execute query
      const rows = await executeQuery(sqlQuery, [], countryCode);
      
      // Format response
      if (Array.isArray(rows)) {
        if (rows.length === 0) {
          return "No results found for the query.";
        }
        return JSON.stringify({
          success: true,
          count: rows.length,
          data: rows,
          query: sqlQuery
        }, null, 2);
      } else {
        return JSON.stringify({
          success: true,
          result: rows,
          query: sqlQuery
        }, null, 2);
      }
      
    } catch (err) {
      console.error("Query execution error:", err);
      return JSON.stringify({
        success: false,
        error: err.message,
        suggestion: "Check your SQL syntax or verify table/field names exist in the schema."
      }, null, 2);
    }
  },
});

module.exports = { queryDbTool, SCHEMA_INFO };