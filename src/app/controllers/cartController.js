const Cart = require('../../lib/cart');
const loadProductsService = require('../services/loadProductService');

module.exports = {
  async index(req, res) {
    try {
      let { cart } = req.session;

      //gerenciador de carrinho
      cart = Cart.init(cart);

      return res.render('cart/index', { cart });
    } catch (error) {
      console.error(error);
    }
  },
  async addOne(req, res) {
    try {
      //pegar o id do produto e o produto
      const { id } = req.params;
      const product = await loadProductsService.load('product', { where: { id } });

      //pegar o carrinho da sessão
      let { cart } = req.session;

      //adicionar o produto ao carrinho (usando o gerenciador de carrinho)
      cart = Cart.init(cart).addOne(product);

      //atualizar o carrinho da sessão
      req.session.cart = cart;

      //redirecionar o usuário para a tela do carrinho
      return res.redirect('/cart');
    } catch (error) {
      console.error(error);
    }
  },
  removeOne(req, res) {
    try {
      //pegar o id do produto
      let { id } = req.params;

      //pegar o carrinho da sessão
      let { cart } = req.session;

      //se não tiver carrinho, retornar
      if (!cart) return res.redirect('/cart');

      //remove o produto ao carrinho (usando o gerenciador de carrinho)
      cart = Cart.init(cart).removeOne(id);

      //atualizar o carrinho da sessão
      req.session.cart = cart;

      //redirecionar o usuário para a tela do carrinho
      return res.redirect('/cart');
    } catch (error) {
      console.error(error);
    }
  },
  delete(req, res) {
    try {
      //pegar o id do produto
      let { id } = req.params;

      //pegar o carrinho da sessão
      let { cart } = req.session;

      //se não tiver carrinho, retornar
      if (!cart) return;

      //remove o produto ao carrinho (usando o gerenciador de carrinho) e atualiza o carrinho da sessão
      req.session.cart = Cart.init(cart).delete(id);

      //redirecionar o usuário para a tela do carrinho
      return res.redirect('/cart');
    } catch (error) {
      console.error(error);
    }
  },
};
