from datetime import datetime, timedelta
import threading
import time

def cleanup_expired_sessions_task(knot_service, session_manager, interval_seconds=300):
    """
    Background task to cleanup expired sessions from DB and memory.
    """
    def run():
        while True:
            try:
                # 1. Database Cleanup
                cleaned_count = knot_service.cleanup_expired_sessions()
                if cleaned_count > 0:
                    print(f"[Cleanup] Cleaned {cleaned_count} expired sessions from DB")

                # 2. Memory Cleanup (Stale waiting rooms > 1 hour)
                # This handles cases where socket disconnected uncleanly and wasn't caught
                # or just general hygiene
                # (Implementation depends on accessing manager internals safely)
                pass 

            except Exception as e:
                print(f"[Cleanup Error] {e}")
            
            time.sleep(interval_seconds)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
