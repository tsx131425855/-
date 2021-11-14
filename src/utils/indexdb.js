const db = {};
/**
 *这个方法接受两个参数，第一个参数是字符串，表示数据库的名字。
 如果指定的数据库不存在，就会新建数据库。
 第二个参数是整数，表示数据库的版本。
 如果省略，打开已有数据库时，默认为当前版本；新建数据库时，默认为1。
indexedDB.open()方法返回一个 IDBRequest 对象。
这个对象通过三种事件error、success、upgradeneeded，处理打开数据库的操作结果。
 *
 * @param {*} db_name 数据库的名字
 * @param {*} db_version 数据库的版本
 * @returns
 */
export function openDB(db_name, db_version) {
  const DB =
    window.indexedDB ||
    window.webkitIndexedDB ||
    window.mozIndexedDB ||
    window.msIndexedDB;
  console.log(DB);
  if (DB) {
    db.request = DB.open(db_name, db_version);
    console.log(db.request);
    db.request.onupgradeneeded = event => {
      db.result = event.target.result;
      console.log(db.result)
      if (db.result && !db.result.objectStoreNames.contains("data")) {
        const objectStore = db.result.createObjectStore("data", {
          keyPath: "id"
        });
        console.log(objectStore);
      }
      
    };
  } else return false;
}
export function newdb() {
  db.request.onupgradeneeded = event => {
    db.result = event.target.result;
    const objectStore = db.result.createObjectStore("data", {
      keyPath: "id"
    });
    console.log(objectStore);
  };
}
