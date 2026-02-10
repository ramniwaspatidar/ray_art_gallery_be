# Quick Start - JWT Authentication

## 🚀 Quick Test

### 1. Start your server
```bash
npm run start:dev
```

### 2. Create an admin and get token
```bash
curl -X POST http://localhost:3001/api/admin \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "admin@example.com",
    "password": "myPassword123",
    "role": "admin"
  }'
```

**Copy the `accessToken` from the response.**

### 3. Use the token
```bash
# Replace YOUR_TOKEN with the actual token
curl -X GET http://localhost:3001/api/admin/me \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 📋 Summary

**What Changed:**
- ✅ JWT authentication added to admin module
- ✅ `POST /api/admin` now returns a JWT token
- ✅ `POST /api/admin/validate` returns a JWT token
- ✅ All other admin endpoints require JWT token in Authorization header
- ✅ New endpoint: `GET /api/admin/me` to get current authenticated user

**Public Endpoints (No Token):**
- `POST /api/admin` - Create admin
- `POST /api/admin/validate` - Login

**Protected Endpoints (Token Required):**
- `GET /api/admin/me` - Get current user
- `GET /api/admin` - Get all admins
- `GET /api/admin/:id` - Get specific admin
- `PUT /api/admin/:id` - Update admin
- `DELETE /api/admin/:id` - Delete admin

**Token Usage:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Automated Test

Run the test script:
```bash
./test-jwt-auth.sh
```

This will:
1. Create a new admin
2. Get the JWT token
3. Test all protected endpoints
4. Test without token (should fail)

---

## 📚 More Examples

See `CURL_EXAMPLES.md` for detailed cURL examples.

See `src/modules/admin/JWT_AUTH_README.md` for complete documentation.
