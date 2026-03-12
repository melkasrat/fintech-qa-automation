import http from 'k6/http';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {

  const payload = JSON.stringify({
    from: "ACCOUNT_A",
    to: "ACCOUNT_B",
    amount: 50
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN',
      'Idempotency-Key': `${__VU}-${__ITER}`
    }
  };

  http.post('http://localhost:3000/transfer', payload, params);
}