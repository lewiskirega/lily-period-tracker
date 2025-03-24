/* global app */
'use strict';

(function() {
  // Chat component elements
    let chatButton;
    let chatContainer;
    let chatMessages;
    let chatForm;
    let chatInput;
    let chatCloseButton;
    let mapContainer;
    let closeMapButton;
    let map;
    let placesService;
    
    // Simple NLP function to process messages and return responses
    function processMessage(message) {
        // Convert message to lowercase for easier keyword matching
        const lowerMessage = message.toLowerCase().trim();
        
        // Check for period-related keywords
        if (lowerMessage.includes('period') && lowerMessage.includes('when')) {
            return "Based on your tracking data, I can see when your next period is expected. You can also check the home screen for this information.";
        }
        
        if (lowerMessage.includes('cycle') && lowerMessage.includes('length')) {
            return "Your average cycle length can be found in the log section. You can also adjust your expected cycle length in settings.";
        }
        
        if (lowerMessage.includes('track') || lowerMessage.includes('log')) {
            return "To log a new period, go to the home screen and tap 'Period just started' or use the log section to add a specific date.";
        }
        
        if (lowerMessage.includes('export') || lowerMessage.includes('backup')) {
            return "You can export your data as a backup from the settings page. This creates a file you can save for later import.";
        }
        
        if (lowerMessage.includes('import')) {
            return "To import previously exported data, go to settings and use the 'Import from backup' option.";
        }
        
        if (lowerMessage.includes('delete')) {
            return "You can delete all your data from the settings page. Be careful as this action cannot be undone!";
        }
        
        // Check for greeting keywords
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage === 'hey') {
            return "Hello! How can I help you with your period tracking today?";
        }
        
        // Check for help keywords
        if (lowerMessage.includes('help') || lowerMessage.includes('how to')) {
            return "I can help you with tracking periods, understanding cycle length, and using the app features. What would you like to know about?";
        }
        
        // Check for thank you keywords
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're welcome! Let me know if you need anything else.";
        }
        
        // Check for goodbye keywords
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            return "Goodbye! Feel free to chat again if you have more questions.";
        }
        
        // Check for medical or gynecologist related keywords
        if (lowerMessage.includes('doctor') || 
            lowerMessage.includes('gynecologist') || 
            lowerMessage.includes('clinic') || 
            lowerMessage.includes('hospital') || 
            lowerMessage.includes('medical') || 
            lowerMessage.includes('pain') || 
            lowerMessage.includes('symptom') || 
            lowerMessage.includes('find') || 
            lowerMessage.includes('nearby')) {
            
            // Return a response that indicates we'll show the map
            return {
                text: "I can help you find nearby clinics. I'll open a map for you. You can also access this feature anytime from the maps option in the main menu.",
                showMap: true
            };
        }
        
        // Fallback response if no keywords match
        return {
            text: "I'm not sure I understand. Try asking about tracking your period, cycle length, or app features like importing/exporting data. You can also use our maps feature to find nearby clinics.",
            showMap: false
        };
    }
    
    // Function to toggle chat container visibility
    function toggleChat() {
        chatContainer.classList.toggle('active');
        
        // If opening the chat, focus on the input field
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
            
            // Add welcome message if chat is empty
            if (chatMessages.children.length === 0) {
                addMessage("Welcome to Lily Period Tracker! How can I help you today?", 'assistant');
            }
        }
    }
    
    // Function to add a message to the chat display
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.classList.add(`chat-message--${sender}`);
        messageElement.textContent = text;
        
        chatMessages.appendChild(messageElement);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to handle message submission
    function handleSubmit(event) {
        event.preventDefault();
        
        const message = chatInput.value.trim();
        
        if (message) {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input field
            chatInput.value = '';
            
            // Process message and get response
            setTimeout(() => {
                try {
                    const response = processMessage(message);
                    
                    // Check if response is an object with text and showMap properties
                    if (typeof response === 'object' && response.text) {
                        addMessage(response.text, 'assistant');
                        
                        // If showMap is true, display the map
                        if (response.showMap) {
                            showMap();
                        }
                    } else {
                        // Handle string responses (for backward compatibility)
                        addMessage(response, 'assistant');
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                    addMessage("Sorry, I encountered an error processing your message. Please try again.", 'assistant');
                }
            }, 500); // Small delay to make the response feel more natural
        }
    }
    
    // Function to show the map container and display the Google Maps iframe
    function showMap() {
        mapContainer.style.display = 'block';
        
        // Insert the Google Maps iframe if it hasn't been added yet
        if (!mapContainer.querySelector('iframe')) {
            // Create iframe HTML for Google Maps
            const iframeHTML = `
                <iframe
                    width="100%"
                    height="100%"
                    style="border:0"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=clinics+near+me">
                </iframe>
            `;
            
            // Insert the iframe into the map container
            mapContainer.innerHTML = `
                <div id="map-header">
                    <button id="close-map" class="close-button">×</button>
                    <button id="update-location" class="update-button">📍 Update Location</button>
                </div>
                <div id="map">${iframeHTML}</div>
            `;
            
            // Re-attach event listener to the close button since we replaced its element
            document.getElementById('close-map').addEventListener('click', hideMap);
            
            // Add event listener for the update location button
            // This uses the updateUserLocation function from maps.js if available
            const updateLocationBtn = document.getElementById('update-location');
            if (updateLocationBtn) {
                updateLocationBtn.addEventListener('click', function() {
                    // Use the maps module's updateUserLocation function if available
                    if (window.mapsModule && typeof window.mapsModule.updateUserLocation === 'function') {
                        window.mapsModule.updateUserLocation();
                    } else {
                        // Fallback to local implementation if maps module is not available
                        updateUserLocation();
                    }
                });
            }
        }
    }
    
    // Function to hide the map container
    function hideMap() {
        mapContainer.style.display = 'none';
    }
    
    // Function to initialize the Google Map
    function initMap() {
        // Default location (will be overridden if geolocation is available)
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York City
        
        // Create a new map centered at the default location
        map = new google.maps.Map(document.getElementById('map'), {
            center: defaultLocation,
            zoom: 13
        });
        
        // Initialize the Places service
        placesService = new google.maps.places.PlacesService(map);
        
        // Try to get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Center the map on the user's location
                    map.setCenter(userLocation);
                    
                    // Add a marker for the user's location
                    // Store reference to user marker for later updates
                    userMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: 'Your Location',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#4285F4',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2
                        }
                    });
                    
                    // Search for nearby gynecologists
                    searchNearbyGynecologists(map, userLocation);
                },
                // Error callback
                (error) => {
                    console.error('Geolocation error:', error);
                    addMessage("I couldn't access your location. Showing default map view instead.", 'assistant');
                    
                    // Search for gynecologists near the default location
                    searchNearbyGynecologists(map, defaultLocation);
                },
                // Options
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            // Browser doesn't support geolocation
            addMessage("Your browser doesn't support geolocation. Showing default map view instead.", 'assistant');
            
            // Search for gynecologists near the default location
            searchNearbyGynecologists(map, defaultLocation);
        }
    }
    
    // Function to search for nearby clinics
    function searchNearbyGynecologists(map, location) {
        // Create a request for nearby clinics
        const request = {
            location: location,
            radius: 5000, // 5km radius
            type: ['doctor'],
            keyword: 'clinic'
        };
        
        // Perform the nearby search
        placesService.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // Create markers for each result
                results.forEach(place => {
                    createMarker(map, place);
                });
                
                // If no results were found
                if (results.length === 0) {
                    addMessage("No clinics found nearby. Try expanding the search radius or searching in a different area.", 'assistant');
                }
            } else {
                console.error('Places API error:', status);
                addMessage("There was an error searching for nearby clinics. Please try again later.", 'assistant');
            }
        });
    }
    
    // Function to create a marker for a place
    function createMarker(map, place) {
        if (!place.geometry || !place.geometry.location) return;
        
        // Create a marker for the place
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });
        
        // Create an info window for the marker
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h3>${place.name}</h3>
                    <p>${place.vicinity || ''}</p>
                    <p>Rating: ${place.rating ? `${place.rating}/5 (${place.user_ratings_total} reviews)` : 'No ratings'}</p>
                    ${place.opening_hours ? 
                        `<p>${place.opening_hours.open_now ? 'Open now' : 'Closed'}</p>` : 
                        ''}
                    ${place.photos && place.photos.length > 0 ? 
                        `<img src="${place.photos[0].getUrl({maxWidth: 200, maxHeight: 200})}" alt="${place.name}" style="max-width:200px;">` : 
                        ''}
                </div>
            `
        });
        
        // Add click event listener to open the info window
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
    
    // Function to update user's location
    function updateUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Center the map on the user's updated location
                    map.setCenter(newLocation);
                    
                    // Update or create the user location marker
                    if (userMarker) {
                        userMarker.setPosition(newLocation);
                    } else {
                        userMarker = new google.maps.Marker({
                            position: newLocation,
                            map: map,
                            title: 'Your Location',
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: '#4285F4',
                                fillOpacity: 1,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 2
                            }
                        });
                    }
                    
                    // Search for nearby gynecologists with updated location
                    searchNearbyGynecologists(map, newLocation);
                    
                    // Add a message in the chat to confirm location update
                    if (chatMessages) {
                        addMessage("I've updated your location and refreshed the nearby clinics.", 'assistant');
                    }
                },
                // Error callback
                (error) => {
                    console.error('Geolocation update error:', error);
                    if (chatMessages) {
                        addMessage("Unable to get your current location. Please check your location permissions.", 'assistant');
                    } else {
                        alert('Unable to get your current location. Please check your location permissions.');
                    }
                },
                // Options
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            // Browser doesn't support geolocation
            console.warn("Browser doesn't support geolocation");
            if (chatMessages) {
                addMessage("Your browser does not support geolocation services.", 'assistant');
            } else {
                alert('Your browser does not support geolocation services.');
            }
        }
    }
    
    // Initialize chat component
    function init() {
        // Get DOM elements
        chatButton = document.getElementById('chat-button');
        chatContainer = document.getElementById('chat-container');
        chatMessages = document.getElementById('chat-messages');
        chatForm = document.getElementById('chat-form');
        chatInput = document.getElementById('chat-input');
        chatCloseButton = document.querySelector('.chat-header__close');
        mapContainer = document.getElementById('map-container');
        closeMapButton = document.getElementById('close-map');
        
        // Add event listeners
        chatButton.addEventListener('click', toggleChat);
        chatCloseButton.addEventListener('click', toggleChat);
        chatForm.addEventListener('submit', handleSubmit);
        if (closeMapButton) {
            closeMapButton.addEventListener('click', hideMap);
        }
        
        // Add keyboard shortcut (Escape key) to close chat
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                // Close map if it's open
                if (mapContainer.style.display === 'block') {
                    hideMap();
                }
                // Otherwise close chat if it's open
                else if (chatContainer.classList.contains('active')) {
                    toggleChat();
                }
            }
        });
        
        // Initialize map-related navigation
        document.querySelector('a[href="#/maps"]').addEventListener('click', function(e) {
            e.preventDefault();
            showMap();
        });
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
    
    // If the DOM is already loaded, initialize immediately
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    }
    
    // Add a variable to store the user marker
    let userMarker;
    
    // Expose functions to global scope for potential use by other modules
    window.chatMapModule = {
        showMap: showMap,
        hideMap: hideMap,
        updateUserLocation: updateUserLocation
    };
})();
