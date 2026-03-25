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
exports.getRoles = getRoles;
exports.getCurrencies = getCurrencies;
exports.getPropertyTypes = getPropertyTypes;
exports.getPropertyStatuses = getPropertyStatuses;
exports.getCities = getCities;
exports.getZones = getZones;
exports.getBranches = getBranches;
const catalogService = __importStar(require("./catalog.service"));
function toNumber(value) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}
async function getRoles(_req, res, next) {
    try {
        const roles = await catalogService.listRoles();
        res.status(200).json(roles);
    }
    catch (err) {
        next(err);
    }
}
async function getCurrencies(_req, res, next) {
    try {
        const currencies = await catalogService.listCurrencies();
        res.status(200).json(currencies);
    }
    catch (err) {
        next(err);
    }
}
async function getPropertyTypes(_req, res, next) {
    try {
        const types = await catalogService.listPropertyTypes();
        res.status(200).json(types);
    }
    catch (err) {
        next(err);
    }
}
async function getPropertyStatuses(_req, res, next) {
    try {
        const statuses = await catalogService.listPropertyStatuses();
        res.status(200).json(statuses);
    }
    catch (err) {
        next(err);
    }
}
async function getCities(_req, res, next) {
    try {
        const cities = await catalogService.listCities();
        res.status(200).json(cities);
    }
    catch (err) {
        next(err);
    }
}
async function getZones(req, res, next) {
    try {
        const cityId = toNumber(req.query.cityId);
        const zones = await catalogService.listZones(cityId);
        res.status(200).json(zones);
    }
    catch (err) {
        next(err);
    }
}
async function getBranches(_req, res, next) {
    try {
        const branches = await catalogService.listBranches();
        res.status(200).json(branches);
    }
    catch (err) {
        next(err);
    }
}
