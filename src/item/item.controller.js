import express from "express";
import itemServices from "./item.services.js";
import authorizeJwt from "../middleware/authorizeJWT.js";
import adminAuthorization from "../middleware/adminAuthorization.js";

const router = express.Router();

router.post("/", adminAuthorization, async (req, res) => {
 try {
   let newItemData = req.body;
   let newItem = await itemServices.createItem(newItemData);
   res.status(201).json(newItem);
 } catch (error) {
   res.status(400).send(error.message);
 }
});

router.get("/", authorizeJwt, async (req, res) => {
 try {
   let items = await itemServices.getAllItems();
   res.status(200).send(items);
 } catch (error) {
   res.status(500).send(error.message);
 }
});

router.get("/:id", authorizeJwt, async (req, res) => {
 try {
   let itemId = parseInt(req.params.id);
   let item = await itemServices.getItemById(itemId);
   res.status(200).send(item);
 } catch (error) {
   res.status(400).send(error.message);
 }
});

router.put("/:id", adminAuthorization, async (req, res) => {
 try {
   let itemId = req.params.id;
   let itemData = req.body;
   let updatedItem = await itemServices.editItemById(itemId, itemData);
   res.send(updatedItem);
 } catch (error) {
   res.status(400).send(error.message);
 }
});

router.delete("/:id", adminAuthorization, async (req, res) => {
 try {
   let itemId = req.params.id;
   await itemServices.deleteItemById(itemId);
   res.status(204).json({ message: "item deleted" });
 } catch (error) {
   res.status(400).send(error.message);
 }
});

export default router;