import express from "express";
import transactionServices from "./transaction.services.js";
import authorizeJwt from "../middleware/authorizeJWT.js";
import adminAuthorization from "../middleware/adminAuthorization.js";

const router = express.Router();

router.post("/borrow", authorizeJwt, async (req, res) => {
  try {
    let userId = req.userId;
    let { itemId, quantityBorrowed } = req.body;
    let newTransaction = await transactionServices.borrowItem(
      userId,
      itemId,
      quantityBorrowed
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/", adminAuthorization, async (req, res) => {
  try {
    let transactions = await transactionServices.getAllTransactions();
    res.send(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/user", authorizeJwt, async (req, res) => {
  let userId = req.userId;
  try {
    let transactions = await transactionServices.getTransactionsByUserId(
      userId
    );
    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.patch("/verify/:transactionId", adminAuthorization, async (req, res) => {
  try {
    let { transactionId } = req.params;
    let { status } = req.body;
    await transactionServices.verifyTransaction(transactionId, status);
    res.status(200).json({ message: "Transaction verified successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/return/:transactionId", authorizeJwt, async (req, res) => {
  try {
    let { transactionId } = req.params;
    let userId = req.userId;

    let transaction = await transactionServices.getTransactionsById(
      transactionId
    );
    if (transaction.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await transactionServices.returnItem(transactionId);
    res.status(200).json({ message: "Item returned" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
