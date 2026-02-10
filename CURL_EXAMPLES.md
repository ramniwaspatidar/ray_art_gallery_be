# JWT Authentication - cURL Examples

## Step 1: Create Admin and Get Token

```bash
curl -X 'POST' \
  'http://localhost:3001/api/admin' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "John Doe",
  "email": "admin+1@example.com",
  "password": "securePassword123",
  "role": "admin"
}'
```

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "id": 1,
      "name": "John Doe",
      "email": "admin+1@example.com",
      "role": "admin",
      "createdAt": "2026-02-10T08:10:31.631Z",
      "updatedAt": "2026-02-10T08:10:31.631Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW4rMUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY0NDUwODgwMCwiZXhwIjoxNjQ1MTEzNjAwfQ.abc123..."
  }
}
```

**Copy the `accessToken` value for use in subsequent requests.**

---

## Step 2: Login (If Admin Already Exists)

```bash
curl -X 'POST' \
  'http://localhost:3001/api/admin/validate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "admin+1@example.com",
  "password": "securePassword123"
}'
```

**Response:**
```json
{
  "success": true,
  "message": "Admin validated successfully",
  "data": {
    "admin": {
      "id": 1,
      "name": "John Doe",
      "email": "admin+1@example.com",
      "role": "admin",
      "createdAt": "2026-02-10T08:10:31.631Z",
      "updatedAt": "2026-02-10T08:10:31.631Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Step 3: Use Token to Access Protected Endpoints

### Get Current User (Me)

```bash
curl -X 'GET' \
  'http://localhost:3001/api/admin/me' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN_HERE'
```

**Replace `YOUR_ACCESS_TOKEN_HERE` with the actual token from Step 1 or 2.**

---

### Get All Admins

```bash
curl -X 'GET' \
  'http://localhost:3001/api/admin?page=1&limit=10' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN_HERE'
```

---

### Get Admin by ID

```bash
curl -X 'GET' \
  'http://localhost:3001/api/admin/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN_HERE'
```

---

### Update Admin

```bash
curl -X 'PUT' \
  'http://localhost:3001/api/admin/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "John Doe Updated"
}'
```

---

### Delete Admin

```bash
curl -X 'DELETE' \
  'http://localhost:3001/api/admin/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN_HERE'
```

---

## Complete Example Workflow

```bash
# 1. Create admin and save token
RESPONSE=$(curl -s -X 'POST' \
  'http://localhost:3001/api/admin' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "John Doe",
  "email": "admin+1@example.com",
  "password": "securePassword123",
  "role": "admin"
}')

# 2. Extract token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.data.accessToken')

# 3. Use token to get current user
curl -X 'GET' \
  'http://localhost:3001/api/admin/me' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN"

# 4. Use token to get all admins
curl -X 'GET' \
  'http://localhost:3001/api/admin' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Without Token (Should Fail)

```bash
curl -X 'GET' \
  'http://localhost:3001/api/admin/me' \
  -H 'accept: application/json'
```

**Expected Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Notes

1. **Public Endpoints (No Token Required):**
   - `POST /api/admin` - Create admin
   - `POST /api/admin/validate` - Login

2. **Protected Endpoints (Token Required):**
   - `GET /api/admin/me` - Get current user
   - `GET /api/admin` - Get all admins
   - `GET /api/admin/:id` - Get admin by ID
   - `PUT /api/admin/:id` - Update admin
   - `DELETE /api/admin/:id` - Delete admin

3. **Token Format:**
   - Always use: `Authorization: Bearer YOUR_TOKEN`
   - Don't include "Bearer" in the token value itself

4. **Token Expiration:**
   - Default: 7 days
   - After expiration, you'll get a 401 Unauthorized response
   - Simply login again to get a new token
