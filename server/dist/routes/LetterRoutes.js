"use strict";
// import express from "express";
// import { google } from "googleapis";
// import { PrismaClient } from "@prisma/client";
// import { authenticate, AuthRequest } from "../middleware/middleware"; // Import `AuthRequest`
// const prisma = new PrismaClient();
// const router = express.Router();
// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   "http://localhost:8080/auth/google/callback"
// );
// async function getValidAccessToken(user: any) {
//   console.log("User data from DB:", user); // Debugging log
//   if (!user.accessToken || !user.refreshToken) {
//     throw new Error("Missing access or refresh token");
//   }
//   oauth2Client.setCredentials({
//     access_token: user.accessToken,
//     refresh_token: user.refreshToken,
//   });
//   try {
//     await oauth2Client.getAccessToken();
//     return user.accessToken;
//   } catch (error) {
//     console.log("Access token expired, refreshing...");
//     const { credentials } = await oauth2Client.refreshAccessToken();
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { accessToken: credentials.access_token },
//     });
//     return credentials.access_token;
//   }
// }
// router.post("/save", authenticate, async (req: AuthRequest, res) => {
//   // Use AuthRequest here
//   const userId = req.user?.id;
//   if (!userId) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }
//   const { title, content } = req.body;
//   if (!title || !content) {
//     res.status(400).json({ message: "Missing fields" });
//     return;
//   }
//   try {
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
//     const accessToken = await getValidAccessToken(user);
//     console.log("access token", accessToken);
//     oauth2Client.setCredentials({ access_token: accessToken });
//     const drive = google.drive({ version: "v3", auth: oauth2Client });
//     const fileMetadata = {
//       name: `${title}.docx`,
//       mimeType: "application/vnd.google-apps.document",
//     };
//     const media = { mimeType: "text/html", body: content };
//     const file = await drive.files.create({
//       requestBody: fileMetadata,
//       media,
//       fields: "id",
//     });
//     const savedLetter = await prisma.letter.create({
//       data: {
//         userId,
//         title,
//         content,
//         fileId: file.data.id!,
//       },
//     });
//     res.json({ message: "Letter saved", letter: savedLetter });
//   } catch (error: any) {
//     console.error("Error:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// });
// export default router;
