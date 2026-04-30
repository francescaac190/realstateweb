"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
    : true;
app.use((0, cors_1.default)({ origin: corsOrigins, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
const uploadsDir = process.env.UPLOADS_DIR ?? path_1.default.join(process.cwd(), 'uploads');
app.use('/uploads', express_1.default.static(uploadsDir));
app.get('/', (_req, res) => {
    res.send('API Century 21 funcionando.');
});
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use('/api', routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
