import { sequelize } from "./index";
async function main() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Sequelize ready");
  process.exit(0);
}
main();
