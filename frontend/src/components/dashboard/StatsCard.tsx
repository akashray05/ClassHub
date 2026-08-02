type Props = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

export default function StatsCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 hover:border-cyan-400 transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>

        </div>

        <div className="text-cyan-400 text-3xl">
          {icon}
        </div>

      </div>

    </div>
  );
}