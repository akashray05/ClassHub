from pathlib import Path

UPLOAD_DIR = Path("uploads")

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".txt",
    ".zip",
    ".rar",
    ".jpg",
    ".jpeg",
    ".png",
}