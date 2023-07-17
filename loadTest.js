import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = 'http://localhost:3001';

function getRandomProductId(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}

export let options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '20s', target: 10 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 1000 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const productId = getRandomProductId(1, 950072);

  let getReviewsRes = http.get(`${BASE_URL}/reviews?product_id=${productId}`);
  check(getReviewsRes, {
    'getReviews status is 200': (res) => res.status === 200,
  });


  let getMetaRes = http.get(`${BASE_URL}/reviews/meta?product_id=${productId}`);
  check(getMetaRes, {
    'getMeta status is 200': (res) => res.status === 200,
  });

  sleep(1);
}
