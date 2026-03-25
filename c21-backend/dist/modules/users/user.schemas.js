"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const socialAccountSchema = zod_1.z.object({
    provider: zod_1.z.enum(['WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK']),
    handle: zod_1.z.string().min(1),
    isVerified: zod_1.z.boolean().optional(),
});
exports.createUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().min(6).optional(),
    documentNumber: zod_1.z.string().min(4).optional(),
    address: zod_1.z.string().min(3).optional(),
    cityId: zod_1.z.number().int().optional(),
    roleId: zod_1.z.number().int().optional(),
    branchId: zod_1.z.number().int().optional(),
    hireDate: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    isVerified: zod_1.z.boolean().optional(),
    socialAccounts: zod_1.z.array(socialAccountSchema).optional(),
});
exports.updateUserSchema = exports.createUserSchema.partial();
