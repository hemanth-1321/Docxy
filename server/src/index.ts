import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes";
import LetterRoutes from "./routes/Letter";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/auth", AuthRoutes);
app.use("/api/letters", LetterRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
