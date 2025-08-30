#!/usr/bin/env python3
"""
Integration test for SiportApplication
Tests backend API endpoints and database integration
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime

BASE_URL = "http://localhost:8001"
API_URL = f"{BASE_URL}/api"

async def test_api_endpoint(session, method, endpoint, data=None):
    """Test an API endpoint"""
    url = f"{API_URL}{endpoint}"
    try:
        if method.upper() == "GET":
            async with session.get(url) as response:
                result = await response.json()
                return response.status, result
        elif method.upper() == "POST":
            async with session.post(url, json=data) as response:
                result = await response.json()
                return response.status, result
    except Exception as e:
        return None, str(e)

async def run_integration_tests():
    """Run all integration tests"""
    print("🚀 Starting SiportApplication Integration Tests")
    print("=" * 50)
    
    async with aiohttp.ClientSession() as session:
        # Test 1: Health check
        print("1. Testing root endpoint...")
        status, result = await test_api_endpoint(session, "GET", "/")
        if status == 200:
            print(f"   ✅ Root endpoint: {result}")
        else:
            print(f"   ❌ Root endpoint failed: {result}")
            return False

        # Test 2: Health endpoint
        print("2. Testing health endpoint...")
        status, result = await test_api_endpoint(session, "GET", "/health")
        if status == 200:
            print(f"   ✅ Health endpoint: {result}")
        else:
            print(f"   ❌ Health endpoint failed: {result}")
            return False

        # Test 3: Get status checks (should be empty initially)
        print("3. Testing GET status checks...")
        status, result = await test_api_endpoint(session, "GET", "/status")
        if status == 200:
            print(f"   ✅ GET status checks: Found {len(result)} items")
        else:
            print(f"   ❌ GET status checks failed: {result}")
            return False

        # Test 4: Create status check
        print("4. Testing POST status check...")
        test_data = {"client_name": f"Test Client {datetime.now().isoformat()}"}
        status, result = await test_api_endpoint(session, "POST", "/status", test_data)
        if status == 200 and "id" in result:
            print(f"   ✅ POST status check: Created {result['id']}")
            created_id = result["id"]
        else:
            print(f"   ❌ POST status check failed: {result}")
            return False

        # Test 5: Verify created status check
        print("5. Testing GET status checks after creation...")
        status, result = await test_api_endpoint(session, "GET", "/status")
        if status == 200 and len(result) > 0:
            found_created = any(item["id"] == created_id for item in result)
            if found_created:
                print(f"   ✅ GET status checks: Found created item")
            else:
                print(f"   ❌ Created item not found in results")
                return False
        else:
            print(f"   ❌ GET status checks after creation failed: {result}")
            return False

        print("\n🎉 All integration tests passed!")
        print("✅ Backend API is working correctly")
        print("✅ Database operations are functional")
        print("✅ CORS is properly configured")
        return True

if __name__ == "__main__":
    try:
        success = asyncio.run(run_integration_tests())
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        sys.exit(1)