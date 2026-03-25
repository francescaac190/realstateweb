"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
const mediaSchema = zod_1.z.object({
    type: zod_1.z.enum(['IMAGE', 'VIDEO']),
    url: zod_1.z.string().url(),
    order: zod_1.z.number().int().optional(),
});
exports.createPropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    pricePerM2: zod_1.z.number().optional(),
    totalPrice: zod_1.z.number().optional(),
    currencyId: zod_1.z.number().int().optional(),
    typeId: zod_1.z.number().int().optional(),
    statusId: zod_1.z.number().int().optional(),
    areaM2: zod_1.z.number().optional(),
    builtAreaM2: zod_1.z.number().optional(),
    frontM2: zod_1.z.number().optional(),
    depthM2: zod_1.z.number().optional(),
    address: zod_1.z.string().optional(),
    cityId: zod_1.z.number().int().optional(),
    zoneId: zod_1.z.number().int().optional(),
    lat: zod_1.z.number().optional(),
    lng: zod_1.z.number().optional(),
    bedrooms: zod_1.z.number().int().optional(),
    bathrooms: zod_1.z.number().int().optional(),
    suites: zod_1.z.number().int().optional(),
    parking: zod_1.z.number().int().optional(),
    isDraft: zod_1.z.boolean().optional(),
    agentId: zod_1.z.string().uuid().optional(),
    media: zod_1.z.array(mediaSchema).optional(),
});
exports.updatePropertySchema = exports.createPropertySchema.partial();
