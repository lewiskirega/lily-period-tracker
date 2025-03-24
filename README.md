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

3. Start a local HTTP server:
   - Using VS Code Live Server extension: Click "Go Live" in the status bar
   - Using Python:
     ```
     python -m http.server
     ```
   - Using Node.js:
     ```
     npx serve
     ```

4. Open the application in your browser:
   - Navigate to `http://localhost:8000` (or the address provided by your server)

## Development

### Project Structure
- `index.html` - Main entry point and application shell
- `js/` - JavaScript files
  - `app.js` - Application initialization
  - `model.js` - Data models and storage logic
  - `controller.js` - Business logic and event handling
  - `views/` - UI components and rendering
- `css/` - Styling files
- `assets/` - Images, icons, and other static assets
- `sw.js` - Service worker for offline functionality

### Technical Details
- Built with vanilla JavaScript (ES5/ES6)
- Uses localStorage for data persistence
- Implements the MVC (Model-View-Controller) pattern
- Service worker (`sw.js`) handles caching and offline support
- Responsive design works on mobile and desktop devices

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

### Privacy
All your data is stored locally on your device. No personal information is transmitted to any server unless you explicitly use the export feature.