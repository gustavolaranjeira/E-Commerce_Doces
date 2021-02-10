const loadProductService = require('../services/loadProductService');
const User = require('../models/user');

const mailer = require('../../lib/mailer');
const { product } = require('../services/loadProductService');

const email = (seller, product, buyer) => `
<h2>Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto</p>
<p>Produto: ${product.name}</p>
<p>Produto: ${product.formattedPrice}</p>
<p><br/><br/></p>
<h3>Dados do comprador</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address}</p>
<p>${buyer.cep}</p>
<p><br/><br/></p>
<p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
<p><br/><br/></p>
<p>Atenciosamente, Equipe da Loja Gustavo</p>
`;

module.exports = {
  async post(req, res) {
    try {
      // pegar os dados do produto
      const product = await loadProductService.load('product', { where: { id: req.body.id } });

      // os dados do vendedor
      const seller = await User.findOne({ where: { id: product.user_id } });

      // os dados do comprador
      const buyer = await User.findOne({ where: { id: req.session.userId } });

      // enviar email com dados da compra para o vendedor
      await mailer.sendMail({
        to: seller.email,
        from: 'no-replay@lojagustavo.com.br',
        subject: 'Novo pedido de compra.',
        html: email(seller, product, buyer),
      });

      // notificar o usuario com alguma mensagem de sucesso
      return res.render('orders/success');
    } catch (error) {
      console.error(error);
      return res.render('orders/error');
    }
  },
};
