CREATE DATABASE reviews

CREATE TABLE reviews (
    product_id integer,
    rating integer,
    date bigint,
    summary text,
    body text,
    recommend boolean,
    reported boolean,
    reviewer_name varchar(255),
    reviewer_email varchar(255),
    response text,
    helpfulness integer,
    id bigserial,
    PRIMARY KEY (id)
);

CREATE TABLE reviews_photos (
  id bigserial,
  review_id bigint,
  url text,
  PRIMARY KEY (id)
)

ALTER TABLE reviews_photos
ADD CONSTRAINT fk_review_id
FOREIGN KEY (review_id)
REFERENCES reviews(id);

CREATE TABLE characteristics (
  id integer,
  product_id integer,
  name varchar(255),
  PRIMARY KEY (id)
)

CREATE TABLE characteristic_reviews (
  id integer,
  review_id bigint,
  characteristic_id integer,
  value integer,
  PRIMARY KEY (id)
)

ALTER TABLE characteristic_reviews
ADD CONSTRAINT fk_char_id
FOREIGN KEY (characteristic_id)
REFERENCES characteristics (id);

ALTER TABLE characteristic_reviews
ADD CONSTRAINT characteristic_reviews_review_id_fkey
FOREIGN KEY (review_id)
REFERENCES reviews(id)
ON DELETE CASCADE;

CREATE INDEX idx_product_id ON reviews (product_id);

CREATE INDEX idx_review_id ON reviews_photos (review_id);

CREATE INDEX idx_characteristic_reviews_review_id ON characteristic_reviews (review_id);

SELECT COUNT(DISTINCT product_id) AS unique_product_ids
FROM reviews;