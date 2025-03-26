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
exports.uploadFile = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const drive = googleapis_1.google.drive({ version: "v3", auth: oauth2Client });
const uploadFile = (content, title) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, `${title}.html`);
    // Save HTML content to a temporary file
    fs_1.default.writeFileSync(filePath, content);
    const response = yield drive.files.create({
        requestBody: {
            name: title,
            mimeType: "application/vnd.google-apps.docs", // Google Docs format
        },
        media: {
            mimeType: "text/html", // Uploading as HTML
            body: fs_1.default.createReadStream(filePath),
        },
        fields: "id, webViewLink, webContentLink",
    });
    fs_1.default.unlinkSync(filePath); // Remove temp file
    const fileId = response.data.id;
    if (!fileId) {
        throw new Error("File ID is undefined. Upload failed.");
    }
    // Make the file publicly accessible
    yield drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: "reader",
            type: "anyone",
        },
    });
    console.log("File uploaded successfully!", response.data);
    console.log("View link:", response.data.webViewLink);
    console.log("Direct download link:", response.data.webContentLink);
    return {
        id: fileId,
        viewLink: response.data.webViewLink,
        downloadLink: response.data.webContentLink,
    };
});
exports.uploadFile = uploadFile;
