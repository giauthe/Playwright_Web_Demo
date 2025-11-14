/**
 * REST API Test Configuration
 * restful-api.dev API testing setup
 */

export const apiConfig = {
  // Base Configuration
  baseUrl: 'https://api.restful-api.dev',
  
  // Endpoints
  endpoints: {
    objects: '/objects'
  },

  // Headers
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Playwright-API-Test/1.0'
  },

  // Timeouts (in milliseconds)
  timeouts: {
    connection: 10000,
    response: 15000,
    action: 5000
  },

  // Retry Configuration
  retry: {
    maxRetries: 2,
    retryDelay: 1000
  },

  // HTTP Status Codes
  statusCodes: {
    success: 200,
    created: 201,
    badRequest: 400,
    notFound: 404,
    serverError: 500
  },

  // Mock Data - Available Objects
  mockObjects: [
    { id: '1', name: 'Google Pixel 6 Pro' },
    { id: '2', name: 'Apple iPhone 12 Mini, 256GB, Blue' },
    { id: '3', name: 'Apple iPhone 12 Pro Max' },
    { id: '4', name: 'Apple iPhone 11, 64GB' },
    { id: '5', name: 'Samsung Galaxy Z Fold2' },
    { id: '6', name: 'Apple AirPods' },
    { id: '7', name: 'Apple MacBook Pro 16' },
    { id: '8', name: 'Apple Watch Series 8' },
    { id: '9', name: 'Beats Studio3 Wireless' },
    { id: '10', name: 'Apple iPad Mini 5th Gen' },
    { id: '11', name: 'Apple iPad Mini 5th Gen' },
    { id: '12', name: 'Apple iPad Air' },
    { id: '13', name: 'Apple iPad Air' }
  ],

  // Test Data Templates
  testData: {
    validObject: {
      name: 'Test Product',
      data: {
        color: 'blue',
        price: 99.99,
        inStock: true
      }
    },
    largeObject: {
      name: 'Large Test Product',
      data: {
        description: 'x'.repeat(5000),
        metadata: { key: 'value' }
      }
    },
    minimalObject: {
      name: 'Minimal Product',
      data: null
    }
  },

  // Error Messages
  errorMessages: {
    invalidId: 'Invalid object ID',
    malformedJson: 'Malformed JSON',
    missingRequired: 'Missing required field',
    serverError: 'Internal Server Error'
  }
};

export default apiConfig;
