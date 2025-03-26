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

export const uploadFile = async (content: string, title: string) => {
  const filePath = path.join(__dirname, `${title}.html`);

  // Save HTML content to a temporary file
  fs.writeFileSync(filePath, content);

  const response = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.docs", // Google Docs format
    },
    media: {
      mimeType: "text/html", // Uploading as HTML
      body: fs.createReadStream(filePath),
    },
    fields: "id, webViewLink, webContentLink",
  });

  fs.unlinkSync(filePath); // Remove temp file

  const fileId = response.data.id;
  if (!fileId) {
    throw new Error("File ID is undefined. Upload failed.");
  }
  // Make the file publicly accessible
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
