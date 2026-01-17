from flask import request

def get_client_ip():
    """
    Extract the real client IP, considering proxy headers.
    """
    if request.headers.get('X-Forwarded-For'):
        # X-Forwarded-For: client, proxy1, proxy2
        # We take the first one
        ip = request.headers.get('X-Forwarded-For').split(',')[0].strip()
        return ip
    
    if request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
        
    return request.remote_addr
