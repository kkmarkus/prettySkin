import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { default as chatHandler } from './api/chat.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Delega para a mesma função que o Vercel usa em produção
app.post('/api/chat', (req, res) => chatHandler(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌸 Pretty Skin rodando em http://localhost:${PORT}`);
});
