from .rate_limiter import limiter, init_app as init_rate_limiter

def register_middleware(app):
    init_rate_limiter(app)
