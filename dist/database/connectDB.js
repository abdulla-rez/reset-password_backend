"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const data_source_1 = require("./data-source");
const connectDB = async () => {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('Connected to PostgreSQL database');
    }
    catch (err) {
        console.error('Database connection error:', err);
    }
};
exports.connectDB = connectDB;
