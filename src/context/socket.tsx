import { io } from "socket.io-client";

// Get backend URL & WebSocket protocol dynamically
const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;
const WS_PROTOCOL = import.meta.env.VITE_WS_PROTOCOL || (SERVER_URL.startsWith("https") ? "wss" : "ws");

// Construct WebSocket URL dynamically
const SOCKET_URL = `${WS_PROTOCOL}://${new URL(SERVER_URL).host}`;

export const socket = io(SOCKET_URL, { autoConnect: false });
