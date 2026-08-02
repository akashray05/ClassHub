import { uploadFile } from "../../services/file";

type Props = {
  folderId: number;
  onUploadSuccess: () => void;
};

export default function FileUpload({
  folderId,
  onUploadSuccess,
}: Props) {

  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = event.target.files?.[0];

    if (!file) return;

    try {

      await uploadFile(folderId, file);

      onUploadSuccess();

    } catch (error) {

      console.error(error);

      alert("Upload failed");

    }

  }

  return (
    <input
      type="file"
      onChange={handleChange}
    />
  );
}