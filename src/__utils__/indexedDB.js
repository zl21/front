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
      const result = dbStore.add(Object.assign({}, d, { recordDateTime: Date.now() }));
      result.onerror = (err) => {
        console.error(err);
      };
    });
  }
};

export const queryAllNetwork = (threshold = SLOW_NETWORK_THRESHOLD) => new Promise((resolve, reject) => {
  if (ENABLE_NETWORK_MONITOR && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    const timeCostKeyRange = IDBKeyRange.lowerBound(threshold);
    const timeCostCursor = dbStore.index('timecost').openCursor(timeCostKeyRange);
    const data = [];
    timeCostCursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        data.push(cursor.value);
        cursor.continue();
      } else {
        console.log(data.map((d) => d.reqTimeString));
        resolve(data);
      }
    };
    dbStore.index('timecost').getAll(timeCostKeyRange).onsuccess = (event) => {
      resolve(event.target.result.reverse());
    };
  } else if (ENABLE_NETWORK_MONITOR) {
    reject(new Error('DataBase is not initialized.'));
  } else {
    reject(new Error('DataBase is not available at this moment.'));
  }
});

export const emptyOtherDayRecord = (interval) => new Promise((resolve, reject) => {
  if (ENABLE_NETWORK_MONITOR && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    const recordDateTimeKeyRange = IDBKeyRange.upperBound(new Date(new Date().toDateString()).getTime(), true);
    const recordDateTimeCursor = dbStore.index('recordDateTime').openCursor(recordDateTimeKeyRange);
    recordDateTimeCursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve(event);
      }
    };
    recordDateTimeCursor.onerror = (event) => {
      reject(event);
    };
  }
});

if (ENABLE_NETWORK_MONITOR) {
  initDB();
}
