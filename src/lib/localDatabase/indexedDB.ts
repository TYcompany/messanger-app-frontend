import { openDB } from "idb";

const dbName = "idb1";

const options = {
  blocked: () => {
    // seems an older version of this app is running in another tab
    window.alert(`Please close this app opened in other browser tabs.`);
  },

  blocking: () => {
    // seems the user just opened this app again in a new tab
    // which happens to have gotten a version change
    window.alert(`App is outdated, please close this tab`);
  },

//   upgrade: (db, oldVersion, newVersion, transaction) => {
//     // upgrade to v4 in a less careful manner:
//     const store = transaction.objectStore('moreCats');
//     store.createIndex('strengthIndex', 'strength');
//   },


};

const rangeQuery=async()=>{
    // const strongRange = IDBKeyRange.lowerBound(8);
    // const midRange = IDBKeyRange.bound(3, 7);
    // const weakRange = IDBKeyRange.upperBound(2);
    // let [strongCats, ordinaryCats, weakCats] = [
    //   await db3.getAllFromIndex('moreCats', 'strengthIndex', strongRange),
    //   await db3.getAllFromIndex('moreCats', 'strengthIndex', midRange),
    //   await db3.getAllFromIndex('moreCats', 'strengthIndex', weakRange),
    // ];
}

// export async function cursoring() {
//     const db3 = await openDB('db3', 4);
//     // open a 'readonly' transaction:
//     let store = db3.transaction('moreCats').store;
//     // create a cursor, inspect where it's pointing at:
//     let cursor = await store.openCursor();
//     console.log('cursor.key: ', cursor.key);
//     console.log('cursor.value: ', cursor.value);
//     // move to next position:
//     cursor = await cursor.continue();
//     // inspect the new position:
//     console.log('cursor.key: ', cursor.key);
//     console.log('cursor.value: ', cursor.value);
  
//     // keep moving until the end of the store
//     // look for cats with strength and speed both greater than 8
//     while (true) {
//       const { strength, speed } = cursor.value;
//       if (strength >= 8 && speed >= 8) {
//         console.log('found a good cat! ', cursor.value);
//       }
//       cursor = await cursor.continue();
//       if (!cursor) break;
//     }
//     db3.close();
//   }


export const idb = {
  db1: openDB("db1", 1, options),
  db2: openDB("db2", 1, options),
};
export async function addToStore1(key: string, value: any) {
  (await idb.db1).add("store1", value, key);
}

const retrieving = async () => {
  // db2.get('store3', 'cat001').then(console.log);
  // // retrieve all:
  // db2.getAll('store3').then(console.log);
  // // count the total number of items in a store:
  // db2.count('store3').then(console.log);
  // // get all keys:
  // db2.getAllKeys('store3').then(console.log);
};

const settingDb = async () => {
  // set db1/store1/delivered to be false:
  //db1.put('store1', false, 'delivered');
  // replace cat001 with a supercat:
  // db2.put('store3', { id: 'cat001', strength: 99, speed: 99 });
};

// demo1: Getting started
export function createDatabase() {
  openDB("idb1", 1, {
    upgrade(db) {
      db.createObjectStore("userStore");
      db.createObjectStore("messageStore");
    },
  });
  openDB("db2", 1, {
    upgrade(db) {
      db.createObjectStore("store3", { keyPath: "id" });
      db.createObjectStore("store4", { autoIncrement: true });
    },
  });
}

export async function initDataBase() {
  const db1 = await openDB("db1", 1);

  db1.add("store1", "hello world", "message");
  db1.add("store1", true, "delivered");
  db1.close();
}

export const indexedDB = async () => {
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }
  console.log("indexed Db");
  return 1;
};

// export async function demo4() {
//     const db2 = await openDB('db2', 1);
//     db2.add('store3', { id: 'cat001', strength: 10, speed: 10 });
//     db2.add('store3', { id: 'cat002', strength: 11, speed: 9 });
//     db2.add('store4', { id: 'cat003', strength: 8, speed: 12 });
//     db2.add('store4', { id: 'cat004', strength: 12, speed: 13 });
//     db2.close();
//   }



//typescript
// import { openDB, DBSchema } from 'idb';

// interface MyDB extends DBSchema {
//   'favourite-number': {
//     key: string;
//     value: number;
//   };
//   products: {
//     value: {
//       name: string;
//       price: number;
//       productCode: string;
//     };
//     key: string;
//     indexes: { 'by-price': number };
//   };
// }

// async function demo() {
//   const db = await openDB<MyDB>('my-db', 1, {
//     upgrade(db) {
//       db.createObjectStore('favourite-number');

//       const productStore = db.createObjectStore('products', {
//         keyPath: 'productCode',
//       });
//       productStore.createIndex('by-price', 'price');
//     },
//   });

//   // This works
//   await db.put('favourite-number', 7, 'Jen');
//   // This fails at compile time, as the 'favourite-number' store expects a number.
//   await db.put('favourite-number', 'Twelve', 'Jake');
// }


//typescript versioning

// import { openDB, DBSchema, IDBPDatabase } from 'idb';

// interface MyDBV1 extends DBSchema {
//   'favourite-number': { key: string; value: number };
// }

// interface MyDBV2 extends DBSchema {
//   'fave-num': { key: string; value: number };
// }

// const db = await openDB<MyDBV2>('my-db', 2, {
//   async upgrade(db, oldVersion) {
//     // Cast a reference of the database to the old schema.
//     const v1Db = db as unknown as IDBPDatabase<MyDBV1>;

//     if (oldVersion < 1) {
//       v1Db.createObjectStore('favourite-number');
//     }
//     if (oldVersion < 2) {
//       const store = v1Db.createObjectStore('favourite-number');
//       store.name = 'fave-num';
//     }
//   },
// });