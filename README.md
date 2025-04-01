# Lila Period Tracker

A progressive web application for tracking menstrual cycles with period predictions, health insights, and helpful features.

![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen)
![Offline Support](https://img.shields.io/badge/Offline-Supported-orange)

## Project Overview

Lila Period Tracker is a comprehensive menstrual cycle tracking application designed to help users monitor their periods, predict future cycles, and access helpful resources. The application offers a clean, intuitive interface with multiple views and features to support menstrual health management.

Built as a Progressive Web App (PWA), Lila Period Tracker works offline and can be installed on mobile devices for a native app-like experience.

## Features

- **Home Screen**
  - Period predictions and countdown to next cycle
  - Current cycle day indicator
  - Quick access to all main features

- **Calendar View**
  - Visual representation of past and predicted periods
  - Color-coded days for different cycle phases
  - Ability to mark and edit period days

- **Log View**
  - Add, edit, and delete period entries
  - Record additional symptoms and notes
  - Historical data visualization

- **Settings Page**
  - Customize cycle and period length
  - Import and export your data
  - Toggle UI options and preferences
  - Manage notifications

- **Map Feature**
  - Find nearby gynecologists using embedded Google Maps
  - Get directions to healthcare providers
  - Save favorite locations

- **Chat Assistant**
  - Get answers to frequently asked questions
  - Receive guidance on using the application
  - Access period and health-related information

- **Offline Support & PWA**
  - Full functionality without internet connection
  - Data saved locally on your device
  - Install to home screen for app-like experience
  - Automatic synchronization when online

## Installation & Running the App

### For Users
1. Visit the application URL in a modern web browser
2. For the best experience, install the PWA:
   - On Chrome/Edge: Click the install icon (➕) in the address bar
   - On iOS Safari: Tap the share button and select "Add to Home Screen"
   - On Android: Tap the menu button and select "Install App"

### For Developers
1. Clone the repository:
   ```
   git clone :https://github.com/lewiskirega/lily-period-tracker.git
   cd period-tracker
   ```

2. Open the project folder in your preferred text editor (VS Code recommended)

3. Install dependencies:
   ```
   npm install                # For Express server dependencies
   pip install -r requirements.txt  # For Flask backend dependencies
   ```

4. Start the servers:
   - Start the Express server (for static file serving):
     ```
     npm run start-backend
     ```
   - Start the Flask backend (for authentication and API):
     ```
     python app.py
     ```

5. Open the application in your browser:
   - Navigate to `http://localhost:5000` (Flask server) for the full application with authentication
   - **Important**: Always access the application through the Flask server (not the Express server)
   - The Express server (port 3000) is only used for serving static assets and should not be used as the main entry point

### Authentication System
The application now includes a user authentication system built with Flask:

- **User Registration**: Create an account with email and password
- **Login/Logout**: Secure session management
- **Password Security**: Passwords are hashed using werkzeug.security
- **Protected Routes**: Certain pages require authentication
- **Session Management**: User sessions are maintained securely

### Dependencies
- **Frontend**:
  - HTML/CSS/JavaScript
  - Progressive Web App features
  
- **Backend**:
  - **Express.js**: Static file serving and routing
  - **Flask**: Authentication system and API endpoints
  - **SQLite3**: Database for user information
  - **Werkzeug**: Password hashing and security
  - **Flask-Session**: Session management

## Development

### Project Structure
- `templates/` - Flask HTML templates
  - `index.html` - Main entry point and application shell
  - `login.html` - User login page
  - `signup.html` - User registration page
- `static/` - Static assets directory for Flask
  - `js/` - JavaScript files
    - `app.js` - Application initialization
    - `model.js` - Data models and storage logic
    - `controller.js` - Business logic and event handling
    - `view.js` - UI rendering logic
    - `chat.js` - Chat assistant functionality
    - `maps.js` - Maps and location functionality
  - `vendor/` - Third-party libraries and dependencies
  - `images/` - Image assets, icons, and graphics
    - `icon.svg` - Main application icon
    - `apple-touch-icon.png` - Icon for iOS devices
    - `safari-pinned-tab.svg` - Safari pinned tab icon
  - `css/` - Styling files
    - `main.css` - Main application styles
    - `auth.css` - Authentication pages styling
  - `manifest.webmanifest` - PWA manifest file
- `sw.js` - Service worker for offline functionality
- `server.js` - Express server for static file serving
- `app.py` - Flask backend for authentication and API
- `database/` - Database initialization and schema
- `browserconfig.xml` - Configuration for Microsoft browsers

### Static File Structure
All static assets are organized in the `static/` directory to work with Flask's default static file routing:

- **JavaScript Files**: All JS files are now located in `static/js/` directory
- **Vendor Files**: Third-party libraries and dependencies are in `static/vendor/`
- **Image Assets**: All images, icons, and graphics **MUST** be placed in `static/images/` directory
  - This includes all PWA icons, favicons, and application graphics
  - See the "Required image files" section for the complete list of required icon files
  - **IMPORTANT**: The application will not function correctly if images are placed in other directories
  - All image references in HTML, CSS, and JavaScript must use the `/static/images/` path prefix
- **CSS Files**: All stylesheets are in `static/css/` directory
- **Manifest File**: The PWA manifest file is located at `static/manifest.webmanifest`

This organization ensures proper URL resolution when using Flask's `url_for('static', filename='...')` helper function in templates and maintains consistency across the application.

### Directory and File Migration Notes
When setting up the project, ensure the following:

1. **Create the images directory**: 
   ```
   mkdir -p static/images
   ```
   
2. **Required image files**:
   - The following image files must be added to the `static/images/` directory for proper operation:
     - `icon.svg` - Main SVG icon (150x150)
     - `icon16.png` - 16x16 favicon
     - `icon32.png` - 32x32 favicon
     - `icon192.png` - 192x192 PWA icon
     - `icon512.png` - 512x512 PWA icon (used for maskable icon)
     - `apple-touch-icon.png` - 180x180 icon for iOS devices
     - `safari-pinned-tab.svg` - SVG icon for Safari pinned tabs
     - `mstile-150x150.png` - 150x150 icon for Microsoft tiles
   - These files are referenced in the HTML, manifest.webmanifest, and browserconfig.xml files
   - Missing image files will cause 404 errors and prevent proper PWA installation

3. **File migrations**:
   - Ensure `app.js` is in the correct location at `static/js/app.js`
   - Move `manifest.webmanifest` to `static/manifest.webmanifest`
   - Verify `browserconfig.xml` is in the correct location for Microsoft browser integration

4. **Duplicate files**:
   - Remove any duplicate `app.js` files (e.g., from `js/app.js` if it exists)
   - Ensure only one copy of each resource exists in the correct location

### Technical Details
- Built with vanilla JavaScript (ES5/ES6)
- Uses localStorage for data persistence
- Implements the MVC (Model-View-Controller) pattern
- Service worker (`sw.js`) handles caching and offline support
- Responsive design works on mobile and desktop devices
- Authentication system built with Flask and SQLite3
- Secure password storage using werkzeug.security
- Session-based authentication for protected routes

### Server Architecture
The application uses a dual-server architecture:

1. **Flask Backend** (`app.py`):
   - Handles authentication and user management
   - Provides API endpoints for data that requires server processing
   - Serves the main HTML templates
   - Manages user sessions and security
   - **Primary entry point for users** (typically on port 5000)

2. **Express Server** (`server.js`):
   - Serves static assets for better performance
   - Provides fallback routing for the SPA
   - Handles PWA-specific requirements
   - Optimized for serving the JavaScript, CSS, and image files
   - Should not be accessed directly by users (only used internally)

This separation allows for:
- Specialized handling of different concerns
- Independent scaling of static file serving vs. API processing
- Flexibility in deployment options

**Important Note**: Always access the application through the Flask server URL. The Express server is only for serving static assets and should not be used as the main entry point for the application once authentication is required.

### Production Deployment

#### Flask Backend Deployment
For production deployment, the Flask application should be run using a production WSGI server:

1. **Set Environment Variables**:
   ```bash
   # Set a strong, random secret key for Flask sessions
   export FLASK_SECRET_KEY="your-secure-random-key-here"
   
   # Set Flask to production mode
   export FLASK_ENV=production
   ```

2. **Deploy with Gunicorn**:
   ```bash
   # Install Gunicorn if not already installed
   pip install gunicorn
   
   # Run with Gunicorn (4 worker processes)
   gunicorn -w 4 -b 127.0.0.1:5000 app:app
   ```

3. **Configure NGINX as Reverse Proxy**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
       
       # Serve static files directly through NGINX for better performance
       location /static/ {
           alias /path/to/your/app/static/;
           expires 30d;
       }
   }
   ```

4. **Security Considerations**:
   - Always use HTTPS in production (configure SSL in NGINX)
   - Set secure cookie flags in Flask: `SESSION_COOKIE_SECURE=True` and `SESSION_COOKIE_HTTPONLY=True`
   - Consider using a `.env` file with python-dotenv for managing environment variables
   - Implement rate limiting for authentication endpoints

#### Express Server Deployment
For production deployment of the Express static server:

1. **Configure for Production**:
   ```bash
   # Set Node.js to production mode
   export NODE_ENV=production
   
   # Start the Express server
   node server.js
   ```

2. **Secure the Express Server**:
   - Restrict access to localhost or internal network only
   - Add authentication for static assets if needed
   - Consider using PM2 for process management:
     ```bash
     npm install -g pm2
     pm2 start server.js --name "static-server"
     ```

3. **Alternative Deployment Option**:
   - In production, you may choose to serve all static assets through NGINX directly
   - This eliminates the need for the Express server entirely
   - Update your Flask templates to reference the correct static asset paths

#### Future Considerations
- Potential consolidation to a single server setup for simpler deployment
- Migration to a fully Flask-based solution with optimized static file serving
- Containerization with Docker for easier deployment and scaling
- Implementation of a more robust API with versioning and comprehensive documentation

### API Integration
- Google Maps API for the gynecologist locator feature
- Web Storage API for local data persistence
- Notification API for reminders (if enabled)

## Contributing

Contributions to Lila Period Tracker are welcome! Here's how you can help:

1. **Fork the repository** and create your feature branch
   ```
   git checkout -b feature/amazing-feature
   ```

2. **Commit your changes** with clear commit messages
   ```
   git commit -m 'Add some amazing feature'
   ```

3. **Push to your branch**
   ```
   git push origin feature/amazing-feature
   ```

4. **Open a Pull Request**

### Code Style Guidelines
- Follow existing code formatting patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design for all UI changes

### Testing
- Test your changes in multiple browsers
- Verify offline functionality
- Check mobile responsiveness

## License & Author

This project is licensed under the ISC License - see the LICENSE file for details.

Original author: Giulia Alfonsi

## Additional Information

### Live Demo
Visit [lilaperiodtracker.example.com](https://lilaperiodtracker.example.com) to see the application in action.

### GitHub Repository
[github.com/username/period-tracker](https://github.com/username/period-tracker)

### Debugging
- Open browser developer tools (F12) to view console logs
- Application data is stored in localStorage and can be inspected in the Application tab
- Service worker status can be checked in the Application > Service Workers section

### Using the Chat Assistant
The chat assistant can help with:
- Understanding your cycle data
- Troubleshooting application issues
- Answering period-related questions
- Providing guidance on application features

### Known Issues
- Map feature requires internet connection
- Some browsers may limit localStorage in private/incognito mode
- Authentication requires both servers to be running
- Session cookies require same-origin requests
- Duplicate files in the codebase may cause confusion during development
- File paths must be correctly maintained between the Flask templates and static assets
- Accessing the application directly through the Express server (port 3000) will bypass authentication and may result in missing functionality
- Missing image files in the `static/images/` directory will cause 404 errors and prevent proper PWA installation
- In production, if FLASK_SECRET_KEY is not set properly, user sessions may be invalidated on server restart
- Without proper NGINX configuration, static assets may load slowly or fail to load in production

### Privacy
All your period tracking data is stored locally on your device. User authentication information is stored in an encrypted database on the server. No personal health information is transmitted to any server unless you explicitly use the export feature. Authentication data is used solely for account access and is never shared with third parties.
