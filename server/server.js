import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import 'dotenv/config'

const app = express();
const PORT = 3000;

import steamRoutes from "./steam/steam.api.js";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/steam_achievements_manager";

mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB ✅"))
    .catch((err) => console.error("MongoDB Connection Error ❌", err));

app.use(cors())
app.use('/steam', steamRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
