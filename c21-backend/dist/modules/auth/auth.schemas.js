"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().min(6).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6),
});
