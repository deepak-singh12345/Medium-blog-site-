"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const db_1 = __importDefault(require("./utils/db"));
const routes_1 = __importDefault(require("./routes"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
(0, db_1.default)();
app.use('/api/v1', routes_1.default);
app.use('/adminPanel', adminRouter_1.default);
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
