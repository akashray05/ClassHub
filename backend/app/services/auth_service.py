def get_storage_info(current_user):
    used = current_user.storage_used
    quota = current_user.storage_quota

    return {
        "used": used,
        "quota": quota,
        "available": quota - used,
        "usage_percent": round((used / quota) * 100, 2) if quota else 0,
    }