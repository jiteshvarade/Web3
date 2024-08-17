const express = require('express');
const router = express.Router();
const {createAccount, getAccounts} = require("../controllers/dashboard");

router.get("/createAccount/:email",createAccount);
router.get("/getAccounts/:email",getAccounts);

module.exports = router;