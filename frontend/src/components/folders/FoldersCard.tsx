import { AppCard } from "../app";

type Props = {
  id: number;
  name: string;
  description?: string | null;
  onClick?: () => void;
};

export default function FolderCard({
  name,
  description,
  onClick,
}: Props) {
  return (
    <AppCard
      onClick={onClick}
      className="
        cursor-pointer
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        p-5
        hover:border-cyan-400
        hover:bg-slate-800
        transition
      "
    >
      <h3 className="text-xl font-semibold">
        📁 {name}
      </h3>

      {description && (
        <p className="mt-2 text-gray-400">
          {description}
        </p>
      )}
    </AppCard>
  );
}