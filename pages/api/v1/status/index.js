import database from "infra/database.js";

async function status(req, res) {

  const updatedAt = new Date().toISOString()
  
   const databaseVersionresult = await database.query("SHOW server_version")
   const databaseVersion = databaseVersionresult.rows[0].server_version

  const maxConnectionsresult = await database.query("SHOW max_connections")
  const maxConnections = maxConnectionsresult.rows[0].max_connections

  const databaseName = process.env.POSTGRES_DB
  const openConnectionsresult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName]
  }  
  )
  const openConnections = openConnectionsresult.rows[0].count
 
  res.status(200).json({
    updated_at: updatedAt,
    dependencies:{
      database:{
        version: databaseVersion,
        max_connections: parseInt(maxConnections),
        open_connections: openConnections
      }
    }
});
  
}

export default status;
