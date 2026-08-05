from .local import LocalStorage


def get_storage():
    """
    Return the active storage provider.
    """
    return LocalStorage()
