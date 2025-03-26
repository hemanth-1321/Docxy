import { google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

/**
 * Uploads a file to Google Drive
 */
export const uploadFile = async (content: string, title: string) => {
  const filePath = path.join(__dirname, `${title}.html`);

  fs.writeFileSync(filePath, content);

  const response = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.docs", // Google Docs format
    },
    media: {
      mimeType: "text/html",
      body: fs.createReadStream(filePath),
    },
    fields: "id, webViewLink, webContentLink",
  });

  fs.unlinkSync(filePath);

  const fileId = response.data.id;
  if (!fileId) {
    throw new Error("File ID is undefined. Upload failed.");
  }

  await drive.permissions.create({
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
};

/**
 * Updates an existing file in Google Drive
 */
export const updateFile = async (
  fileId: string,
  newContent: string,
  newTitle: string
) => {
  const filePath = path.join(__dirname, `${newTitle}.html`);
  fs.writeFileSync(filePath, newContent);

  const response = await drive.files.update({
    fileId: fileId,
    requestBody: {
      name: newTitle,
      mimeType: "application/vnd.google-apps.docs",
    },
    media: {
      mimeType: "text/html",
      body: fs.createReadStream(filePath),
    },
    fields: "id, webViewLink, webContentLink",
  });

  fs.unlinkSync(filePath);

  console.log("File updated successfully!", response.data);
  return {
    id: response.data.id,
    viewLink: response.data.webViewLink,
    downloadLink: response.data.webContentLink,
  };
};

/**
 * Deletes a file from Google Drive
 */
export const deleteFile = async (fileId: string) => {
  await drive.files.delete({ fileId });
  console.log(`File ${fileId} deleted successfully`);
  return { message: "File deleted successfully", fileId };
};
