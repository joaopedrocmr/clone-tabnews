import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function postHandler(req, res) {
  let dbClient;

  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }

  try {
    dbClient = await database.getNewClient();

    const runMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
      dryRun: false,
    });

    if (runMigrations.length > 0) {
      return res.status(201).json(runMigrations);
    }

    return res.status(200).json(runMigrations);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

async function getHandler(req, res) {
  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method ${req.method} not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pedingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient: dbClient,
    });

    return res.status(200).json(pedingMigrations);
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
