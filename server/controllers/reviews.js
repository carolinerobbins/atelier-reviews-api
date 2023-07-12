const models = require("../models/reviews");

const controllers = {
  getReviews: async (req,res) => {
    try {
      const data = await models.getReviews();
      let final = {
        product: req.params.product_id,
        page: req.params.page || 0,
        count: req.params.count || 5,
        results: data //check if array
      }
      res.send(final);
    } catch (err) {
      res.sendStatus(501);
    }
  },
  getMeta: (req,res) => {
    try {
      const data = await models.getMeta();
      let final = {
        product_id: req.params.product_id,
        ratings: {},
        recommended: {},
        characteristics: {}
      }
      res.send(data);
    } catch (err) {
      res.sendStatus(501);
    }
  },
  postReview: async (req, res) => {
    try {
      const data = await models.postReview(req.body);
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