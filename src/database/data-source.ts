import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { ResetToken } from '../models/ResetToken';
import dotenv from 'dotenv';

dotenv.config();

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

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,         // ✅ Use only url
  ssl: {
    rejectUnauthorized: false,           // ✅ Render requires SSL
  },
  synchronize: false,
  logging: false,
  entities: [User, ResetToken],
});
