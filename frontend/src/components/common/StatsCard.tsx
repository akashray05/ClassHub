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
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <p className="text-muted-foreground text-sm">{title}</p>

        <h2 className="text-3xl font-bold text-primary mt-2">
          {value}
        </h2>

        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}