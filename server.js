/**
 * PRODUCTION SECURITY NOTICE:
 * This Express server is intended for development purposes and serving static assets.
 * In production environments, this server should either:
 * 1. Be properly secured behind a reverse proxy with appropriate security headers
 * 2. Be decommissioned entirely in favor of serving static assets directly through 
 *    Flask's static file handling or a dedicated CDN
 * 
 * The Flask server should ALWAYS be the main entry point for the application.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the project's root directory
// This is where the frontend files (HTML, CSS, JS, images, etc.) are located
app.use(express.static(path.join(__dirname)));

// Main route to serve the index.html file
// Commented out to prevent conflicts with Flask server rendering the authenticated template
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// NOTE: The Flask server should be used as the primary entry point for the application
// This Express server only serves static assets after authentication is handled by Flask

// Start the Express server
app.listen(PORT, () => {
  console.log(`Static assets server is running on port ${PORT}`);
});

/*
  Developer Documentation:
  - This Express server is solely responsible for serving static assets (HTML, CSS, JS, images, etc.).
  - User authentication and other backend operations are managed by a separate Flask server.
  - Ensure that the Flask server is running on its designated port to handle authentication and API endpoints.
  - This separation of concerns allows for more modular and maintainable architecture.
  - IMPORTANT: The Flask server must be used as the primary entry point for the application.
  - The Express server should only be accessed for static assets after authentication is handled by Flask.
*/
