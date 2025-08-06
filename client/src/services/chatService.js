// Chat service for handling API communications with n8n
class ChatService {
  constructor() {
    // Direct browser-to-n8n communication URL - use window.location.hostname to work in all environments
    this.n8nWebhookUrl = `http://${window.location.hostname}:5678/webhook/test-chat`;
    this.isN8nConnected = false;
    console.log('ChatService initialized with n8n URL:', this.n8nWebhookUrl);
  }

  // Send message to n8n webhook
  async sendMessage(message, context = {}) {
    console.log(`Sending message to n8n: "${message}"`);
    
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          ...context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('n8n response:', data);
      return data.message || 'No response from n8n';

    } catch (error) {
      console.error('n8n communication error:', error);
      return this.generateLocalResponse(message);
    }
  }

  // Generate fallback response if n8n is unavailable
  generateLocalResponse(message) {
    return {
      status: 'error',
      message: 'I apologize, but I\'m having trouble connecting to the chat service. Please try again in a moment.',
      timestamp: new Date().toISOString()
    };
  }

  // Initialize service and test connection
  async initialize() {
    try {
      console.log('Testing n8n connection...');
      const response = await this.sendMessage('test connection');
      this.isN8nConnected = true;
      console.log('n8n connection successful:', response);
      return true;
    } catch (error) {
      console.error('n8n initialization failed:', error);
      this.isN8nConnected = false;
      return false;
    }
  }
}

export default new ChatService();