# UNSENT Backend

Anonymous emotion-sharing platform backend built with Flask, TextBlob (NLP), and Supabase.

## Features (Phase 2 Implementation)
- **Emotion Detection Engine**: Automatically classifies message sentiment into 9 core emotions.
- **Language Detection**: Automatically identifies message language for better filtering.
- **Rate Limiting**: Protects against abuse with IP-based limits (10 submissions/hour).
- **Supabase Integration**: Robust persistence layer with connection pooling and retry logic.
- **Structured Logging**: Context-aware logging for production monitoring.

## Tech Stack
- **Framework**: Flask (Python 3.10+)
- **NLP**: TextBlob (Sentiment), langdetect (Language)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Pydantic
- **Rate Limiting**: Flask-Limiter

## Local Setup

1. **Prerequisites**: Python 3.10+, Virtual Environment.
2. **Install Dependencies**:
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python -m textblob.download_corpora lite
   ```
3. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials.
4. **Run Development Server**:
   ```bash
   python wsgi.py
   ```
   Server will be available at `http://localhost:5000`.

## Testing
Comprehensive test suite including NLP validation, API endpoints, and database services.
```bash
python run_tests.py
```

## API Documentation
See [docs/API.md](docs/API.md) for detailed endpoint information.

## Deployment
This backend is configured for deployment on **Render**.
- **Blueprint**: `render.yaml`
- **Prod Env**: Use `.env.production.example` as a guide for dashboard environment variables.
