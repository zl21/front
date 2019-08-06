import { DB_NAME, DB_SCHEMA_NETWORK, ENABLE_NETWORK_MONITOR } from '../constants/global';

const open = (name, version) => {
  const db = window.indexedDB.open(name, version);
  return db;
};

let db = null;

const initDB = () => {
  const dbRequest = open(DB_NAME, 1);
  dbRequest.onsuccess = (event) => { db = event.target.result; };
  dbRequest.onerror = (error) => { console.error(error); };
  dbRequest.onupgradeneeded = (event) => {
    event.target.result.createObjectStore(DB_SCHEMA_NETWORK, { autoIncrement: true });
  };
};

export const addNetwork = (data = []) => {
  if (ENABLE_NETWORK_MONITOR && db) {
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

export const queryAllNetwork = () => new Promise((resolve, reject) => {
  if (ENABLE_NETWORK_MONITOR && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    dbStore.getAll(undefined, 10).onsuccess = (event) => {
      resolve(event.target.result.reverse());
    };
  } else {
    if (ENABLE_NETWORK_MONITOR) {
      reject(new Error('DataBase is not initialized.'));
    } else {
      reject(new Error('DataBase is not available at this moment.'));
    }
  }
});

if (ENABLE_NETWORK_MONITOR) {
  initDB();
}
