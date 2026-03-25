"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const errors_1 = require("../utils/errors");
function validateBody(schema) {
    return (req, _res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            next(new errors_1.AppError('Datos invalidos.', 400, parsed.error.flatten()));
            return;
        }
        req.body = parsed.data;
        next();
    };
}
