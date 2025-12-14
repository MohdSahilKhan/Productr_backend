import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";


dotenv.config();
connectDB();

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
