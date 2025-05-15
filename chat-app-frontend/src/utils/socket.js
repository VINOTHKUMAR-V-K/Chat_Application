import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  authorization: {
    token: localStorage.getItem("jwtToken"), // Pass JWT for authentication if needed
  },
});

export default socket;
