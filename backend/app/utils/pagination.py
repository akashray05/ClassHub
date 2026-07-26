from math import ceil


def paginate(query, page: int, limit: int):
    """
    Paginate a SQLAlchemy query.

    Returns:
        {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": pages,
            "items": [...]
        }
    """

    total = query.count()

    offset = (page - 1) * limit

    items = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "pages": ceil(total / limit) if total else 1,
        "items": items,
    }