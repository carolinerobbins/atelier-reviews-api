const models = require("../models/reviews");

const controllers = {
  getReviews: async (req,res) => {
    try {
      const { product_id, page = 0, count = 5 } = req.query;
      const data = await models.getReviews(product_id);
      let final = {
        product: product_id,
        page: parseInt(page) || 0,
        count: parseInt(count) || 5,
        results: data
      }
      res.send(final);
    } catch (err) {
      res.status(501).send('Cannot get reivews')
    }
  },
  getMeta: async (req,res) => {
    try {
      const { product_id } = req.query;
      const data = await models.getMeta(product_id);
      res.send(data);
    } catch (err) {
      res.status(501).send('Cannot get meta review data')
    }
  },
  postReview: async (req, res) => {
    try {
      const { characteristics, url } = req.query;
      const data = await models.postReview(req.query);
      let review_id = data.rows[0].id;
      const photos = await models.postPhotos(review_id, url);
      const chars = await models.postChars(review_id, characteristics);
      res.sendStatus(201);
    } catch (err) {
      console.error(err)
      res.sendStatus(501);
    }
  },
  putHelpful: async (req,res) => {
    try {
      const data = await models.putHelpful(req.params.review_id);
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(501);
    }
  },
  putReport: async (req,res) => {
    try {
      const data = await models.putReport(req.params.review_id);
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(501);
    }
  }
}

module.exports = controllers;
