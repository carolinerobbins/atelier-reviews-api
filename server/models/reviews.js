const pool = require('../db/db.js')

const models = {
  getReviews: (product_id) => {
    return pool.query(`SELECT * FROM reviews WHERE product_id = ${product_id};`)
  },

  getMeta: (product_id) => {
    let oneStarCount, twoStarCount, threeStarCount, fourStarCount, fiveStarCount;
    let recommendTrue, recommendFalse;
    let charNames;

    //get star rating counts
    return pool.query(`SELECT
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star_count,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star_count,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star_count,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star_count,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star_count
      FROM reviews
      WHERE product_id = ${product_id};`)
      .then(result => {
        oneStarCount = result.rows[0].one_star_count;
        twoStarCount = result.rows[0].two_star_count;
        threeStarCount = result.rows[0].three_star_count;
        fourStarCount = result.rows[0].four_star_count;
        fiveStarCount = result.rows[0].five_star_count;

        //get recommend counts
        return pool.query(`SELECT
          SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END) AS recommend_true,
          SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END) AS recommend_false
          FROM reviews
          WHERE product_id = ${product_id};`);
      })
      .then(result => {
        recommendTrue = result.rows[0].recommend_true;
        recommendFalse = result.rows[0].recommend_false;

        //get characteristics for specific product
        return pool.query(`SELECT * FROM characteristics WHERE product_id=${product_id}`);
      })
      .then(result => {
        charNames = result.rows;
        return {
          oneStarCount,
          twoStarCount,
          threeStarCount,
          fourStarCount,
          fiveStarCount,
          recommendTrue,
          recommendFalse,
          charNames
        };
      })
      .catch(error => console.error("Error fetching metadata: ", error));
  },
  postReview: (review) => {
    const { product_id, rating, summary, body, recommend, name, email } = review;
    const date = new Date().getTime();
    const reviewer_name = name;
    const reviewer_email = email;
    return pool.query(`INSERT INTO reviews (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, date) VALUES ('${product_id}', '${rating}', '${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', null, 0, ${date})`);
  },
  putHelpful: (review_id) => {
    return pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id=${review_id}`);
  },

  putReport: (review_id) => {
    return pool.query(`UPDATE reviews SET reported = true WHERE review_id=${review_id}`);
  }
}

module.exports = models;