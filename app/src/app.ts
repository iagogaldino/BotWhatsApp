import express = require("express");
import { routers } from "./routes";
import * as dotenv from 'dotenv';
export const app = express();
import * as cors from 'cors';
import { initialize } from "./database/firebase";
import { startSchedule } from "./controllers/schedule";
import * as session from 'express-session';

// Configuração do CORS
app.use(cors());
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
app.use(express.json());
app.use(session({
    secret: 'seuSegredo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Configure 'secure' como true se estiver usando HTTPS
  }));
routers();
initialize();
startSchedule();
