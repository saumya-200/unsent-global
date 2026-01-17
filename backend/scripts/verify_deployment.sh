#!/bin/bash

# UNSENT Deployment Verification Script
# Usage: ./verify_deployment.sh [URL]

URL=${1:-"http://localhost:5000"}
echo "Testing backend at: $URL"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function check_endpoint() {
    local endpoint=$1
    local expected_code=$2
    local method=${3:-"GET"}
    local data=$4
    
    echo -n "Checking $method $endpoint... "
    
    if [ "$method" == "POST" ]; then
        code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL$endpoint" -H "Content-Type: application/json" -d "$data")
    else
        code=$(curl -s -o /dev/null -w "%{http_code}" "$URL$endpoint")
    fi
    
    if [ "$code" == "$expected_code" ]; then
        echo -e "${GREEN}PASS ($code)${NC}"
        return 0
    else
        echo -e "${RED}FAIL ($code, expected $expected_code)${NC}"
        return 1
    fi
}

errors=0

check_endpoint "/api/health" 200 || errors=$((errors+1))
check_endpoint "/api/stats" 200 || errors=$((errors+1))
check_endpoint "/api/emotions" 200 || errors=$((errors+1))

# Test valid submission
check_endpoint "/api/submit" 201 "POST" '{"message": "Verification test message"}' || errors=$((errors+1))

# Test validation error
check_endpoint "/api/submit" 400 "POST" '{"message": ""}' || errors=$((errors+1))

if [ $errors -eq 0 ]; then
    echo -e "\n${GREEN}ALL TESTS PASSED${NC}"
    exit 0
else
    echo -e "\n${RED}$errors TESTS FAILED${NC}"
    exit 1
fi
