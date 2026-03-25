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
exports.listAwards = listAwards;
exports.getAward = getAward;
exports.createAward = createAward;
exports.updateAward = updateAward;
exports.deleteAward = deleteAward;
const awardService = __importStar(require("./award.service"));
function getUserId(req, res) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'No autorizado.' });
        return null;
    }
    return userId;
}
async function listAwards(req, res, next) {
    try {
        const userId = getUserId(req, res);
        if (!userId)
            return;
        const awards = await awardService.listAwards(userId);
        res.status(200).json(awards);
    }
    catch (err) {
        next(err);
    }
}
async function getAward(req, res, next) {
    try {
        const userId = getUserId(req, res);
        if (!userId)
            return;
        const award = await awardService.getAward(userId, req.params.id);
        res.status(200).json(award);
    }
    catch (err) {
        next(err);
    }
}
async function createAward(req, res, next) {
    try {
        const userId = getUserId(req, res);
        if (!userId)
            return;
        const award = await awardService.createAward(userId, req.body);
        res.status(201).json(award);
    }
    catch (err) {
        next(err);
    }
}
async function updateAward(req, res, next) {
    try {
        const userId = getUserId(req, res);
        if (!userId)
            return;
        const award = await awardService.updateAward(userId, req.params.id, req.body);
        res.status(200).json(award);
    }
    catch (err) {
        next(err);
    }
}
async function deleteAward(req, res, next) {
    try {
        const userId = getUserId(req, res);
        if (!userId)
            return;
        const result = await awardService.deleteAward(userId, req.params.id);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
