import mongoose from 'mongoose';

/**
 * Schema do item individual dentro de um pedido.
 * Representa um prato ou bebida com sua quantidade e preço unitário.
 */
const itemPedidoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  precoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['Entrada', 'Prato Principal', 'Sobremesa', 'Bebida'],
    default: 'Prato Principal'
  }
}, { _id: false });

/**
 * Schema principal do Mongoose representando um pedido de mesa no restaurante.
 */
const pedidoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  mesaNumero: {
    type: String,
    required: true,
    trim: true
  },
  clienteNome: {
    type: String,
    required: true,
    trim: true
  },
  itens: {
    type: [itemPedidoSchema],
    default: []
  },
  valorTotal: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    required: true,
    // PORQUÊ: O ciclo de vida do pedido passa por Aberto → Preparando → Pronto → Entregue → Cancelado
    enum: ['Aberto', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'],
    default: 'Aberto'
  },
  observacoes: {
    type: String,
    trim: true,
    default: ''
  },
  dataAbertura: {
    type: String,
    required: true
  }
}, {
  // PORQUÊ: Auditoria automática de criação e última modificação do pedido.
  timestamps: true
});

// PORQUÊ: Exportação idempotente para evitar erros de redeclaração durante hot-reload no desenvolvimento.
export const PedidoModel = mongoose.models.Pedido || mongoose.model('Pedido', pedidoSchema);
