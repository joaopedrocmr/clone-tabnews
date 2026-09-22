import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const userFound = await user.findOneByUsername(req.query.username);

  return res.status(200).json(userFound);
}
async function patchHandler(req, res) {
  const userFound = req.query.username;
  const userInputValues = req.body;

  const updatedUser = await user.update(userFound, userInputValues);

  return res.status(200).json(updatedUser);
}
