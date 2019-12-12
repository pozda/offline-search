// @flow
import Dexie from "dexie";

const db = new Dexie("ProductCatalog");

db.version(1).stores({
  products: "SKU, name, keywords, description, image",
  lastDataSync: "date"
});

db.open().catch(function(e) {
  console.error("Open failed: " + e);
});

export default db;
