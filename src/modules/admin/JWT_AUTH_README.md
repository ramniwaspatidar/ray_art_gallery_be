# JWT Authentication for Admin Module

## Overview
JWT (JSON Web Token) authentication has been implemented for the admin module to secure API endpoints.

## Setup

### 1. Environment Variables
Make sure your `.env` file contains:
```env
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 2. How It Works

#### Public Endpoints (No Authentication Required)
- `POST /api/admin` - Create new admin
- `POST /api/admin/validate` - Login and get JWT token

#### Protected Endpoints (JWT Token Required)
- `GET /api/admin` - Get all admins
- `GET /api/admin/me` - Get current authenticated admin
- `GET /api/admin/:id` - Get admin by ID
- `PUT /api/admin/:id` - Update admin
- `DELETE /api/admin/:id` - Delete admin

## Usage

### 1. Login to Get JWT Token

**Request:**
```bash
POST /api/admin/validate
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "yourPlainTextPassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin validated successfully",
  "data": {
    "admin": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2026-02-10T08:10:31.631Z",
      "updatedAt": "2026-02-10T08:10:31.631Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Use JWT Token for Protected Endpoints

Include the JWT token in the `Authorization` header:

**Request:**
```bash
GET /api/admin/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2026-02-10T08:10:31.631Z",
    "updatedAt": "2026-02-10T08:10:31.631Z"
  }
}
```

## Testing with Swagger

1. Go to `http://localhost:3001/api/docs`
2. Click on `POST /api/admin/validate` endpoint
3. Enter your credentials and execute
4. Copy the `accessToken` from the response
5. Click the "Authorize" button at the top of the Swagger page
6. Paste the token (without "Bearer" prefix) and click "Authorize"
7. Now you can access all protected endpoints

## Testing with cURL

### Login:
```bash
curl -X POST http://localhost:3001/api/admin/validate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "yourPassword"
  }'
```

### Access Protected Endpoint:
```bash
curl -X GET http://localhost:3001/api/admin/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Testing with Postman

1. **Login:**
   - Method: POST
   - URL: `http://localhost:3001/api/admin/validate`
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "yourPassword"
     }
     ```
   - Copy the `accessToken` from response

2. **Access Protected Endpoint:**
   - Method: GET
   - URL: `http://localhost:3001/api/admin/me`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer YOUR_JWT_TOKEN_HERE`

## Token Expiration

- Default expiration: 7 days (configurable via `JWT_EXPIRES_IN` env variable)
- When token expires, you'll receive a 401 Unauthorized response
- Simply login again to get a new token

## Security Notes

1. **Never commit your JWT_SECRET to version control**
2. **Use strong, random JWT_SECRET in production**
3. **Always use HTTPS in production**
4. **Store tokens securely on the client side** (e.g., httpOnly cookies or secure storage)
5. **Implement token refresh mechanism for production** (optional enhancement)

## Custom Decorators

### @Public()
Use this decorator to make an endpoint public (bypass JWT authentication):
```typescript
@Public()
@Get('public-endpoint')
publicEndpoint() {
  return 'This is accessible without authentication';
}
```

### @CurrentUser()
Use this decorator to get the current authenticated user:
```typescript
@Get('profile')
getProfile(@CurrentUser() user: any) {
  // user contains: { id, email, role }
  return this.adminService.findOne(user.id);
}
```

## JWT Payload Structure

The JWT token contains:
```json
{
  "sub": 1,           // Admin ID
  "email": "admin@example.com",
  "role": "admin",
  "iat": 1644508800,  // Issued at
  "exp": 1645113600   // Expiration time
}
```
