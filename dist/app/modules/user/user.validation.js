"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string()
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long." }),
    role: zod_1.default.string().optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    password: zod_1.default.string().optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    status: zod_1.default.enum(Object.values(user_interface_1.Status)).optional(),
    isDeleted: zod_1.default.boolean().optional(),
});
