
/* global google */
'use strict';

(function() {
    // Map elements and services
    let map;
    let placesService;
    let mapContainer;
    let closeMapButton;
    let userMarker; // Store reference to user's location marker
    
    // Function to show the map container with an embedded Google Maps iframe
    function showMap() {
        // Check if we're in the inventory page and if there's a dedicated container
        const inventoryMapContainer = document.getElementById('inventory-map-container');
        
        // Use the inventory-specific container if it exists, otherwise use the default one
        mapContainer = inventoryMapContainer || document.getElementById('map-container');
        
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
        
        mapContainer.style.display = 'block';
        
        // Insert the Google Maps iframe HTML
        mapContainer.innerHTML = `
            <div id="map-header">
                <button id="close-map" class="close-button">×</button>
                <button id="update-location" class="update-button">📍 Update Location</button>
            </div>
            <div id="map">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d12345.678901234567!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgynecologists!5e0!3m2!1sen!2sus!4v1616729894957!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        `;
        
        // Re-attach event listener to the close button since we replaced the HTML
        const closeMapButton = document.getElementById('close-map');
        if (closeMapButton) {
            closeMapButton.addEventListener('click', hideMap);
        }
    }
    
    // Function to hide the map container
    function hideMap() {
        // Check both possible map containers
        const inventoryMapContainer = document.getElementById('inventory-map-container');
        const defaultMapContainer = document.getElementById('map-container');
        
        // Hide whichever one is currently being used
        if (inventoryMapContainer && inventoryMapContainer.style.display === 'block') {
            inventoryMapContainer.style.display = 'none';
        }
        
        if (defaultMapContainer) {
            defaultMapContainer.style.display = 'none';
        }
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
                    
                    // Search for nearby clinics
                    searchNearbyGynecologists(map, userLocation);
                },
                // Error callback
                (error) => {
                    console.error('Geolocation error:', error);
                    
                    // Search for clinics near the default location
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
            console.warn("Browser doesn't support geolocation");
            
            // Search for clinics near the default location
            searchNearbyGynecologists(map, defaultLocation);
        }
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
                    
                    // Search for nearby clinics with updated location
                    searchNearbyGynecologists(map, newLocation);
                },
                // Error callback
                (error) => {
                    console.error('Geolocation update error:', error);
                    alert('Unable to get your current location. Please check your location permissions.');
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
            alert('Your browser does not support geolocation services.');
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
            } else {
                console.error('Places API error:', status);
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
    
    // Initialize map functionality
    function init() {
        // Get DOM elements
        mapContainer = document.getElementById('map-container');
        
        // Add event listener for the update location button
        document.addEventListener('click', function(event) {
            if (event.target && event.target.id === 'update-location') {
                updateUserLocation();
            }
        });
        
        // Add event listeners are now handled in showMap() since we're replacing the HTML
        
        // Initialize map-related navigation
        const mapNavLink = document.querySelector('a[href="#/maps"]');
        if (mapNavLink) {
            mapNavLink.addEventListener('click', function(e) {
                e.preventDefault();
                showMap();
            });
        }
        
        // Add keyboard shortcut (Escape key) to close map
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mapContainer && mapContainer.style.display === 'block') {
                hideMap();
            }
        });
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
    
    // If the DOM is already loaded, initialize immediately
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    }
    
    // Listen for the inventory page's map button click
    document.addEventListener('DOMContentLoaded', function() {
        const showMapInventoryBtn = document.getElementById('show-map-inventory');
        if (showMapInventoryBtn) {
            showMapInventoryBtn.addEventListener('click', function() {
                showMap();
            });
        }
    });
    
    // Expose functions to global scope or for module import
    window.mapsModule = {
        showMap: showMap,
        hideMap: hideMap,
        initMap: initMap,
        updateUserLocation: updateUserLocation
    };
})();
