COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/carolinerobbins/hackreactor/senior/data_sdc/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews(id, characeristic_id, review_id, value)
FROM '/Users/carolinerobbins/hackreactor/senior/data_sdc/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, name)
FROM '/Users/carolinerobbins/hackreactor/senior/data_sdc/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY review_photos(id, review_id, url)
FROM '/Users/carolinerobbins/hackreactor/senior/data_sdc/reviews_photos.csv'
DELIMITER ','
CSV HEADER;