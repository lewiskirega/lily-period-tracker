
(function() {
  // Chat component elements
    let chatButton;
    let chatContainer;
    let chatMessages;
    let chatForm;
    let chatInput;
    let chatCloseButton;
    let mapContainer;
    
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
    
    // Function to show the map using mapsModule
    function showMap() {
        // Check if mapsModule is available
        if (window.mapsModule && typeof window.mapsModule.showMap === 'function') {
            window.mapsModule.showMap();
            
            // Add a message in the chat to confirm map is shown
            addMessage("I've opened a map to help you find nearby clinics.", 'assistant');
        } else {
            console.error('Maps module not available');
            addMessage("I'm sorry, the map feature is currently unavailable. Please try again later.", 'assistant');
        }
    }
    
    // Function to hide the map using mapsModule
    function hideMap() {
        // Check if mapsModule is available
        if (window.mapsModule && typeof window.mapsModule.hideMap === 'function') {
            window.mapsModule.hideMap();
        } else {
            console.error('Maps module not available');
            // Fallback to basic hide if mapsModule is not available
            if (mapContainer) {
                mapContainer.style.display = 'none';
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
        
        // Add event listeners
        chatButton.addEventListener('click', toggleChat);
        chatCloseButton.addEventListener('click', toggleChat);
        chatForm.addEventListener('submit', handleSubmit);
        
        // Add keyboard shortcut (Escape key) to close chat
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                // Close map if it's open
                if (mapContainer && mapContainer.style.display === 'block') {
                    hideMap();
                }
                // Otherwise close chat if it's open
                else if (chatContainer.classList.contains('active')) {
                    toggleChat();
                }
            }
        });
        
        // Initialize map-related navigation
        const mapNavLink = document.querySelector('a[href="#/maps"]');
        if (mapNavLink) {
            mapNavLink.addEventListener('click', function(e) {
                e.preventDefault();
                showMap();
            });
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
    
    // If the DOM is already loaded, initialize immediately
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    }
    
    // Expose chat functions to global scope for potential use by other modules
    window.chatModule = {
        toggleChat: toggleChat,
        addMessage: addMessage,
        showMap: showMap,
        hideMap: hideMap
    };
})();
