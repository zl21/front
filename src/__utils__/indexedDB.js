import { DB_NAME, DB_SCHEMA_NETWORK, ENABLE_NETWORK_MONITOR, SLOW_NETWORK_THRESHOLD } from '../constants/global';

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
    const objectStore = event.target.result.createObjectStore(DB_SCHEMA_NETWORK, { autoIncrement: true });
    objectStore.createIndex('timecost', 'timecost', { unique: false });
    objectStore.createIndex('recordDateTime', 'recordDateTime', { unique: false });
  };
};

export const addNetwork = (data = []) => {
  if (ENABLE_NETWORK_MONITOR && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    data.forEach((d) => {
      if (d.timecost >= SLOW_NETWORK_THRESHOLD) {
        const result = dbStore.add(Object.assign({}, d, { recordDateTime: new Date(new Date().toDateString()).getTime() }));
        result.onerror = (err) => {
          console.error(err);
        };
      }
    });
  }
};

export const queryAllNetwork = () => new Promise((resolve, reject) => {
  if (ENABLE_NETWORK_MONITOR && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    const timeCostKeyRange = IDBKeyRange.lowerBound(SLOW_NETWORK_THRESHOLD);
    dbStore.index('timecost').getAll(timeCostKeyRange).onsuccess = (event) => {
      resolve(event.target.result.reverse());
    };
  } else if (ENABLE_NETWORK_MONITOR) {
    reject(new Error('DataBase is not initialized.'));
  } else {
    reject(new Error('DataBase is not available at this moment.'));
  }
});

export const emptyOtherDayRecord = () => new Promise((resolve, reject) => {
  if (ENABLE_NETWORK_MONITOR && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    const recordDateTimeKeyRange = IDBKeyRange.upperBound(new Date(new Date().toDateString()).getTime(), true);
    const deleteTask = dbStore.index('recordDateTime').objectStore.delete(recordDateTimeKeyRange);
    deleteTask.onsuccess = (event) => {
      resolve(event);
    };
    deleteTask.onerror = (event) => {
      reject(event);
    };
  }
});

if (ENABLE_NETWORK_MONITOR) {
  initDB();
}
