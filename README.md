# Fintech QA Automation Project

This project simulates a fintech banking API and demonstrates QA testing techniques including:

• API functional testing  
• Security testing  
• Automation testing  
• Load testing  

## Technologies Used

- Node.js
- Express.js
- Playwright
- k6
- Postman

## API Features

- User authentication (JWT)
- Account creation
- Deposit & withdraw
- Money transfer
- Idempotency protection
- Transfer limit validation

## Automated Tests

Automation tests verify:

- login functionality
- account creation
- money transfer
- duplicate transaction protection
- transfer limits

## Load Testing

Load testing scripts simulate multiple users performing:

- login requests
- transfer transactions

## How to Run

Start API: node server.js

Run automation tests: npx playwright test

Run load tests: k6 run load-test.js


## Author

Melkamu – QA Engineer


