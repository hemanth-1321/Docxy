import express, { Request, Response } from "express";
import { uploadFile } from "../utils/Drive";
import { authenticateUser } from "../middleware/middleware";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.post(
  "/upload",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    console.log("user", userId);
    const { content, title } = req.body;

    if (!content || !title) {
      res.status(400).json({ message: "Missing content or file name" });
      return;
    }

    try {
      const fileData = await uploadFile(content, title);
      console.log("response", fileData);
      const savedFile = await prisma.uploadedFile.create({
        data: {
          userId,
          title,
          fileId: fileData.id,
          viewLink: fileData.viewLink!,
        },
      });
      res.status(200).json({ message: "File uploaded", savedFile });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error });
    }
  }
);

export default router;
