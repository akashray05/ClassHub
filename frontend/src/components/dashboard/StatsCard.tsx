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
    <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/60 transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-muted-foreground text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-foreground mt-2">
            {value}
          </h2>

        </div>

        <div className="text-primary text-3xl">
          {icon}
        </div>

      </div>

    </div>
  );
}