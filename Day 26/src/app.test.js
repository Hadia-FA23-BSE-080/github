import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from './app';

describe('Express API Routes', () => {
  describe('GET /api/status', () => {
    it('should return a 200 status and success message', async () => {
      const response = await request(app).get('/api/status');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'API is running successfully!'
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user and return 201 status', async () => {
      const newUser = { name: 'Bob' };
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');
        
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        user: { id: 1, name: 'Bob' }
      });
    });

    it('should return a 400 error if name is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .set('Accept', 'application/json');
        
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Name is required');
    });
  });
});
