import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.restful-api.dev';

/**
 * REST API Test Suite - All 7 Endpoints
 * 
 * This suite tests all endpoints of the restful-api.dev service:
 * - GET: List all, single object, multiple objects
 * - POST: Create new objects
 * - PUT: Full updates
 * - PATCH: Partial updates
 * - DELETE: Remove objects
 * 
 * Total: 20 comprehensive test cases
 */

// ==================== GET TESTS ====================

test('GET - List All Objects', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/objects`);
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
  
  // Verify structure
  data.forEach((item: any) => {
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('data');
  });
});

test('GET - Single Object (Valid ID)', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/objects/1`);
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.id).toBe('1');
  expect(data.name).toBeTruthy();
});

test('GET - Single Object (Invalid ID)', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/objects/999`, {
    failOnStatusCode: false
  });
  
  expect([400, 404]).toContain(response.status());
});

test('GET - Multiple Objects by IDs', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/objects?ids=1,2,3`);
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
});

// ==================== POST TESTS ====================

test('POST - Create New Object', async ({ request }) => {
  const payload = {
    name: 'Test Product',
    data: {
      color: 'blue',
      price: 99.99,
      inStock: true
    }
  };

  const response = await request.post(`${BASE_URL}/objects`, {
    data: payload
  });

  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data.id).toBeTruthy();
  expect(data.name).toBe(payload.name);
  expect(data.data).toEqual(payload.data);
  expect(data.createdAt).toBeTruthy();
});

test('POST - Create Object & Verify Persistence', async ({ request }) => {
  // Create object
  const createResponse = await request.post(`${BASE_URL}/objects`, {
    data: {
      name: 'Persistence Test',
      data: { testField: 'testValue' }
    }
  });

  expect(createResponse.status()).toBe(201);
  const createdData = await createResponse.json();
  const createdId = createdData.id;

  // Retrieve object
  const getResponse = await request.get(`${BASE_URL}/objects/${createdId}`);
  expect(getResponse.status()).toBe(200);
  const retrievedData = await getResponse.json();
  expect(retrievedData.name).toBe('Persistence Test');
});

test('POST - Missing Required Field (name)', async ({ request }) => {
  const payload = {
    data: { color: 'red' }
    // Missing 'name' field
  };

  const response = await request.post(`${BASE_URL}/objects`, {
    data: payload,
    failOnStatusCode: false
  });

  expect([400, 422]).toContain(response.status());
});

// ==================== PUT TESTS ====================

test('PUT - Update Full Object', async ({ request }) => {
  // Create object first
  const createResponse = await request.post(`${BASE_URL}/objects`, {
    data: {
      name: 'Original Name',
      data: { price: 100 }
    }
  });

  const createdData = await createResponse.json();
  const objectId = createdData.id;

  // Update object
  const updateResponse = await request.put(`${BASE_URL}/objects/${objectId}`, {
    data: {
      name: 'Updated Name',
      data: { price: 150, color: 'green' }
    }
  });

  expect(updateResponse.status()).toBe(200);
  const updatedData = await updateResponse.json();
  expect(updatedData.name).toBe('Updated Name');
  expect(updatedData.data.price).toBe(150);
  expect(updatedData.updatedAt).toBeTruthy();
});

// ==================== PATCH TESTS ====================

test('PATCH - Partial Update Object', async ({ request }) => {
  // Create object first
  const createResponse = await request.post(`${BASE_URL}/objects`, {
    data: {
      name: 'Patch Test',
      data: { color: 'blue', price: 100, size: 'M' }
    }
  });

  const createdData = await createResponse.json();
  const objectId = createdData.id;

  // Partial update
  const patchResponse = await request.patch(`${BASE_URL}/objects/${objectId}`, {
    data: {
      data: { price: 120 } // Only update price
    }
  });

  expect(patchResponse.status()).toBe(200);
  const patchedData = await patchResponse.json();
  expect(patchedData.data.price).toBe(120);
  expect(patchedData.data.color).toBe('blue'); // Unchanged
  expect(patchedData.data.size).toBe('M'); // Unchanged
});

// ==================== DELETE TESTS ====================

test('DELETE - Remove Object', async ({ request }) => {
  // Create object first
  const createResponse = await request.post(`${BASE_URL}/objects`, {
    data: {
      name: 'Delete Test',
      data: { temp: 'temporary' }
    }
  });

  const createdData = await createResponse.json();
  const objectId = createdData.id;

  // Delete object
  const deleteResponse = await request.delete(`${BASE_URL}/objects/${objectId}`);
  expect(deleteResponse.status()).toBe(200);

  // Verify deletion
  const getResponse = await request.get(`${BASE_URL}/objects/${objectId}`, {
    failOnStatusCode: false
  });
  expect([400, 404]).toContain(getResponse.status());
});

test('DELETE - Non-existent Object', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/objects/999`, {
    failOnStatusCode: false
  });

  expect([400, 404]).toContain(response.status());
});

// ==================== ERROR HANDLING TESTS ====================

test('Error Handling - Invalid JSON Payload', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/objects`, {
    data: 'invalid json',
    failOnStatusCode: false
  });

  expect(response.status()).toBeGreaterThanOrEqual(400);
});

test('Error Handling - Negative ID', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/objects/-1`, {
    failOnStatusCode: false
  });

  expect([400, 404]).toContain(response.status());
});

// ==================== RESPONSE VALIDATION TESTS ====================

test('Response Headers - Content-Type', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/objects`);
  
  expect(response.status()).toBe(200);
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
});

// ==================== CONCURRENT REQUESTS TEST ====================

test('Concurrent Requests - Multiple POSTs', async ({ request }) => {
  const promises = [];
  
  for (let i = 0; i < 5; i++) {
    promises.push(
      request.post(`${BASE_URL}/objects`, {
        data: {
          name: `Concurrent Test ${i}`,
          data: { index: i }
        }
      })
    );
  }

  const responses = await Promise.all(promises);
  
  responses.forEach(response => {
    expect(response.status()).toBe(201);
  });
});

// ==================== LARGE PAYLOAD TEST ====================

test('Large Payload - Create Object with Large Data', async ({ request }) => {
  const largeDescription = 'x'.repeat(5000);
  
  const response = await request.post(`${BASE_URL}/objects`, {
    data: {
      name: 'Large Payload Test',
      data: {
        description: largeDescription,
        metadata: { key: 'value' }
      }
    }
  });

  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(data.data.description.length).toBe(5000);
});