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
      const query = `
        SELECT
          json_build_object(
            'product_id', ${product_id},
            'ratings', json_build_object(
              '1', SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END),
              '2', SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END),
              '3', SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END),
              '4', SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END),
              '5', SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END)
            ),
            'recommended', json_build_object(
              'true', SUM(CASE WHEN recommend = true THEN 1 ELSE 0 END),
              'false', SUM(CASE WHEN recommend = false THEN 1 ELSE 0 END)
            ),
            'characteristics', json_object_agg(
              ch.name,
              json_build_object(
                'id', ch.id,
                'value', AVG(cr.value)
              )
            )
          ) AS meta
        FROM reviews r
        LEFT JOIN characteristic_reviews cr ON cr.review_id = r.id
        LEFT JOIN characteristics ch ON ch.id = cr.characteristic_id
        WHERE r.product_id = ${product_id}
        GROUP BY r.product_id;
      `;

      const queryResult = await pool.query(query);
      const { meta } = queryResult.rows[0];
      console.log(meta);
      return meta;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getMeta: async (product_id) => {
    try {
      const query = `
        SELECT
          product_id,
          json_build_object(
            '1', one_star_count,
            '2', two_star_count,
            '3', three_star_count,
            '4', four_star_count,
            '5', five_star_count
          ) AS ratings,
          json_build_object(
            'true', recommend_true,
            'false', recommend_false
          ) AS recommended,
          characteristic_data
        FROM meta_aggregations
        WHERE product_id = ${product_id};
      `;

      const queryResult = await pool.query(query);
      const meta = queryResult.rows[0];

      return meta;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
