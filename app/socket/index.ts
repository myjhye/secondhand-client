import { baseURL } from "app/api/client";
import { io } from "socket.io-client";

const socket = io(baseURL, {
  path: "/socket-message",
  transports: ["websocket"], // WebSocket만 사용
  autoConnect: false,
});

export default socket;
