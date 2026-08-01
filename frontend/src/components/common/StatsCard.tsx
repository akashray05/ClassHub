import { Card, CardContent } from "../ui/card";

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export default function StatsCard({
  title,
  value,
  subtitle,
}: StatsCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardContent className="p-6">
        <p className="text-gray-400 text-sm">{title}</p>

        <h2 className="text-3xl font-bold text-cyan-400 mt-2">
          {value}
        </h2>

        {subtitle && (
          <p className="text-xs text-gray-500 mt-2">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}