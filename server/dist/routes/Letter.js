"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Drive_1 = require("../utils/Drive");
const middleware_1 = require("../middleware/middleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/upload", middleware_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    console.log("user", userId);
    const { content, title } = req.body;
    if (!content || !title) {
        res.status(400).json({ message: "Missing content or file name" });
        return;
    }
    try {
        const fileData = yield (0, Drive_1.uploadFile)(content, title);
        console.log("response", fileData);
        const savedFile = yield prisma.uploadedFile.create({
            data: {
                userId,
                title,
                fileId: fileData.id,
                viewLink: fileData.viewLink,
            },
        });
        res.status(200).json({ message: "File uploaded", savedFile });
    }
    catch (error) {
        res.status(500).json({ message: "Upload failed", error });
    }
}));
exports.default = router;
