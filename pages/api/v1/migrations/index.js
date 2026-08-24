import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "models/migrator.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const pedingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pedingMigrations);
}

async function postHandler(req, res) {
  const runMigrations = await migrator.runPendingMigrations();

  if (runMigrations.length > 0) {
    return res.status(201).json(runMigrations);
  }

  return res.status(200).json(runMigrations);
}
