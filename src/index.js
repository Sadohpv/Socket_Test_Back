import configViewEngine from "./config/viewEngine";
import cors from "cors";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/web";
import { connectDB } from "./config/connectDB";
import "dotenv/config";
import { createServer } from "node:http";
const http = require("http");
import { Server } from "socket.io";

const express = require("express");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
let corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
//   app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

// app.use(cookieParser());

configViewEngine(app);
initWebRoutes(app,io);

// nhớ thêm cái cors này để tránh bị Exception nhé :D  ở đây mình làm nhanh nên cho phép tất cả các trang đều cors được.




io.on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected " + socket.id); 
    // const text = "Send Data From Server To Client ";
    // io.emit("sendDataServer", { text });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});




connectDB();

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export {io}