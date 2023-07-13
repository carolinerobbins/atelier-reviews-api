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
        results: data.rows 
      }
      res.send(final);
    } catch (err) {
      res.sendStatus(501);
    }
  },
  getMeta: async (req,res) => {
    try {
      const { product_id } = req.query;
      const data = await models.getMeta(product_id);
      let final = {
        product_id: product_id,
        ratings: {},
        recommended: {},
        characteristics: {}
      }
      res.send(final);
    } catch (err) {
      res.sendStatus(501);
    }
  },
  postReview: async (req, res) => {
    try {
      const data = await models.postReview(req.query);
      console.log(data);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(501);
    }
  },
  putHelpful: async (req,res) => {
    try {
      const data = await models.putHelpful(req.params.id);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(204);
    }
  },
  putReport: async (req,res) => {
    try {
      const data = await models.putReport(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      res.sendStatus(501);
    }
  }
}

module.exports = controllers;