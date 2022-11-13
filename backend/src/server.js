import { mongo } from "./mongo.js";
import express from 'express';
import http from 'http';
import mongoose from "mongoose";
import { WebSocketServer } from 'ws';
import wsConnect from "./wsConnect.js";

mongo.connect();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });
const db = mongoose.connection;

db.once('open', () => {
    console.log('MongoDB connected!');
    wss.on('connection', ws => {
        wsConnect.initData(ws);
        ws.on('message', wsConnect.onMessage(wss, ws));
    });
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("server created!"));