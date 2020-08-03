import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import App from "./app";
import morgan from "morgan";
import logger from "morgan";
import fs from 'fs';
import path from 'path';

dotenv.config();

import { TransactionRoutes } from './routes';
const logFilePath = path.join(__dirname, '../access.log');

// create new express app and pass port, routes and middlewares to constructor
const app = new App({
  port: process.env.PORT && parseInt(process.env.PORT, 10) || 5000,
  routes: [
    new TransactionRoutes('/transactions')
  ],
  middleWares: [
    helmet(),
    cors(),
    express.json(),
    process.env.NODE_ENV === 'development' ? morgan('combined') : logger('combined', { stream: fs.createWriteStream(logFilePath, { flags: 'a' }) })
  ]
});
// start listing to user request
app.listen();
export default app;