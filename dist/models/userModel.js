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
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/, // Regex for letters only
    },
    lastName: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/, // Regex for letters only
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 20,
        match: /^(?=.*[!@#$%^&*])(?=.*[0-9])[A-Za-z0-9!@#$%^&*]{8,20}$/, // Regex for at least one special char and number
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    verified: {
        type: Boolean,
        default: true,
    },
    blogsCount: {
        type: Number,
        required: true,
        default: 0,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    profilePic: {
        type: String, // Store the URL of the profile picture
        default: null, // Optional
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null, // Optional
    },
    deletedBy: {
        type: String,
        default: null, // Optional
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});
// Create and export the User model
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
