import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { conectarBanco } from './db.js';
import { ReservaRepositorio } from './repositorios/ReservaRepositorio.js';
import { MesaRepositorio } from './repositorios/MesaRepositorio.js';
import { PedidoRepositorio } from './repositorios/PedidoRepositorio.js';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORTA = process.env.PORT || 5001;

// Instanciação dos repositórios NoSQL de backend
const repositorioReservas = new ReservaRepositorio();
const repositorioMesas = new MesaRepositorio();
const repositorioPedidos = new PedidoRepositorio();

// Middlewares
app.use(cors());
app.use(express.json()); // Processa requisições em JSON

/* ==============================
   ROTAS DA API REST
   ============================== */

/**
 * @route GET /api/reservas
 * @description Retorna a lista das reservas no BD.
 */
app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await repositorioReservas.obterTodasReservas();
    res.json(reservas);
  } catch (erro) {
    console.error('Erro ao buscar reservas:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao carregar reservas.' });
  }
});

/**
 * @route POST /api/reservas
 * @description Atualiza ou insere em lote a lista de reservas.
 */
app.post('/api/reservas', async (req, res) => {
  try {
    const reservas = req.body;
    if (!Array.isArray(reservas)) {
      return res.status(400).json({ erro: 'O payload de reservas deve ser uma lista (Array).' });
    }
    await repositorioReservas.salvarReservas(reservas);
    res.json({ sucesso: true, mensagem: 'Reservas salvas com sucesso no MongoDB.' });
  } catch (erro) {
    console.error('Erro ao salvar reservas:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao salvar reservas.' });
  }
});

/**
 * @route GET /api/mesas
 * @description Retorna a lista das mesas no BD.
 */
app.get('/api/mesas', async (req, res) => {
  try {
    const mesas = await repositorioMesas.obterTodasMesas();
    res.json(mesas);
  } catch (erro) {
    console.error('Erro ao buscar mesas:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao carregar mesas.' });
  }
});

/**
 * @route POST /api/mesas
 * @description Atualiza ou insere em lote a lista das mesas.
 */
app.post('/api/mesas', async (req, res) => {
  try {
    const mesas = req.body;
    if (!Array.isArray(mesas)) {
      return res.status(400).json({ erro: 'O payload de mesas deve ser uma lista (Array).' });
    }
    await repositorioMesas.salvarMesas(mesas);
    res.json({ sucesso: true, mensagem: 'Mesas salvas com sucesso no MongoDB.' });
  } catch (erro) {
    console.error('Erro ao salvar mesas:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao salvar mesas.' });
  }
});

/**
 * @route GET /api/pedidos
 * @description Retorna a lista de todos os pedidos no BD, ordenados por data de abertura.
 */
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await repositorioPedidos.obterTodosPedidos();
    res.json(pedidos);
  } catch (erro) {
    console.error('Erro ao buscar pedidos:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao carregar pedidos.' });
  }
});

/**
 * @route POST /api/pedidos
 * @description Cria um novo pedido.
 */
app.post('/api/pedidos', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.id || !dados.mesaNumero || !dados.clienteNome) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes: id, mesaNumero, clienteNome.' });
    }
    const novoPedido = await repositorioPedidos.criarPedido(dados);
    res.status(201).json(novoPedido);
  } catch (erro) {
    console.error('Erro ao criar pedido:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao criar pedido.' });
  }
});

/**
 * @route PATCH /api/pedidos/:id
 * @description Atualiza campos específicos de um pedido existente.
 */
app.patch('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const atualizado = await repositorioPedidos.atualizarPedido(id, dadosAtualizados);
    if (!atualizado) {
      return res.status(404).json({ erro: `Pedido com ID "${id}" não encontrado.` });
    }
    res.json({ sucesso: true, mensagem: `Pedido ${id} atualizado com sucesso.` });
  } catch (erro) {
    console.error('Erro ao atualizar pedido:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao atualizar pedido.' });
  }
});

/**
 * @route DELETE /api/pedidos/:id
 * @description Remove um pedido pelo seu código identificador.
 */
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const excluido = await repositorioPedidos.excluirPedido(id);
    if (!excluido) {
      return res.status(404).json({ erro: `Pedido com ID "${id}" não encontrado.` });
    }
    res.json({ sucesso: true, mensagem: `Pedido ${id} excluído com sucesso.` });
  } catch (erro) {
    console.error('Erro ao excluir pedido:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao excluir pedido.' });
  }
});

/**
 * Inicializa o servidor com conexão prévia ao bd.
 */
async function iniciarServidor() {
  await conectarBanco();

  app.listen(PORTA, () => {
    console.log(`>>> [Backend] Servidor rodando com sucesso na porta ${PORTA}.`);
  });
}

iniciarServidor();
