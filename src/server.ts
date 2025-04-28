import express from "express";
import "dotenv/config"
import { AppDataSource } from "./config/typeorm";
import app from "./api/app";
import io from "./notifs/server";


const API_PORT = process.env.API_PORT || 3000;
const NOTIFS_PORT = process.env.NOTIFS_PORT ? +process.env.NOTIFS_PORT : 3001;

(async () => {
  await AppDataSource.initialize().then(() => {
    console.log("[database]: Connection established");
  });

io.listen(NOTIFS_PORT);
console.log(`[socket]: Server is running at http://localhost:${NOTIFS_PORT}`);

app.listen(API_PORT, () => {
  console.log(`Server is running on http://localhost:${API_PORT}`);
  console.log("[server] Local network :", require("ip").address());

});
})();
