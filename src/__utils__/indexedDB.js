import {
  DB_NAME, DB_SCHEMA_NETWORK, ENABLE_NETWORK_MONITOR, SLOW_NETWORK_THRESHOLD, dateStorageTime 
} from '../constants/global';

const open = (name, version) => window.indexedDB.open(name, version);

let db = null;
const initDB = () => {
  const dbRequest = open(DB_NAME, 1);
  dbRequest.onsuccess = (event) => { db = event.target.result; };
  dbRequest.onerror = (error) => { console.error(error); };
  dbRequest.onupgradeneeded = (event) => {
    // 创建search表  设置R3UserId为主键
    const store = event.target.result.createObjectStore('search', { keyPath: 'R3UserId' });

    const objectStore = event.target.result.createObjectStore(DB_SCHEMA_NETWORK, { autoIncrement: true });
    objectStore.createIndex('timecost', 'timecost', { unique: false });
    objectStore.createIndex('recordDateTime', 'recordDateTime', { unique: false });
  };
};

export const addNetwork = (data = []) => {
  if (ENABLE_NETWORK_MONITOR() && db) {
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
  if (ENABLE_NETWORK_MONITOR() && db) {
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
        resolve(data);
      }
    };
    timeCostCursor.onerror = (event) => {
      reject(event);
    };
  } else if (ENABLE_NETWORK_MONITOR()) {
    reject(new Error('DataBase is not initialized.'));
  } else {
    reject(new Error('DataBase is not available at this moment.'));
  }
});

export const emptyRecord = (interval = new Date(new Date().toDateString()).getTime()) => (ENABLE_NETWORK_MONITOR() ? new Promise((resolve, reject) => {
  if (ENABLE_NETWORK_MONITOR() && db) {
    const transaction = db.transaction([DB_SCHEMA_NETWORK], 'readwrite');
    const dbStore = transaction.objectStore(DB_SCHEMA_NETWORK);
    const recordDateTimeKeyRange = IDBKeyRange.upperBound(interval, true);
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
  } else {
    console.warn(`DataBase is not available at this moment. ENABLE_NETWORK_MONITOR = ${ENABLE_NETWORK_MONITOR()}, db = ${db}`);
    resolve();
    // reject(new Error(`DataBase is not available at this moment. ENABLE_NETWORK_MONITOR = ${ENABLE_NETWORK_MONITOR()}, db = ${db}`));
  }
}) : () => {});


// 新增查询条件
export const addSearch = (data = {}) => {
  if (db) {
    const transaction = db.transaction('search', 'readwrite');
    const dbStore = transaction.objectStore('search');
    dbStore.get(data.R3UserId).onsuccess = (event) => {
      const result = event.target.result;
      if (result) {
        dbStore.put(Object.assign({}, data, { createTime: Date.now() })).onsuccess = (event) => {
          // console.log(event.target.result);
        };
      } else {
        dbStore.add(Object.assign({}, data, { createTime: Date.now() })).onerror = (err) => {
          console.error(err);
        };
      }
    };   
  }
};

// 查询存储条件
export const querySearch = async (R3UserId = null) => new Promise((resolve, reject) => {
  if (db) {
    const transaction = db.transaction('search', 'readwrite');
    const dbStore = transaction.objectStore('search').get(R3UserId);
    dbStore.onsuccess = (event) => {
      const result = event.target.result;
      if (!result) {
        resolve(result);
        return;
      }
      if (new Date() - result.createTime >= (Number(dateStorageTime() ? dateStorageTime() : 1) * 24 * 1000 * 60 * 60)) {
        transaction.objectStore('search').delete(R3UserId);
        resolve(null);
      } else {
        delete result.R3UserId;
        delete result.createTime;
        resolve(result);
      }
    };
    dbStore.onerror = (event) => {
      reject(event);
    };
  } else {
    reject(new Error('DataBase is not available at this moment.'));
  }
});


// 清空七天前的查询条件
export const emptySearch = (interval = new Date(new Date().toDateString()).getTime()) => new Promise((resolve, reject) => {
  if (db) {
    const transaction = db.transaction(['search'], 'readwrite');
    const dbStore = transaction.objectStore('search');
    const recordDateTimeKeyRange = IDBKeyRange.upperBound(interval, true);
    const recordDateTimeCursor = dbStore.index('createTime').openCursor(recordDateTimeKeyRange);
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
  } else {
    console.warn(`DataBase is not available at this moment. ENABLE_NETWORK_MONITOR = ${ENABLE_NETWORK_MONITOR()}, db = ${db}`);
    resolve();
    // reject(new Error(`DataBase is not available at this moment. ENABLE_NETWORK_MONITOR = ${ENABLE_NETWORK_MONITOR()}, db = ${db}`));
  }
});


if (ENABLE_NETWORK_MONITOR() && window.indexedDB) {
  initDB();
}
