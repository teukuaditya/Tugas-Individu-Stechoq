import itemRepository from "./item.repository.js";

async function createItem(newItemData) {
 let newItem = await itemRepository.insertItem(newItemData);
 return newItem;
}

async function getAllItems() {
 let items = await itemRepository.findItems();
 return items;
}

async function getItemById(id) {
 let item = await itemRepository.findItemById(id);
 if (!item) {
   throw Error("Item not found");
 }
 return item;
}

async function editItemById(id, itemData) {
 await getItemById(id);
 let updatedItem = await itemRepository.editItem(id, itemData);
 return updatedItem;
}

async function deleteItemById(id) {
 await getItemById(id);
 await itemRepository.deleteItem(id);
}

export default {
 createItem,
 getAllItems,
 getItemById,
 editItemById,
 deleteItemById,
};