const Product = require('../models/product');
const LoadProductService = require('../services/loadProductService');

module.exports = {
  async index(req, res) {
    try {
      let { filter, category } = req.query;

      if (!filter || filter.toLowerCase() == 'toda a loja') filter = null;

      let products = await Product.search({ filter, category });

      const productsPromise = products.map(LoadProductService.format); //é igual a (product => LoadProductService.format(product))

      products = await Promise.all(productsPromise);

      const search = {
        term: filter || 'Toda a loja',
        total: products.length,
      };

      const categories = products
        .map((product) => ({
          id: product.category_id,
          name: product.category_name,
        }))
        .reduce((categoriesFiltered, category) => {
          const found = categoriesFiltered.some((cat) => cat.id == category.id);
          if (!found) {
            categoriesFiltered.push(category);
          }
          return categoriesFiltered;
        }, []);

      return res.render('search/index', { products, search, categories });
    } catch (error) {
      console.error(error);
    }
  },
};
