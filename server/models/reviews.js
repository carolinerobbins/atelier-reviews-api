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
      console.log(reviewsWithPhotos);

      return reviewsWithPhotos;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getMeta: (product_id) => {
    let oneStarCount,
      twoStarCount,
      threeStarCount,
      fourStarCount,
      fiveStarCount;
    let recommendTrue, recommendFalse;
    let charNames;

    //get star rating counts
    return pool
      .query(
        `SELECT
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star_count,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star_count,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star_count,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star_count,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star_count
      FROM reviews
      WHERE product_id = ${product_id};`
      )
      .then((result) => {
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
      .then((result) => {
        recommendTrue = result.rows[0].recommend_true;
        recommendFalse = result.rows[0].recommend_false;

        //get characteristics for specific product
        return pool.query(`SELECT ch.name AS name, AVG(cr.value) AS average_value, ch.id
        FROM characteristics AS ch
        JOIN characteristic_reviews AS cr ON cr.characteristic_id = ch.id
        JOIN reviews AS r ON cr.review_id = r.id
        WHERE r.product_id = '${product_id}'
          AND ch.product_id = '${product_id}'
        GROUP BY ch.name, ch.id;`);
      })
      .then((result) => {
        charNames = result.rows;
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
      })
      .catch((error) => console.error(error));
  },
  postReview: (review) => {
    const { product_id, rating, summary, body, recommend, name, email } =
      review;
    console.log(review);
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
      `INSERT INTO reviews_photos (review_id, url) VALUES (${review_id}, '${url}') RETURNING id`
    );
  },
};

module.exports = models;
