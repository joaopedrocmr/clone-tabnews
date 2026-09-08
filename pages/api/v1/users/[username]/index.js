import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const userFound = await user.findOneByUsername(req.query.username);

  return res.status(200).json(userFound);
}
