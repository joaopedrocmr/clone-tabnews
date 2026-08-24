import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const runMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    return runMigrations;
  } finally {
    if (dbClient) {
      await dbClient?.end();
    }
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
