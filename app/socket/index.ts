import { baseURL } from "app/api/client";
import { io } from "socket.io-client";

const socket = io(baseURL, { path: "/socket-message", autoConnect: false });

export default socket;
