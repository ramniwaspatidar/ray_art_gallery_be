#!/bin/bash

# JWT Authentication Test Script for Admin Module
# This script demonstrates how to create an admin and use the JWT token

BASE_URL="http://localhost:3001/api"

echo "=========================================="
echo "JWT Authentication Test"
echo "=========================================="
echo ""

# Step 1: Create a new admin and get JWT token
echo "Step 1: Creating new admin..."
echo ""

CREATE_RESPONSE=$(curl -s -X 'POST' \
  "${BASE_URL}/admin" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "John Doe",
  "email": "admin+test@example.com",
  "password": "securePassword123",
  "role": "admin"
}')

echo "Create Admin Response:"
echo "$CREATE_RESPONSE" | jq '.'
echo ""

# Extract the access token from the response
ACCESS_TOKEN=$(echo "$CREATE_RESPONSE" | jq -r '.data.accessToken')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to get access token. Admin might already exist."
  echo ""
  echo "Trying to login instead..."
  echo ""
  
  # Try to login with existing credentials
  LOGIN_RESPONSE=$(curl -s -X 'POST' \
    "${BASE_URL}/admin/validate" \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "email": "admin+test@example.com",
    "password": "securePassword123"
  }')
  
  echo "Login Response:"
  echo "$LOGIN_RESPONSE" | jq '.'
  echo ""
  
  ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
  
  if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Failed to get access token from login. Exiting."
    exit 1
  fi
fi

echo "✅ Access Token obtained: ${ACCESS_TOKEN:0:50}..."
echo ""

# Step 2: Test protected endpoint - Get current user
echo "=========================================="
echo "Step 2: Testing GET /admin/me (Protected)"
echo "=========================================="
echo ""

ME_RESPONSE=$(curl -s -X 'GET' \
  "${BASE_URL}/admin/me" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "Current User Response:"
echo "$ME_RESPONSE" | jq '.'
echo ""

# Step 3: Test protected endpoint - Get all admins
echo "=========================================="
echo "Step 3: Testing GET /admin (Protected)"
echo "=========================================="
echo ""

ALL_ADMINS_RESPONSE=$(curl -s -X 'GET' \
  "${BASE_URL}/admin?page=1&limit=10" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "All Admins Response:"
echo "$ALL_ADMINS_RESPONSE" | jq '.'
echo ""

# Step 4: Test protected endpoint - Get admin by ID
echo "=========================================="
echo "Step 4: Testing GET /admin/:id (Protected)"
echo "=========================================="
echo ""

ADMIN_ID=$(echo "$ME_RESPONSE" | jq -r '.data.id')

if [ "$ADMIN_ID" != "null" ] && [ -n "$ADMIN_ID" ]; then
  ADMIN_BY_ID_RESPONSE=$(curl -s -X 'GET' \
    "${BASE_URL}/admin/${ADMIN_ID}" \
    -H 'accept: application/json' \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")
  
  echo "Admin by ID Response:"
  echo "$ADMIN_BY_ID_RESPONSE" | jq '.'
  echo ""
fi

# Step 5: Test without token (should fail)
echo "=========================================="
echo "Step 5: Testing without token (Should Fail)"
echo "=========================================="
echo ""

NO_TOKEN_RESPONSE=$(curl -s -X 'GET' \
  "${BASE_URL}/admin/me" \
  -H 'accept: application/json')

echo "Response without token:"
echo "$NO_TOKEN_RESPONSE" | jq '.'
echo ""

echo "=========================================="
echo "✅ JWT Authentication Test Complete!"
echo "=========================================="
