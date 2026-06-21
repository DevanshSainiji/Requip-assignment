/**
 * user.test.ts — Integration test suite for the User Management API.
 *
 * Strategy:
 *   - Real HTTP requests via Supertest against the actual Express app.
 *   - Real MySQL queries against `requip_test_db` (configured in .env.test).
 *   - `beforeEach` in setup.ts hard-deletes all rows before every test
 *     so each test starts with a clean slate.
 *   - No mocking of repositories, services, or Prisma — tests the full stack.
 *
 * Coverage targets:
 *   routes → controllers → services → repositories → DB
 *   error paths: validation (400), not found (404), conflict (409)
 */

import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';
import { API_BASE, nextUser } from './helpers';

// ─── Shorthand ────────────────────────────────────────────────────────────────
const api = (path: string) => `${API_BASE}${path}`;
const post = (path: string, body: object) =>
  request(app).post(api(path)).send(body).set('Content-Type', 'application/json');
const get = (path: string, query: Record<string, unknown> = {}) =>
  request(app).get(api(path)).query(query);
const put = (path: string, body: object) =>
  request(app).put(api(path)).send(body).set('Content-Type', 'application/json');
const del = (path: string) => request(app).delete(api(path));

// ─── 1. Health check ──────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200 with success envelope and a timestamp', async () => {
    const res = await get('/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is healthy');
    expect(typeof res.body.data.timestamp).toBe('string');
  });
});

// ─── 2. Unknown route — tests notFound middleware ─────────────────────────────

describe('Unknown route', () => {
  it('returns 404 for a route that does not exist', async () => {
    const res = await get('/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── 3. POST /users ───────────────────────────────────────────────────────────

describe('POST /users', () => {
  it('creates a user with a valid payload and returns 201', async () => {
    const payload = nextUser();
    const res = await post('/users', payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User created successfully');

    const data = res.body.data;
    expect(data.id).toBeDefined();
    expect(data.name).toBe(payload.name);
    expect(data.email).toBe(payload.email.toLowerCase());
    expect(data.pan).toBe(payload.pan.toUpperCase());
    expect(data.deletedAt).toBeNull();
    expect(data.createdAt).toBeDefined();
  });

  it('normalises lowercase PAN to uppercase before storage', async () => {
    const payload = nextUser({ pan: 'abcde1234f' });
    const res = await post('/users', payload);

    expect(res.status).toBe(201);
    expect(res.body.data.pan).toBe('ABCDE1234F');
  });

  it('normalises uppercase email — ensures uniqueness check is case-insensitive', async () => {
    const payload = nextUser({ email: 'User@EXAMPLE.com' });
    const res = await post('/users', payload);

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('user@example.com');
  });

  it('returns 409 when email already exists', async () => {
    const first = nextUser();
    await post('/users', first);

    const duplicate = nextUser({ email: first.email });
    const res = await post('/users', duplicate);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('returns 409 when PAN already exists', async () => {
    const first = nextUser();
    await post('/users', first);

    const duplicate = nextUser({ pan: first.pan });
    const res = await post('/users', duplicate);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 when Aadhaar already exists', async () => {
    const first = nextUser();
    await post('/users', first);

    const duplicate = nextUser({ aadhaar: first.aadhaar });
    const res = await post('/users', duplicate);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 with field error when primaryMobile has wrong length', async () => {
    const res = await post('/users', nextUser({ primaryMobile: '987654321' })); // 9 digits

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toContain('primaryMobile');
  });

  it('returns 400 with field error when PAN format is invalid', async () => {
    const res = await post('/users', nextUser({ pan: '1BCDE1234F' })); // starts with digit

    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toContain('pan');
  });

  it('returns 400 with field error when Aadhaar contains letters', async () => {
    const res = await post('/users', nextUser({ aadhaar: '12345678901A' })); // letter at end

    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toContain('aadhaar');
  });

  it('returns 400 when name is missing', async () => {
    const { name, ...payload } = nextUser();
    void name; // silence unused var
    const res = await post('/users', payload);

    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toContain('name');
  });

  it('returns 400 when dateOfBirth is in the future', async () => {
    const res = await post('/users', nextUser({ dateOfBirth: '2099-01-01' }));

    expect(res.status).toBe(400);
  });

  it('trims leading/trailing whitespace from name before saving', async () => {
    const res = await post('/users', nextUser({ name: '  Alice  ' }));

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Alice');
  });
});

// ─── 4. GET /users (list with pagination) ────────────────────────────────────

describe('GET /users', () => {
  /**
   * Seed 5 users before each test in this describe block.
   * Global beforeEach (setup.ts) wipes the DB first, then this
   * describe-level beforeEach populates it.
   */
  beforeEach(async () => {
    const payloads = [
      nextUser({ name: 'Alice Anderson', email: 'alice@example.com' }),
      nextUser({ name: 'Bob Baker' }),
      nextUser({ name: 'Charlie Clark' }),
      nextUser({ name: 'Diana Davis' }),
      nextUser({ name: 'Eve Evans', email: 'eve@searchme.com' }),
    ];
    for (const p of payloads) {
      await post('/users', p);
    }
  });

  it('returns paginated users with default page=1 and limit=10', async () => {
    const res = await get('/users');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5); // all 5 fit in default limit of 10

    // Pagination meta must be present
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
    });
  });

  it('respects custom page and limit', async () => {
    const res = await get('/users', { page: 1, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: 2,
      total: 5,
      totalPages: 3,
    });
  });

  it('returns the next page when page=2 limit=2', async () => {
    const res = await get('/users', { page: 2, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.page).toBe(2);
  });

  it('returns an empty array when page exceeds total pages', async () => {
    const res = await get('/users', { page: 99, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(5);
  });

  it('filters by name search (case-insensitive in MySQL)', async () => {
    const res = await get('/users', { search: 'alice' });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Alice Anderson');
  });

  it('filters by email search', async () => {
    const res = await get('/users', { search: 'searchme.com' });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].email).toBe('eve@searchme.com');
  });

  it('returns empty array when search term matches nothing', async () => {
    const res = await get('/users', { search: 'zzznomatch' });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });

  it('does NOT return soft-deleted users in the list', async () => {
    // Grab the first user from the list and soft-delete them
    const listRes = await get('/users');
    const userId = listRes.body.data[0].id as number;
    await del(`/users/${userId}`);

    // List should now have 4 users
    const res = await get('/users');
    expect(res.body.data.length).toBe(4);
    expect(res.body.pagination.total).toBe(4);

    // The deleted user must not appear
    const ids = res.body.data.map((u: { id: number }) => u.id);
    expect(ids).not.toContain(userId);
  });

  it('returns 400 for an invalid limit value', async () => {
    const res = await get('/users', { limit: 0 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when limit exceeds the maximum of 100', async () => {
    const res = await get('/users', { limit: 101 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── 5. GET /users/:id ───────────────────────────────────────────────────────

  describe('GET /api/v1/users/stats', () => {
    it('should return statistics with 200 status', async () => {
      const response = await request(app).get('/api/v1/users/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('activeUsers');
      expect(response.body.data).toHaveProperty('deletedUsers');
      expect(response.body.data).toHaveProperty('recentUsers');
    });
  });

  describe('GET /api/v1/users/:id', () => {
  it('returns the user when ID is valid and user is active', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    const res = await get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(userId);
    expect(res.body.data.deletedAt).toBeNull();
  });

  it('returns 404 for a non-existent user ID', async () => {
    const res = await get('/users/999999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for a soft-deleted user', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    // Soft-delete the user
    await del(`/users/${userId}`);

    // GET should now return 404
    const res = await get(`/users/${userId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for a non-numeric ID', async () => {
    const res = await get('/users/abc');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for a negative ID', async () => {
    const res = await get('/users/-1');

    expect(res.status).toBe(400);
  });
});

// ─── 6. PUT /users/:id ───────────────────────────────────────────────────────

describe('PUT /users/:id', () => {
  it('updates a user successfully and returns the updated record', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    const res = await put(`/users/${userId}`, { name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated Name');
    expect(res.body.data.id).toBe(userId);
  });

  it('can update email, PAN, and Aadhaar independently', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;
    const newUser = nextUser(); // unique values

    const res = await put(`/users/${userId}`, {
      email: newUser.email,
      pan: newUser.pan,
      aadhaar: newUser.aadhaar,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(newUser.email.toLowerCase());
    expect(res.body.data.pan).toBe(newUser.pan.toUpperCase());
    expect(res.body.data.aadhaar).toBe(newUser.aadhaar);
  });

  it('returns 409 when updated email conflicts with an existing user', async () => {
    const first = nextUser();
    const second = nextUser();
    await post('/users', first);
    const secondRes = await post('/users', second);
    const secondId: number = secondRes.body.data.id;

    // Try to give second user's email to the first user's email value
    const res = await put(`/users/${secondId}`, { email: first.email });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 when updated PAN conflicts with an existing user', async () => {
    const first = nextUser();
    const second = nextUser();
    await post('/users', first);
    const secondRes = await post('/users', second);
    const secondId: number = secondRes.body.data.id;

    const res = await put(`/users/${secondId}`, { pan: first.pan });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 when updated Aadhaar conflicts with an existing user', async () => {
    const first = nextUser();
    const second = nextUser();
    await post('/users', first);
    const secondRes = await post('/users', second);
    const secondId: number = secondRes.body.data.id;

    const res = await put(`/users/${secondId}`, { aadhaar: first.aadhaar });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when body is completely empty', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    const res = await put(`/users/${userId}`, {});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    // Message from our .refine() validation
    expect(res.body.message).toMatch(/validation/i);
  });

  it('returns 404 when updating a non-existent user', async () => {
    const res = await put('/users/999999', { name: 'Ghost' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for a non-numeric ID', async () => {
    const res = await put('/users/abc', { name: 'Test' });

    expect(res.status).toBe(400);
  });
});

// ─── 7. DELETE /users/:id ─────────────────────────────────────────────────────

describe('DELETE /users/:id', () => {
  it('soft-deletes a user and returns 200', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    const res = await del(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('sets deletedAt timestamp in the database (verifies soft-delete, not hard-delete)', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    await del(`/users/${userId}`);

    // Query the raw DB to confirm deletedAt is populated
    const dbRecord = await prisma.user.findUnique({ where: { id: userId } });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.deletedAt).not.toBeNull();
    // The row still exists — it is NOT hard-deleted
    expect(dbRecord?.id).toBe(userId);
  });

  it('returns 404 when trying to delete an already soft-deleted user', async () => {
    const createRes = await post('/users', nextUser());
    const userId: number = createRes.body.data.id;

    await del(`/users/${userId}`); // first delete
    const res = await del(`/users/${userId}`); // second delete

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 when deleting a non-existent user', async () => {
    const res = await del('/users/999999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for a non-numeric ID', async () => {
    const res = await del('/users/not-a-number');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
