import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import bodyParser from "body-parser";
import cookie from 'cookie';
import cookieParser from "cookie-parser";
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRoutes from "./user/user.api.js";
import authRoutes from './user/auth.api.js';
import gameRoutes from './game/game.api.js';
import { helper } from "./helper.js";

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
app.use(helper);
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/user/auth', authRoutes);
app.use('/api/game', gameRoutes);

const socketUsers = {};

io.on('connection', (socket) => {
    socket.on('connected', () => {
        const _cookie = cookie.parse(socket.handshake.headers.cookie);

        socketUsers[_cookie.SUID] = socket.id;
    })

    socket.on('disconnect', () => {
        const _cookie = cookie.parse(socket.handshake.headers.cookie);

        delete socketUsers[_cookie.SUID];
    })
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export { io, socketUsers };