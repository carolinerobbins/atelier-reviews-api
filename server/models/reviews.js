const pool = require('../db/db.js')

const models = {
  getReviews: (product_id) => {
    return pool.query(`SELECT * FROM reviews WHERE product_id = ${product_id};`)
  },
  getMeta: (product_id) => {

  },
  postReview: (review) => {

  },
  putHelpful: (review_id) => {

  },
  putReport: (review_id) => {

  }
}

module.exports = models;