import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "GET") {
      const pedingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: true,
      });

      return res.status(200).json(pedingMigrations);
    }

    if (req.method === "POST") {
      const runMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (runMigrations.length > 0) {
        return res.status(201).json(runMigrations);
      }

      return res.status(200).json(runMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
