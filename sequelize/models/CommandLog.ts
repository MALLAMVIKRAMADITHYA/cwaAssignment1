import { DataTypes, Model, Sequelize } from "sequelize";

export class CommandLog extends Model {}

export function initCommandLog(sequelize: Sequelize) {
  CommandLog.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: true },
    owner: { type: DataTypes.STRING, allowNull: true },
    repo: { type: DataTypes.STRING, allowNull: true },
    command: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, modelName: "CommandLog" }
  );

  return CommandLog;
}
