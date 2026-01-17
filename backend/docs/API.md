# UNSENT API Documentation

Base URL:
- Production: `https://unsent-api.onrender.com`
- Development: `http://localhost:5000`

## Overview
The UNSENT API provides endpoints for anonymous message submission, emotion detection, and global statistics. All requests should use `Content-Type: application/json`.

## Endpoints

### 1. Health Check
`GET /api/health`

Returns the current status of the API and its dependencies.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T17:00:00Z",
  "environment": "production",
  "version": "1.0.0",
  "database": {
    "connected": true,
    "message": "Connected"
  },
  "features": {
    "nlp_available": true,
    "rate_limiting_active": true,
    "supabase_writable": true
  }
}
```

---

### 2. Global Statistics
`GET /api/stats`

Returns aggregated statistics about all stars in the constellation.

**Response (200 OK):**
```json
{
  "total_stars": 1250,
  "stars_by_emotion": {
    "joy": 300,
    "sadness": 450,
    "gratitude": 200,
    ...
  },
  "total_resonance": 5400,
  "last_updated": "2026-01-17T17:05:00Z"
}
```

---

### 3. Valid Emotions
`GET /api/emotions`

Returns a list of all valid emotions supported by the platform.

**Response (200 OK):**
```json
{
  "emotions": [
    {
      "value": "joy",
      "label": "Joy",
      "description": "Happiness and delight"
    },
    ...
  ]
}
```

---

### 4. Submit Message
`POST /api/submit`

Submits an anonymous message for emotion detection and persistence.

**Rate Limit:** 10 requests per hour per IP.

**Request Body:**
```json
{
  "message": "I wish I had told you how much you meant to me."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "star_id": "uuid-string",
  "emotion": "regret",
  "language": "en",
  "resonance_count": 0,
  "message": "Your message has been added to the constellation"
}
```

**Error Responses:**
- `400 Bad Request`: Message is empty or too long.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Database or NLP processing failure.

---

## Testing with cURL

```bash
# Health Check
curl http://localhost:5000/api/health

# Submit Message
curl -X POST http://localhost:5000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"message": "I love the way you laugh."}'
```
