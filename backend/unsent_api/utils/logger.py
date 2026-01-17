import logging
import sys
from flask import request, has_request_context

class RequestFormatter(logging.Formatter):
    """Injects request ID into log records."""
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None
        return super().format(record)

def setup_logger(app_name, log_level='INFO'):
    """Sets up a structured logger."""
    handler = logging.StreamHandler(sys.stdout)
    formatter = RequestFormatter(
        '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
        '%(levelname)s in %(module)s: %(message)s'
    )
    handler.setFormatter(formatter)
    
    logger = logging.getLogger(app_name)
    logger.setLevel(log_level)
    logger.addHandler(handler)
    
    return logger
