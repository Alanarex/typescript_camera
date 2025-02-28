import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both frontend ports
        methods: ["GET", "POST"],
    }
});

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Ensure Express also allows both origins
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

let messages = []; // Store messages in memory
let onlineUsers = new Set(); // Track online users

// Simple API to check if the server is running
app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

// API to fetch old messages
app.get('/messages', (req, res) => {
    res.json(messages);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user coming online
    socket.on('user-online', (username) => {
        if (!onlineUsers.has(username)) {
            onlineUsers.add(username);
            console.log(`${username} is now online`);
            io.emit('user-online', username);
        }
    });

    // Handle user going offline
    socket.on('user-offline', (username) => {
        if (onlineUsers.has(username)) {
            onlineUsers.delete(username);
            console.log(`${username} is now offline`);
            io.emit('user-offline', username);
        }
    });

    // Handle messages
    socket.on('message', (data) => {
        console.log("Message received:", data);
        messages.push(data);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on http://0.0.0.0:${PORT}`));
