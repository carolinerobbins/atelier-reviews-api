const pool = require("../db/db.js");

const models = {
  getReviews: async (product_id) => {
    try {
      const result = await pool.query(`SELECT
        reviews.*,
        COALESCE(
          (
            SELECT json_agg(reviews_photos) AS photos
            FROM reviews_photos
            WHERE reviews_photos.review_id = reviews.id
          ),
          '[]'
        ) AS photos
      FROM reviews
      WHERE reviews.product_id = ${product_id};
    `);
      const reviewsWithPhotos = result.rows;
      return reviewsWithPhotos;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getMeta: async (product_id) => {
    try {
      let oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount;
      let recommendTrue, recommendFalse;
      let charObj;
      console.log('inside models');
      //get star rating counts and recommend counts
      const ratingQueryResult = await pool.query(
        `SELECT
          SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star_count,
          SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star_count,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star_count,
          SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star_count,
          SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star_count,
          SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END) AS recommend_true,
          SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END) AS recommend_false
          FROM reviews
          WHERE product_id = ${product_id};`
      );
      console.log(ratingQueryResult.rows);

      oneStarCount = ratingQueryResult.rows[0].one_star_count;
      twoStarCount = ratingQueryResult.rows[0].two_star_count;
      threeStarCount = ratingQueryResult.rows[0].three_star_count;
      fourStarCount = ratingQueryResult.rows[0].four_star_count;
      fiveStarCount = ratingQueryResult.rows[0].five_star_count;
      recommendTrue = ratingQueryResult.rows[0].recommend_true;
      recommendFalse = ratingQueryResult.rows[0].recommend_false;

      //get characteristics for specific product and avg value
      const charQueryResult = await pool.query(`
        SELECT ch.name AS name, AVG(cr.value) AS average_value, ch.id
        FROM characteristics AS ch
        JOIN characteristic_reviews AS cr ON cr.characteristic_id = ch.id
        JOIN reviews AS r ON cr.review_id = r.id
        WHERE r.product_id = '${product_id}'
          AND ch.product_id = '${product_id}'
        GROUP BY ch.name, ch.id;
      `);
      console.log(charQueryResult.rows);

      const charNames = charQueryResult.rows;
      charObj = {};
      charNames.forEach((char) => {
        charObj[char.name] = {
          id: char.id,
          value: char.average_value,
        };
      });

      return {
        oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount,
        recommendTrue,
        recommendFalse,
        charObj,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  postReview: (review) => {
    const { product_id, rating, summary, body, recommend, name, email } =
      review;
    const date = new Date().getTime();
    const reviewer_name = name;
    const reviewer_email = email;

    return pool.query(
      `INSERT INTO reviews (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness, date) VALUES ('${product_id}', '${rating}', '${summary}', '${body}', ${recommend}, false, '${reviewer_name}', '${reviewer_email}', null, 0, ${date}) RETURNING id`
    );
  },
  putHelpful: (review_id) => {
    return pool.query(
      `UPDATE reviews SET helpfulness = (helpfulness + 1) WHERE id='${review_id}'`
    );
  },

  putReport: (review_id) => {
    return pool.query(
      `UPDATE reviews SET reported = true WHERE id='${review_id}'`
    );
  },

  postPhotos: (review_id, url) => {
    return pool.query(
      `INSERT INTO reviews_photos (review_id, url) VALUES (${review_id}, '${url}')`
    );
  },

  postChars: (review_id, characteristics) => {
    const promises = characteristics.map(({ name, value }) => {
      return pool.query(
        `INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
        VALUES ((SELECT id FROM characteristics WHERE name = '${name}'
        AND product_id = (SELECT product_id FROM reviews WHERE review_id = ${review_id})),
        ${review_id},
        ${value})`
        );
    });

    return Promise.all(promises);
  }
};

module.exports = models;
