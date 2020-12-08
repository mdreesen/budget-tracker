// need to create a variable to hold db connection
let db;

// establish a connection to IndexedDB database, set this to version 1
const request = indexedDB.open('budget', 1)

// this will emit if the database version changes (nonexistant to version 1, v1, to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called 'new_budget', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function(event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if the app is online, if yes run the upload function to send all local db data to api
  if (navigator.onLine) {
          // we haven't created this yet, but we will soon, so let's comment it out for now
        upload()
  }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// this function will be executed if we appentp to submit a new budget and there is no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add record to your store with add method
    budgetObjectStore.add(record);
}

// add event listener coming back online