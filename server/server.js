import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.VITE_SERVER_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5174/typescript_camera";
const API_PREFIX = process.env.VITE_API_PREFIX || "";
const allowedOrigins = [
    new URL(FRONTEND_URL).origin, // Extracts only protocol, host, and port
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST"],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());

let messages = [];
let onlineUsers = new Set();

// ✅ Serve API dynamically based on `VITE_API_PREFIX`
const route = (path) => API_PREFIX + path;

app.get(["/", route("/")], (req, res) => {
    res.json({ message: "Server is running" });
});

app.get([route("/messages-list")], (req, res) => {
    res.json(messages);
});

app.get([route("/online-users")], (req, res) => {
    res.json([...onlineUsers]);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('user-online', (username) => {
        if (!onlineUsers.has(username)) {
            onlineUsers.add(username);
            console.log(`${username} is now online`);
            io.emit('update-online-users', [...onlineUsers]);
        }
    });

    socket.on('user-offline', (username) => {
        if (onlineUsers.has(username)) {
            onlineUsers.delete(username);
            console.log(`${username} is now offline`);
            io.emit('update-online-users', [...onlineUsers]);
        }
    });

    socket.on('message', (data) => {
        console.log("Message received:", data);
        messages.push(data);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// ✅ Allow the server to bind to 0.0.0.0 for wider accessibility
server.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on ${SERVER_URL}${API_PREFIX}`));
