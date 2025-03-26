import express, { Request, Response } from "express";
import { User } from "../types";
import { prisma } from "../db/db";
import jwt from "jsonwebtoken";

const router = express.Router();
router.post("/login", async (req: Request, res: Response) => {
  const { email, name, id }: User = req.body;
  console.log(req.body);
  if (!email || !name || !id) {
    res.status(401).json({
      message: "All fields required",
    });
    return;
  }

  try {
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!
    );
    res.status(201).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error while login",
    });
  }
});

export default router;
