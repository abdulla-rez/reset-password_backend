"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const allowedOrigins = [
    'http://localhost:5173',
    'https://ephemeral-starlight-fc99d4.netlify.app',
    'https://polite-sprite-12327d.netlify.app',
    'https://charming-valkyrie-effcea.netlify.app'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
// app.options('/*', cors(corsOptions)); 
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
exports.default = app;
