import { Sequelize } from "sequelize";

// DATABASE_URL examples:
//  - sqlite: "sqlite:dev.sqlite"
//  - postgres: "postgres://appuser:apppass@db:5432/appdb"
export const sequelize = new Sequelize(process.env.DATABASE_URL as string, { logging: false });

// import and init models here, e.g.
// import { initCommandLog } from "./models/CommandLog";
// initCommandLog(sequelize);

// Usage at startup:
// await sequelize.authenticate();
// await sequelize.sync();
