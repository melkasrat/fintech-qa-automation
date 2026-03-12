const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "fintech-secret";

let accounts = {};
//let accounts = {};
let transactions = {};

// LOGIN
app.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });

});


// AUTH MIDDLEWARE
function authenticate(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, user) => {

    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();

  });

}


// CREATE ACCOUNT
app.post("/createAccount", authenticate, (req, res) => {

  const { name, initialDeposit } = req.body;

  const accountNumber = Date.now().toString();

  accounts[accountNumber] = {
    name,
    balance: initialDeposit
  };

  res.json({
    accountNumber,
    balance: initialDeposit
  });

});


// CHECK BALANCE
app.get("/balance/:id", authenticate, (req, res) => {

  const account = accounts[req.params.id];

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.json(account);

});


//Deposite
app.post("/deposit", authenticate, (req, res) => {

  const { accountNumber, amount } = req.body;

  const account = accounts[accountNumber];

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  account.balance += amount;

  res.json({
    message: "Deposit successful",
    balance: account.balance
  });

});

//Withdraw
app.post("/withdraw", authenticate, (req, res) => {

  const { accountNumber, amount } = req.body;

  const account = accounts[accountNumber];

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (account.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  account.balance -= amount;

  res.json({
    message: "Withdraw successful",
    balance: account.balance
  });

});

//Transfer
app.post("/transfer", authenticate, (req, res) => {

  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({ message: "Missing idempotency key" });
  }

  if (transactions[idempotencyKey]) {
    return res.status(409).json({ message: "Duplicate transaction" });
  }

  const { from, to, amount } = req.body;

  const sender = accounts[from];
  const receiver = accounts[to];

  if (!sender || !receiver) {
    return res.status(404).json({ message: "Account not found" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (amount > 5000) {
    return res.status(403).json({ message: "Transfer limit exceeded" });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  sender.balance -= amount;
  receiver.balance += amount;

  transactions[idempotencyKey] = true;

  res.json({
    message: "Transfer successful"
  });

});


app.listen(3000, () => {
  console.log("Fintech API running on port 3000");
});