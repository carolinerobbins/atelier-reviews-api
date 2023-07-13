const pool = require('../db/db.js')

const models = {
  getReviews: (product_id) => {
    return pool.query(`SELECT * FROM reviews WHERE product_id = ${product_id};`)
  },
  
  getMeta: (product_id) => {

  },
  postReview: (review) => {
    const { product_id, rating, summary, body, recommend, name, email } = review;
    const date = new Date().getTime();
    const reviewer_name = name;
    const reviewer_email = email;
    return pool.query(`INSERT INTO reviews (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, date) VALUES ('${product_id}', '${rating}', '${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', null, 0, ${date})`);
  },
  putHelpful: (review_id) => {

  },
  putReport: (review_id) => {

  }
}

module.exports = models;