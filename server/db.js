import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Carrega as variáveis de ambiente do arquivo .env na raiz do projeto
dotenv.config();

// Servidores DNS públicos para contornar falhas de resolução SRV do MongoDB Atlas no Node.js
const SERVIDORES_DNS = ['8.8.8.8', '1.1.1.1'];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:5173/restaurante';

/**
 * @function conectarBanco
 * @description Conecta com o banco de dados (MongoDB) via mongoose.
 * Configura resolvedores DNS públicos para evitar falhas com a URI do Atlas e escuta os eventos da conexão.
 * @returns {Promise<void>}
 */
export async function conectarBanco() {
  try {
    // Força o resolvedor DNS do Node.js a utilizar servidores públicos e robustos.
    // Isso evita falhas de 'querySrv ECONNREFUSED' comuns ao resolver registros SRV em conexões Atlas.
    dns.setServers(SERVIDORES_DNS);

    mongoose.connection.on('connected', () => {
      console.log('>>> [MongoDB] Conectado ao banco com sucesso.');
    });

    mongoose.connection.on('error', (erro) => {
      console.error('>>> [MongoDB] Erro na conexão:', erro.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('>>> [MongoDB] Conexão perdida com o servidor.');
    });

    await mongoose.connect(MONGODB_URI);
  } catch (erro) {
    console.error('>>> [MongoDB] Falha crítica ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
}
