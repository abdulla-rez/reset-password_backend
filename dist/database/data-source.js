"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const ResetToken_1 = require("../models/ResetToken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '5432'),
//   username: process.env.DB_USERNAME,
//   url:process.env.DATABASE_URL,
//   password: process.env.DB_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   database: process.env.DB_NAME,
//   synchronize: false,
//   logging: false,
//   entities: [User, ResetToken],
// });
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL, // ✅ Use only url
    ssl: {
        rejectUnauthorized: false, // ✅ Render requires SSL
    },
    synchronize: false,
    logging: false,
    entities: [User_1.User, ResetToken_1.ResetToken],
});
