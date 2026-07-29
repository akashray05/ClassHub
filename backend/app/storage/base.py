from abc import ABC, abstractmethod
from fastapi import UploadFile


class StorageProvider(ABC):
    """
    Abstract base class for all storage providers.
    """

    @abstractmethod
    def save_file(
        self,
        current_user,
        folder_id: int,
        file: UploadFile,
    ):
        pass

    @abstractmethod
    def delete_file(
        self,
        file_path: str,
    ):
        pass

    @abstractmethod
    def file_exists(
        self,
        file_path: str,
    ) -> bool:
        pass

    @abstractmethod
    def get_file_response(
        self,
        file_path: str,
        filename: str,
        mime_type: str,
    ):
        pass