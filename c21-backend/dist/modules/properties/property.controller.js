"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProperties = listProperties;
exports.getProperty = getProperty;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
const propertyService = __importStar(require("./property.service"));
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4000';
function toNumber(value) {
    if (value === '' || value === undefined || value === null)
        return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}
function toBoolean(value) {
    if (value === undefined)
        return undefined;
    if (value === 'true' || value === true)
        return true;
    if (value === 'false' || value === false)
        return false;
    return undefined;
}
function toStr(value) {
    if (typeof value === 'string' && value.trim() !== '')
        return value.trim();
    return undefined;
}
async function listProperties(req, res, next) {
    try {
        const cityId = toNumber(req.query.cityId);
        const typeId = toNumber(req.query.typeId);
        const statusId = toNumber(req.query.statusId);
        const agentId = req.query.agentId;
        const isDraft = toBoolean(req.query.isDraft);
        const canSeeDrafts = Boolean(req.user);
        const properties = await propertyService.listProperties({
            cityId,
            typeId,
            statusId,
            agentId,
            isDraft: canSeeDrafts ? isDraft : false,
        });
        res.status(200).json(properties);
    }
    catch (err) {
        next(err);
    }
}
async function getProperty(req, res, next) {
    try {
        const property = await propertyService.getPropertyById(req.params.id, {
            allowDrafts: Boolean(req.user),
        });
        res.status(200).json(property);
    }
    catch (err) {
        next(err);
    }
}
async function createProperty(req, res, next) {
    try {
        const b = req.body;
        const title = toStr(b.title);
        if (!title) {
            res.status(400).json({ error: 'El título es obligatorio.' });
            return;
        }
        // Build media records from uploaded files (multer disk storage)
        const files = req.files;
        const uploadedMedia = files && files.length > 0
            ? files.map((f, i) => ({
                type: 'IMAGE',
                url: `${BASE_URL}/uploads/${f.filename}`,
                order: i,
            }))
            : undefined;
        const property = await propertyService.createProperty({
            title,
            description: toStr(b.description),
            typeId: toNumber(b.typeId),
            statusId: toNumber(b.statusId),
            currencyId: toNumber(b.currencyId),
            totalPrice: toNumber(b.totalPrice),
            pricePerM2: toNumber(b.pricePerM2),
            cityId: toNumber(b.cityId),
            zoneId: toNumber(b.zoneId),
            address: toStr(b.address),
            areaM2: toNumber(b.areaM2),
            builtAreaM2: toNumber(b.builtAreaM2),
            frontM2: toNumber(b.frontM2),
            depthM2: toNumber(b.depthM2),
            bedrooms: toNumber(b.bedrooms),
            bathrooms: toNumber(b.bathrooms),
            suites: toNumber(b.suites),
            parking: toNumber(b.parking),
            isDraft: toBoolean(b.isDraft) ?? true,
            agentId: toStr(b.agentId) ?? req.user?.id,
            media: uploadedMedia,
        });
        res.status(201).json(property);
    }
    catch (err) {
        next(err);
    }
}
async function updateProperty(req, res, next) {
    try {
        const property = await propertyService.updateProperty(req.params.id, req.body);
        res.status(200).json(property);
    }
    catch (err) {
        next(err);
    }
}
async function deleteProperty(req, res, next) {
    try {
        const result = await propertyService.deleteProperty(req.params.id);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
