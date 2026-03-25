"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAwardSchema = exports.createAwardSchema = void 0;
const zod_1 = require("zod");
exports.createAwardSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    receivedAt: zod_1.z.string().datetime(),
    imageUrl: zod_1.z.string().url().optional(),
});
exports.updateAwardSchema = exports.createAwardSchema.partial();
