import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = 'http://localhost:3001';

function getRandomProductId(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export let options = {
  stages: [
    { duration: '10s', target: 1 },    // 1 RPS
    { duration: '20s', target: 10 },   // 10 RPS
    { duration: '30s', target: 100 },  // 100 RPS
    { duration: '1m', target: 1000 },  // 1000 RPS
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // Latency should be below 500ms
    http_req_failed: ['rate<0.1'],     // Error rate should be below 10%
  },
};

export default function () {
  const productId = getRandomProductId(1, 5000);

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
