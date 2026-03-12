import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 20,
  duration: '20s',
};

export default function () {

  const payload = JSON.stringify({
    username: "admin",
    password: "1234"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const res = http.post('http://localhost:3000/login', payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200
  });

}
