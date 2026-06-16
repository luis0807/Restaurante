/* ==============================
   CONFIGURAÇÕES DO SCRIPT
   ============================== */
import { PedidoModel } from '../modelos/Pedido.js';

/**
 * @class PedidoRepositorio
 * @description Encapsula as operações do MongoDB para acesso a dados dos pedidos.
 * Oferece uma camada de abstração limpa de persistência para as regras de negócio.
 */
export class PedidoRepositorio {

  /**
   * Obtém todos os pedidos cadastrados ordenados por data de abertura.
   * @returns {Promise<Array<Object>>} Lista de todos os pedidos.
   */
  async obterTodosPedidos() {
    // PORQUÊ: lean() retorna objetos JavaScript puros, sem o overhead do wrapper do Mongoose.
    return await PedidoModel.find({}).sort({ dataAbertura: -1 }).lean();
  }

  /**
   * Obtém um pedido específico pelo seu código identificador.
   * @param {string} id - Código único do pedido (ex: 'PED-123').
   * @returns {Promise<Object|null>} O pedido encontrado ou null.
   */
  async obterPedidoPorId(id) {
    return await PedidoModel.findOne({ id }).lean();
  }

  /**
   * Cria um novo pedido no banco de dados.
   * @param {Object} dadosPedido - Objeto com os dados do novo pedido.
   * @returns {Promise<Object>} O pedido criado.
   */
  async criarPedido(dadosPedido) {
    const novoPedido = new PedidoModel(dadosPedido);
    await novoPedido.save();
    return novoPedido.toObject();
  }

  /**
   * Atualiza campos específicos de um pedido existente.
   * @param {string} id - Código único do pedido.
   * @param {Object} dadosAtualizados - Campos a serem atualizados.
   * @returns {Promise<boolean>} Verdadeiro se atualizado com sucesso.
   */
  async atualizarPedido(id, dadosAtualizados) {
    const resultado = await PedidoModel.updateOne(
      { id },
      { $set: dadosAtualizados }
    );
    return resultado.matchedCount > 0;
  }

  /**
   * Remove um pedido pelo código identificador único.
   * @param {string} id - Código do pedido.
   * @returns {Promise<boolean>} Verdadeiro se excluído com sucesso.
   */
  async excluirPedido(id) {
    const resultado = await PedidoModel.deleteOne({ id });
    return resultado.deletedCount > 0;
  }
}
