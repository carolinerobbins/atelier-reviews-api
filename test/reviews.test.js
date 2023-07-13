const chai = require("chai");
const expect = chai.expect;
const app = require("../server/index.js");
const request = require("supertest")(app);

const reviewData = {
  product_id: "40346",
  rating: 5,
  summary: "You should buy Slacker Slacks instead",
  body: "testing out my post request for SDC",
  recommend: true,
  reported: false,
  reviewer_name: "caroline",
  reviewer_email: "test@testing.com",
  helpfulness: 0,
};

describe("GET /reviews", function () {
  it("returns all reviews for a specified product id", async function () {
    const productId = 40345;

    const response = await request
      .get("/reviews")
      .query({ product_id: productId });

    const responseJson = JSON.parse(response.text);
    const product = responseJson.product;
    const reviews = responseJson.results;

    expect(product).to.eql("40345");
    expect(reviews.length).to.eql(6);
    expect(response.status).to.eql(200);
  });
});

describe("GET /reviews/meta", function () {
  it("returns metadata for specific product id", async function () {
    const productId = 40345;

    const response = await request
      .get("/reviews/meta")
      .query({ product_id: productId });
    const responseJson = JSON.parse(response.text);

    expect(responseJson.product_id).to.eql("40345");
    expect(responseJson.ratings["1"]).to.eql("3");
    expect(responseJson.recommended[true]).to.eql("3");
    expect(responseJson.characteristics).to.have.property("Fit");
    expect(response.status).to.eql(200);
  });
});

describe("POST /reviews", function () {
  it("returns 201 created", async function () {
    const response = await request.post("/reviews").query(reviewData);

    expect(response.status).to.eql(201);
  }),
    it("increase review size by 1 after submitting a new review", async function () {
      const productId = 40346;

      const preResponse = await request
        .get("/reviews")
        .query({ product_id: productId });

      const preJSON = JSON.parse(preResponse.text);
      const preSize = preJSON.results.length;

      const response = await request.post("/reviews").query(reviewData);

      const postResponse = await request
        .get("/reviews")
        .query({ product_id: productId });

      const postJSON = JSON.parse(postResponse.text);
      const postSize = postJSON.results.length;

      expect(postSize).to.eql(preSize + 1);
      expect(response.status).to.eql(201);
    });
});

describe("PUT /reviews/:reviewid/helpfulness", function () {
  it("increases helpfulness by 1", async function () {
    const productId = 40346;
    const reviewId = 232066;

    const preResponse = await request
      .get("/reviews")
      .query({ product_id: productId });

    const preJSON = JSON.parse(preResponse.text);
    const preCount = preJSON.results.helpfulness;

    const response = await request.put(`/reviews/${reviewId}/helpful`);

    const postResponse = await request
      .get("/reviews")
      .query({ product_id: productId });

    const postJSON = JSON.parse(postResponse.text);
    const postCount = postJSON.results;

    expect(response.status).to.eql(204);
  });
});

describe("PUT /reviews/:reviewid/reported", function () {
  it("changes reported to true", async function () {
    const productId = 40346;
    const reviewId = 232066;

    const preResponse = await request
      .get("/reviews")
      .query({ product_id: productId });

    const preJSON = JSON.parse(preResponse.text);
    const preCount = preJSON.results;

    const response = await request.put(`/reviews/${reviewId}/report`);

    const postResponse = await request
      .get("/reviews")
      .query({ product_id: productId });

    const postJSON = JSON.parse(postResponse.text);
    const postCount = postJSON.results;

    expect(response.status).to.eql(204);
  });
});
