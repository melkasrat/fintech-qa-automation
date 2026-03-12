import { test, expect } from '@playwright/test';

let token;
let accountA;
let accountB;

test('Login API', async ({ request }) => {

  const response = await request.post('http://localhost:3000/login', {
    data: {
      username: 'admin',
      password: '1234'
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  token = body.token;
});


test('Create Account A', async ({ request }) => {

  const response = await request.post('http://localhost:3000/createAccount', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      name: "UserA",
      initialDeposit: 2000
    }
  });

  const body = await response.json();
  accountA = body.accountNumber;

  expect(response.status()).toBe(200);
});


test('Create Account B', async ({ request }) => {

  const response = await request.post('http://localhost:3000/createAccount', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      name: "UserB",
      initialDeposit: 500
    }
  });

  const body = await response.json();
  accountB = body.accountNumber;

  expect(response.status()).toBe(200);
});


test('Transfer Money', async ({ request }) => {

  const response = await request.post('http://localhost:3000/transfer', {

    headers: {
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": "tx-100"
    },

    data: {
      from: accountA,
      to: accountB,
      amount: 300
    }
  });

  expect(response.status()).toBe(200);
});


test('Duplicate Transfer Blocked', async ({ request }) => {

  const response = await request.post('http://localhost:3000/transfer', {

    headers: {
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": "tx-100"
    },

    data: {
      from: accountA,
      to: accountB,
      amount: 300
    }
  });

  expect(response.status()).toBe(409);
});


test('Transfer Limit Test', async ({ request }) => {

  const response = await request.post('http://localhost:3000/transfer', {

    headers: {
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": "tx-200"
    },

    data: {
      from: accountA,
      to: accountB,
      amount: 6000
    }
  });

  expect(response.status()).toBe(403);
});