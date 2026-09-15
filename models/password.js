import bcryptjs from "bcryptjs";

async function hash(password) {
  const Rounds = process.env.NODE_ENV === "production" ? 14 : 1;
  const hashedPassword = await bcryptjs.hash(password, Rounds);
  return hashedPassword;
}
async function compare(password, hashedPassword) {
  const isMatch = await bcryptjs.compare(password, hashedPassword);
  return isMatch;
}
const password = {
  hash,
  compare,
};

export default password;
