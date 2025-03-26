import express, { Request, Response } from "express";
import { deleteFile, updateFile, uploadFile } from "../utils/Drive";
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
          content,
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

router.get(
  "/user-files",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
      const files = await prisma.uploadedFile.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({ files });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching files", error: error.message });
    }
  }
);

router.put(
  "/update/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const fileId = req.params.id;
    const { content, title } = req.body;

    if (!content || !title) {
      res.status(400).json({ message: "Missing content or title" });
    }

    try {
      const existingFile = await prisma.uploadedFile.findUnique({
        where: { id: fileId },
      });

      if (!existingFile || existingFile.userId !== userId) {
        res.status(404).json({ message: "File not found or unauthorized" });
        return;
      }

      await updateFile(existingFile.fileId, content, title);

      const updatedFile = await prisma.uploadedFile.update({
        where: { id: fileId },
        data: { title, content },
      });

      res.status(200).json({ message: "File updated", updatedFile });
    } catch (error) {
      res.status(500).json({ message: "Update failed", error });
    }
  }
);

// 🔹 DELETE a file
router.delete(
  "/delete/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const fileId = req.params.id;

    try {
      const existingFile = await prisma.uploadedFile.findUnique({
        where: { id: fileId },
      });

      if (!existingFile || existingFile.userId !== userId) {
        res.status(404).json({ message: "File not found or unauthorized" });
        return;
      }

      await deleteFile(existingFile.fileId);

      await prisma.uploadedFile.delete({ where: { id: fileId } });

      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Deletion failed", error });
    }
  }
);

export default router;
