/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
var checkStorageAvailability = function() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

var Tracker = function (namespace, settings) {
  this.storage = new app.Storage(namespace);
  this.config = new app.Config(settings, this.storage);
  this.model = new app.Model(this.config, this.storage);
  this.template = new app.Template(this.config);
  this.view = new app.View(this.template);
  this.controller = new app.Controller(this.model, this.view);
};

var tracker = new Tracker(NAMESPACE, DEFAULT_USER_SETTINGS);

var show = function () {
  tracker.controller.setSection(document.location.hash);
};

/**
 * Load and display persisted inventory logs
 */
function loadInventoryLogs() {
  var inventoryLogElement = document.getElementById('inventory-log');
  if (!inventoryLogElement) return;

  // Retrieve logs from storage; use key 'inventoryLog' which will be stored under namespace
  var logs = tracker.storage.getItem('inventoryLog');
  if (!Array.isArray(logs)) {
    logs = [];
  }

  // Clear existing logs in the DOM
  inventoryLogElement.innerHTML = "";

  // Append each log message as a list item
  logs.forEach(function(msg) {
    var li = document.createElement('li');
    li.textContent = msg;
    li.classList.add('inventory-log-item');
    inventoryLogElement.appendChild(li);
  });
}

var load = function () {
  // Check if localStorage is available before initializing the app
  if (!checkStorageAvailability()) {
    console.error('LocalStorage is not available – the app requires localStorage to function properly.');
    tracker.view.render(
      'error',
      'LocalStorage is not available. This app requires localStorage to function properly.'
    );
    return;
  }
  console.log('LocalStorage is available - app initialization proceeding.');
  
  // Check if key DOM elements exist before proceeding
  if (!document.querySelector('#home') || !document.querySelector('#calendar') || !document.querySelector('#settings') || !document.querySelector('#inventory')) {
    console.error('One or more required sections (home, calendar, settings, inventory) are missing from the DOM.');
    tracker.view.render(
      'error',
      'One or more required sections (home, calendar, settings, inventory) are missing from the DOM.'
    );
    return;
  }
  console.log('All required DOM sections found - proceeding with initialization.');
  
  tracker.controller.setData();
  // Load persisted inventory logs
  loadInventoryLogs();
  show();
};

if (location.protocol === 'http:' && location.hostname !== 'localhost') {
  const newUrl = location.href.replace('http://', 'https://');
  tracker.view.render(
    'warning',
    `Warning: this app is better loaded from its <a href="${newUrl}">https counterpart</a>`
  );
}

// Use DOMContentLoaded instead of load to ensure DOM elements are available
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', load);
} else {
  // If DOMContentLoaded has already fired, run load immediately
  load();
}
window.addEventListener('hashchange', show);

if (FEATURES.offline) {
  tracker.offline = new app.Offline({
    showOffline: (status) => tracker.view.render('offline', status),
    showInfo: (msg) => tracker.view.render('info', msg),
  });
}

// Initialize chat functionality
if (typeof app.Chat !== 'undefined') {
  // Only initialize chat if localStorage is available
  if (checkStorageAvailability()) {
    tracker.chat = new app.Chat(tracker);
    tracker.chat.initialize();
  }
} else {
  // Chat is initialized via its own IIFE in chat.js
  console.log('Chat module loaded independently');
}

// Initialize inventory functionality
if (typeof app.Inventory !== 'undefined') {
  tracker.inventory = new app.Inventory();
  tracker.inventory.init();
  
  // Listen for new inventory items and display a log alert
  document.addEventListener('inventoryItemAdded', function(e) {
    var newItem = e.detail;
    var runOut = tracker.inventory.calculateRunOut(newItem);
    var msg = `New inventory item added: ${newItem.product} (Quantity: ${newItem.quantity}, lasts ${runOut} days).`;
    tracker.view.render('alert', null, msg);
    
    // Update inventory log list in the log page
    var inventoryLogElement = document.getElementById('inventory-log');
    if (inventoryLogElement) {
      var li = document.createElement('li');
      li.textContent = msg;
      li.classList.add('inventory-log-item');
      inventoryLogElement.appendChild(li);
    }
    
    // Persist the log entry to storage
    var logs = tracker.storage.getItem('inventoryLog');
    if (!Array.isArray(logs)) {
      logs = [];
    }
    logs.push(msg);
    tracker.storage.setItem('inventoryLog', logs);
  });
} else {
  console.log('Inventory module not found');
}
