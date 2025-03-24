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
        
        // Fallback response if no keywords match
        return "I'm not sure I understand. Try asking about tracking your period, cycle length, or app features like importing/exporting data.";
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
            addMessage(response, 'assistant');
            } catch (error) {
            console.error('Error processing message:', error);
            addMessage("Sorry, I encountered an error processing your message. Please try again.", 'assistant');
            }
        }, 500); // Small delay to make the response feel more natural
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
        
        // Add event listeners
        chatButton.addEventListener('click', toggleChat);
        chatCloseButton.addEventListener('click', toggleChat);
        chatForm.addEventListener('submit', handleSubmit);
        
        // Add keyboard shortcut (Escape key) to close chat
        document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && chatContainer.classList.contains('active')) {
            toggleChat();
        }
        });
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);
    
    // If the DOM is already loaded, initialize immediately
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    }
})();