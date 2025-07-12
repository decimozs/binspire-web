import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import useCollection from "@/queries/use-collection";
import { useSessionStore } from "@/store/use-session-store";
import type { Collection } from "@/schemas/collection-schema";
import type { Session } from "@/routes/dashboard/route";
import { format, isThisMonth, isThisWeek, isThisYear, isToday } from "date-fns";
import {
  Activity,
  MinusCircle,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface CollectionChartProps {
  data: Collection[];
  session: Session | null;
}

export interface TrendResult {
  message: string;
  icon: LucideIcon;
}

export type Timeframe = "daily" | "weekly" | "monthly" | "yearly" | "overall";

function getTrendMessage(
  data: Collection[],
  userId: string | undefined,
): TrendResult {
  if (!userId) {
    return {
      message: "User not identified",
      icon: MinusCircle,
    };
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const previousMonth = format(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    "yyyy-MM",
  );

  const filtered = data.filter((c) => c.collectedBy === userId);

  const monthlyCounts = filtered.reduce<Record<string, number>>((acc, item) => {
    const key = format(new Date(item.createdAt), "yyyy-MM");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const currentCount = monthlyCounts[currentMonth] || 0;
  const prevCount = monthlyCounts[previousMonth] || 0;

  if (currentCount > prevCount) {
    return {
      message: "Steady increase in collections observed",
      icon: TrendingUp,
    };
  } else if (currentCount < prevCount) {
    return {
      message: "Collection activity has slightly decreased",
      icon: TrendingDown,
    };
  } else if (currentCount === 0 && prevCount === 0) {
    return {
      message: "No collection activity recorded",
      icon: MinusCircle,
    };
  } else {
    return {
      message: "Your collection performance has remained stable",
      icon: Activity,
    };
  }
}

function filterByTimeframe(
  data: Collection[],
  timeframe: string,
  userId: string | undefined,
): Collection[] {
  return data.filter((item) => {
    if (item.collectedBy !== userId) return false;
    const date = new Date(item.createdAt);

    switch (timeframe) {
      case "daily":
        return isToday(date);
      case "weekly":
        return isThisWeek(date, { weekStartsOn: 1 });
      case "monthly":
        return isThisMonth(date);
      case "yearly":
        return isThisYear(date);
      case "overall":
      default:
        return true;
    }
  });
}

export interface FilterTimeframeProps {
  value: string;
  onChange: (value: Timeframe) => void;
}

export function FilterTimeframe({ value, onChange }: FilterTimeframeProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="yearly">Yearly</SelectItem>
        <SelectItem value="overall">Overall</SelectItem>
      </SelectContent>
    </Select>
  );
}

function TotalCollectionChart({ data, session }: CollectionChartProps) {
  const [timeframe, setTimeframe] = useState("overall");

  const filteredData = filterByTimeframe(data, timeframe, session?.userId);
  const userCollectionsCount = filteredData.length;

  const chartData = [
    {
      browser: "safari",
      collections: userCollectionsCount,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Collections",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Collection Activity</CardTitle>
          <CardDescription>
            Track how many items you've collected over time.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="collections" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].collections.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Collections
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "Showing all-time collection data"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

function AverageWasteCollected({ data, session }: CollectionChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("overall");

  const filteredData = filterByTimeframe(data, timeframe, session?.userId);

  const groupKeyFormat = {
    daily: "yyyy-MM-dd",
    weekly: "yyyy-'W'II",
    monthly: "yyyy-MM",
    yearly: "yyyy",
    overall: "yyyy-MM-dd",
  }[timeframe] as string;

  const groupedMap = new Map<string, number>();

  for (const collection of filteredData) {
    const key = format(new Date(collection.createdAt), groupKeyFormat);
    const weight = Number(collection.weightLevel);
    groupedMap.set(key, (groupedMap.get(key) || 0) + weight);
  }

  const totalUnits = groupedMap.size || 1;
  const totalWeight = [...groupedMap.values()].reduce((a, b) => a + b, 0);
  const average = Math.round(totalWeight / totalUnits);

  const chartData = [
    {
      browser: "safari",
      waste: average,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Average Waste",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  const labelMap: Record<Timeframe, string> = {
    daily: "Per Day",
    weekly: "Per Week",
    monthly: "Per Month",
    yearly: "Per Year",
    overall: "Overall Avg",
  };

  const readableLabel = labelMap[timeframe];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Average Collection</CardTitle>
          <CardDescription>
            Track the average weight you collect ({readableLabel.toLowerCase()}
            ).
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="waste" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {average.toLocaleString()} kg
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {readableLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "All-time average waste collected"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

function TotalWasteWeightCollectionChart({
  data,
  session,
}: CollectionChartProps) {
  const [timeframe, setTimeframe] = useState("overall");

  const filteredData = filterByTimeframe(data, timeframe, session?.userId);

  const totalWasteWeight = Math.round(
    filteredData.reduce(
      (sum, collection) => sum + Number(collection.weightLevel),
      0,
    ),
  );

  const chartData = [
    {
      browser: "safari",
      waste: totalWasteWeight,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Waste Collected",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Total Waste Collected</CardTitle>
          <CardDescription>
            The total weight of waste you've helped remove from the environment.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="waste" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalWasteWeight.toLocaleString()} kg
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Waste Collected
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendMessage.message} <Icon className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {timeframe === "overall"
            ? "Showing all-time collected waste data"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export default function CollectionSummaryChart() {
  const { getCollections } = useCollection();
  const { session } = useSessionStore();
  const { data } = getCollections;

  if (!data) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Collection Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-[10vh]">
      <TotalCollectionChart data={data} session={session} />
      <TotalWasteWeightCollectionChart data={data} session={session} />
      <AverageWasteCollected data={data} session={session} />
    </div>
  );
}
