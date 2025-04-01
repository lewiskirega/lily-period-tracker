'use strict';

(function (window) {
  // InventoryManager constructor function
  var InventoryManager = function () {
    var self = this;
    var storageKey = 'Inventory';
    // Create a storage instance; Using empty namespace so keys remain unchanged
    var storage = new window.app.Storage('');
    var inventory = [];

    // Load inventory data from localStorage
    var load = function () {
      var data = storage.getItem(storageKey);
      inventory = data || [];
    };

    // Save inventory data to localStorage
    var save = function () {
      return storage.setItem(storageKey, inventory);
    };

    // Public method to get the inventory
    this.getInventory = function () {
      return inventory;
    };

    // Public method to add an item to the inventory
    this.addItem = function (item) {
      inventory.push(item);
      save();
      self.updateUI();
      var event = new CustomEvent('inventoryItemAdded', { detail: item });
      document.dispatchEvent(event);
    };

    // Public method to remove an item from the inventory by its id
    this.removeItem = function (itemId) {
      inventory = inventory.filter(function (item) { 
        return item.id !== itemId;
      });
      save();
      self.updateUI();
    };

    // Public method to calculate run-out days for a single item
    this.calculateRunOut = function (item) {
      if (item.dailyUsage > 0) {
        return Math.floor(item.quantity / item.dailyUsage);
      }
      return 'N/A';
    };

    // Public method to calculate finish date based on run-out days
    this.calculateFinishDate = function(item) {
      var runOutDays = self.calculateRunOut(item);
      if (typeof runOutDays === 'number') {
        // Calculate finish date using moment.js
        return moment().add(runOutDays, 'days').format('MMM D, YYYY');
      }
      return 'N/A';
    };

    // Update UI: refresh the inventory display as a table
    this.updateUI = function () {
      var listContainer = document.getElementById('inventory-list');
      if (!listContainer) return;
      listContainer.innerHTML = '';
      
      // Create table element
      var table = document.createElement('table');
      table.id = 'inventory-table';
      table.className = 'inventory-table';
      
      // Create table header
      var thead = document.createElement('thead');
      var headerRow = document.createElement('tr');
      
      // Define headers
      var headers = ['Product', 'Quantity', 'Daily Usage', 'Run Out (days)', 'Finish Date', 'Coverage', 'Action'];
      
      // Add header cells
      headers.forEach(function(headerText) {
        var th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Create table body
      var tbody = document.createElement('tbody');
      
      // Get period length from config if available, otherwise use default
      var periodLength = 5; // Default period length
      if (window.app && window.app.config && window.app.config.getPeriodLength) {
        periodLength = window.app.config.getPeriodLength();
      }
      
      // Add rows for each inventory item
      inventory.forEach(function (item) {
        var tr = document.createElement('tr');
        
        // Product name cell
        var tdProduct = document.createElement('td');
        tdProduct.textContent = item.product;
        tr.appendChild(tdProduct);
        
        // Quantity cell
        var tdQuantity = document.createElement('td');
        tdQuantity.textContent = item.quantity;
        tr.appendChild(tdQuantity);
        
        // Daily usage cell
        var tdDailyUsage = document.createElement('td');
        tdDailyUsage.textContent = item.dailyUsage;
        tr.appendChild(tdDailyUsage);
        
        // Run out days cell
        var runOutDays = self.calculateRunOut(item);
        var tdRunOut = document.createElement('td');
        tdRunOut.textContent = typeof runOutDays === 'number' ? runOutDays + ' day(s)' : runOutDays;
        tr.appendChild(tdRunOut);
        
        // Finish date cell
        var tdFinishDate = document.createElement('td');
        tdFinishDate.textContent = self.calculateFinishDate(item);
        tr.appendChild(tdFinishDate);
        
        // Coverage cell
        var tdCoverage = document.createElement('td');
        if (typeof runOutDays === 'number') {
          if (runOutDays < periodLength) {
            tdCoverage.textContent = 'Insufficient Coverage';
            tdCoverage.className = 'coverage-insufficient';
          } else {
            tdCoverage.textContent = 'Covers Period';
            tdCoverage.className = 'coverage-sufficient';
          }
        } else {
          tdCoverage.textContent = 'N/A';
        }
        tr.appendChild(tdCoverage);
        
        // Action cell with remove button
        var tdAction = document.createElement('td');
        var btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remove';
        btnRemove.className = 'inventory-remove-btn';
        btnRemove.addEventListener('click', function () {
          self.removeItem(item.id);
        });
        tdAction.appendChild(btnRemove);
        tr.appendChild(tdAction);
        
        tbody.appendChild(tr);
      });
      
      table.appendChild(tbody);
      listContainer.appendChild(table);
      
      // If no items, show a message
      if (inventory.length === 0) {
        var emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No inventory items. Add some using the form above.';
        emptyMessage.className = 'inventory-empty-message';
        listContainer.appendChild(emptyMessage);
      }
    };

    // Optional method to get run-out estimates for integration with calendar view
    this.getRunOutData = function () {
      var data = {};
      inventory.forEach(function (item) {
        data[item.id] = self.calculateRunOut(item);
      });
      return data;
    };

    // Function to display inventory notifications
    function showInventoryNotification(message) {
      var logContainer = document.getElementById('inventory-log');
      if (logContainer) {
        var msgEl = document.createElement('li');
        msgEl.textContent = message;
        msgEl.className = 'inventory-notification';
        logContainer.appendChild(msgEl);
        // Remove the message after 5 seconds
        setTimeout(function(){ 
          if (logContainer.contains(msgEl)) {
            logContainer.removeChild(msgEl);
          }
        }, 5000);
      }
    }

    // Initialize the InventoryManager
    this.init = function () {
      load();
      self.updateUI();
      var form = document.getElementById('inventory-form');
      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var productInput = document.getElementById('inventory-product');
          var quantityInput = document.getElementById('inventory-quantity');
          var dailyUsageInput = document.getElementById('inventory-daily-usage');
          if (productInput && quantityInput && dailyUsageInput) {
            var product = productInput.value.trim();
            var quantity = parseInt(quantityInput.value, 10);
            var dailyUsage = parseInt(dailyUsageInput.value, 10);
            if (product && !isNaN(quantity) && !isNaN(dailyUsage)) {
              var newItem = {
                id: Date.now().toString(),
                product: product,
                quantity: quantity,
                dailyUsage: dailyUsage,
                created: new Date().toISOString()
              };
              self.addItem(newItem);
              form.reset();
              
              // Get period length for coverage message
              var periodLength = 5; // Default period length
              if (window.app && window.app.config && window.app.config.getPeriodLength) {
                periodLength = window.app.config.getPeriodLength();
              }
              
              var runOutDays = self.calculateRunOut(newItem);
              var coverageStatus = typeof runOutDays === 'number' ? 
                (runOutDays < periodLength ? 'Insufficient Coverage' : 'Covers Period') : 'N/A';
              
              // Show notification about the added item with coverage information
              var message = "Inventory Added: " + newItem.product + " will last " + 
                            (typeof runOutDays === 'number' ? runOutDays + " day(s)" : runOutDays) + 
                            " and finish on " + self.calculateFinishDate(newItem) + 
                            ". Status: " + coverageStatus;
              showInventoryNotification(message);
            }
          }
        });
      }
    };
  };

  // Expose the InventoryManager to the global app namespace
  window.app = window.app || {};
  window.app.Inventory = InventoryManager;
})(window);
