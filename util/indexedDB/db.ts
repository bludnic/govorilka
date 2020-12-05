import { openDB } from 'idb';

// indexedDB is not supported on server side
const db = process.browser
    ? openDB('govorilka', 1, {
          upgrade(database) {
              // Create a store of objects
              const store = database.createObjectStore('books', {
                  // The 'id' property of the object will be the key.
                  keyPath: 'id',
                  // If it isn't explicitly set, create a value by auto incrementing.
                  autoIncrement: true,
              });
              // Create an index on the 'date' property of the objects.
              store.createIndex('importedAt', 'importedAt');
          },
      })
    : null;

export function DB() {
    return db;
}
