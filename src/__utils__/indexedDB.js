import { DB_NAME, DB_SCHEMA_NETWORK } from '../constants/global';

const open = (name, version) => {
  const db = window.indexedDB.open(name, version);
  return db;
};

let db = null;
const dbRequest = open(DB_NAME, 1);
dbRequest.onsuccess = (event) => { db = event.target.result; };
dbRequest.onerror = (error) => { console.error(error); };
dbRequest.onupgradeneeded = (event) => {
  event.target.result.createObjectStore(DB_SCHEMA_NETWORK, { autoIncrement: true });
};

export const addNetwork = (data = []) => {
  if (db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    data.forEach((d) => {
      const result = dbStore.add(d);
      result.onerror = (err) => {
        console.error(err);
      };
    });
  }
};

export const queryAllNetwork = () => {
  const queryPromise = new Promise((resolve, reject) => {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    if (db) {
      dbStore.getAll().onsuccess = (event) => {
        resolve(event.target.result.reverse());
      };
    } else {
      reject(new Error('DataBase is not initialized.'));
    }
  });
  return queryPromise;
};
