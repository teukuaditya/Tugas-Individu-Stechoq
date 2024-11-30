import prisma from '../db/index.js';  // Mengimpor prisma dari db.js
import transactionRepository from './transaction.repository.js'; // pastikan menggunakan .js
import itemRepository from '../item/item.repository.js';  // pastikan menggunakan .js

async function borrowItem(userId, itemId, quantityBorrowed) {
  let newTransaction = await transactionRepository.createTransaction(
    userId,
    itemId,
    quantityBorrowed
  );
  return newTransaction;
}

async function getAllTransactions() {
  let transactions = await transactionRepository.findTransactions();
  return transactions;
}

async function getTransactionsByUserId(userId) {
  let transactions = await transactionRepository.findTransactionsByUserId(
    userId
  );
  return transactions;
}

async function getTransactionsById(transactionId) {
  let transaction = await transactionRepository.findTransactionById(
    transactionId
  );
  return transaction;
}

async function verifyTransaction(transactionId, status) {
  let transaction = await transactionRepository.findTransactionById(
    transactionId
  );
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await transactionRepository.updateTransactionStatus(
    transactionId,
    status,
    status === "BORROWED" ? "borrowedAt" : null
  );

  if (status === "BORROWED") {
    let item = await itemRepository.findItemById(transaction.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    let newQuantity = item.quantity - transaction.quantityBorrowed;
    if (newQuantity < 0) {
      throw new Error("Insufficient quantity");
    }

    await itemRepository.updateItemQuantity(item.id, newQuantity);
  }
}

async function returnItem(transactionId) {
  let transaction = await transactionRepository.findTransactionById(
    transactionId
  );

  if (!transaction) {
    throw new Error("Transaction not found");
  }
  if (transaction.status !== "BORROWED") {
    throw new Error("Cannot return item. Transaction status is not BORROWED");
  }

  await transactionRepository.updateTransactionStatus(
    transactionId,
    "RETURNED",
    "returnedAt"
  );

  let item = await itemRepository.findItemById(transaction.itemId);
  let newQuantity = item.quantity + transaction.quantityBorrowed;
  await itemRepository.updateItemQuantity(item.id, newQuantity);
}

export default {
  borrowItem,
  getAllTransactions,
  getTransactionsByUserId,
  getTransactionsById,
  verifyTransaction,
  returnItem,
};
