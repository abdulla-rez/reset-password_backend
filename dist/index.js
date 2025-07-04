"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./database/data-source");
const PORT = process.env.PORT || 5000;
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
