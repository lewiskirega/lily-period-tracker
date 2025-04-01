document.addEventListener('DOMContentLoaded', function() {
  const inventoryForm = document.getElementById('inventory-form');
  const inventoryBody = document.getElementById('inventory-data');
  
  inventoryForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form values
      const productName = document.getElementById('productName').value.trim();
      const quantity = parseFloat(document.getElementById('quantity').value);
      const dailyUsage = parseFloat(document.getElementById('dailyUsage').value);
      
      // Validate inputs
      if (!productName) {
          alert('Please enter a product name');
          return;
      }
      
      if (isNaN(quantity) || quantity <= 0) {
          alert('Quantity must be a positive number');
          return;
      }
      
      if (isNaN(dailyUsage) || dailyUsage <= 0) {
          alert('Daily usage must be a positive number');
          return;
      }
      
      // Calculate duration (how long it will last)
      const duration = Math.round((quantity / dailyUsage) * 100) / 100; // Round to 2 decimal places
      
      // Calculate end date
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + Math.floor(duration));
      
      // Format the end date
      const formattedEndDate = endDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      });
      
      // Create new table row
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <td>${productName}</td>
          <td>${quantity}</td>
          <td>${dailyUsage}</td>
          <td>${duration.toFixed(2)} days</td>
          <td>${formattedEndDate}</td>
      `;
      
      // Add the new row to the table
      inventoryBody.appendChild(newRow);
      
      // Reset the form
      inventoryForm.reset();
  });
});