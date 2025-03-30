import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRoutes from "./user/user.api.js";
import authRoutes from './user/auth.api.js';
import gameRoutes from './game/game.api.js';

const app = express();
const PORT = 3000;
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    path: '/api/socket.io'
});

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/steam_achievements_manager";

mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error", err));

app.use(cors());
app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.use('/api/user/auth', authRoutes);
app.use('/api/game', gameRoutes);

// const Users = {};

io.on('connection', (socket) => {
    // Users[socket.io] = '';
    // socket.emit('connected', { socketId: socket.id });

    // io.to(socket.id).emit('conneted', { socketId: socket.id })
    // console.log('A user connected to the socket', socket.id);
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export { io }