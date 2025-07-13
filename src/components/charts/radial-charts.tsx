import type { ChartProps, Timeframe } from "@/lib/types";
import {
  calculateAverageResolutionHours,
  filterByTimeframe,
  getCollectionTrendMessage,
  getIssueTrendMessage,
  getTaskTrendMessage,
} from "@/lib/utils";
import type { Collection } from "@/schemas/collection-schema";
import { format, isBefore, isToday } from "date-fns";
import { useState } from "react";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import FilterTimeframe from "./filter-timeframe";
import type { Task } from "@/schemas/task-schema";
import type { Issue } from "@/schemas/issue-schema";
import { ExportTableDataToExcel } from "../core/generate-excel-file";

export function AverageWasteCollectedRadialChart({
  data,
  session,
}: ChartProps<Collection>) {
  const [timeframe, setTimeframe] = useState<Timeframe>("overall");
  const isAdmin = session?.role === "admin";

  const filteredData = isAdmin
    ? filterByTimeframe(data, timeframe)
    : filterByTimeframe(data, timeframe, {
        userId: session?.userId,
        userIdProperty: "collectedBy",
      });

  const groupKeyFormat = {
    daily: "yyyy-MM-dd",
    weekly: "yyyy-'W'II",
    monthly: "yyyy-MM",
    yearly: "yyyy",
    overall: "yyyy-MM-dd",
  }[timeframe];

  const groupedMap = new Map<string, number>();
  for (const collection of filteredData) {
    const key = format(new Date(collection.createdAt), groupKeyFormat);
    const weight = Number(collection.weightLevel) || 0;
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

  const trendMessage = getCollectionTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  const labelMap: Record<Timeframe, string> = {
    daily: "Per Day",
    weekly: "Per Week",
    monthly: "Per Month",
    yearly: "Per Year",
    overall: "Overall Avg",
  };

  const readableLabel = labelMap[timeframe];

  const exportableData = Array.from(groupedMap.entries()).map(
    ([date, weight]) => ({
      Date: date,
      "Collected Weight (kg)": weight,
      "Percentage of Total (%)": ((weight / totalWeight) * 100).toFixed(2),
      Timeframe: readableLabel,
      "Average Weight (kg)": average,
    }),
  );

  if (!isAdmin) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center">
          <div>
            <CardTitle>Your Average Collection</CardTitle>
            <CardDescription>
              Track the average weight you collect (
              {readableLabel.toLowerCase()}
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

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="items-center">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <FilterTimeframe value={timeframe} onChange={setTimeframe} />
            <ExportTableDataToExcel
              data={exportableData}
              filename={`average-waste-${timeframe}.xlsx`}
            />
          </div>
          <CardTitle>Average Collection Per Entry</CardTitle>
          <CardDescription className="-mt-4">
            View the average waste weight collected per entry (
            {readableLabel.toLowerCase()}).
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
    </Card>
  );
}

export function TotalCollectionRadialChart({
  data,
  session,
}: ChartProps<Collection>) {
  const [timeframe, setTimeframe] = useState("overall");
  const overallFilteredData = filterByTimeframe(data, timeframe);
  const userFilterdData = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "collectedBy",
  });

  const overallCollectionsCount = overallFilteredData.length;
  const userCollectionsCount = userFilterdData.length;

  const isAdmin = session?.role === "admin";

  const chartData = [
    {
      browser: "safari",
      collections: isAdmin ? overallCollectionsCount : userCollectionsCount,
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

  const trendMessage = getCollectionTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  const exportableData = overallFilteredData.map((item) => ({
    Date: format(new Date(item.createdAt), "yyyy-MM-dd"),
    "Collected By": item.collectedBy || "N/A",
    Waste: item.wasteLevel ?? 0,
    "Weight (kg)": item.weightLevel ?? 0,
    Battery: item.batteryLevel ?? 0,
    "Bin ID": item.id || "Unknown",
    Timeframe: timeframe,
  }));

  if (!isAdmin) {
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

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="items-center">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <FilterTimeframe value={timeframe} onChange={setTimeframe} />
            <ExportTableDataToExcel
              data={exportableData}
              filename={`total-collections-${timeframe}.xlsx`}
            />
          </div>
          <CardTitle>Collection Overview</CardTitle>
          <CardDescription className="-mt-4">
            Monitor collection performance and trends across time.
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
    </Card>
  );
}

export function TotalWasteWeightCollectionRadialChart({
  data,
  session,
}: ChartProps<Collection>) {
  const [timeframe, setTimeframe] = useState("overall");
  const isAdmin = session?.role === "admin";

  const filteredData = isAdmin
    ? filterByTimeframe(data, timeframe)
    : filterByTimeframe(data, timeframe, {
        userId: session?.userId,
        userIdProperty: "collectedBy",
      });

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

  const trendMessage = getCollectionTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  const exportableData = isAdmin
    ? filteredData.map((item) => ({
        Date: format(new Date(item.createdAt), "yyyy-MM-dd"),
        "Collected By": item.collectedBy || "N/A",
        "Weight (kg)": item.weightLevel ?? 0,
        "Bin ID": item.id || "Unknown",
        Timeframe: timeframe,
      }))
    : [];

  if (!isAdmin) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center">
          <div>
            <CardTitle>Your Total Waste Collected</CardTitle>
            <CardDescription>
              The total weight of waste you've helped remove from the
              environment.
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

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center">
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <FilterTimeframe value={timeframe} onChange={setTimeframe} />
            <ExportTableDataToExcel
              data={exportableData}
              filename={`total-weight-collection-${timeframe}.xlsx`}
            />
          </div>
          <CardTitle>Total Waste Collected</CardTitle>
          <CardDescription className="-mt-4">
            Aggregated weight of waste collected across all operations.
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
                          className="fill-foreground text-2xl font-bold"
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
    </Card>
  );
}

export function TotalTaskCompletedRadialChart({
  data,
  session,
}: ChartProps<Task>) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "assignedTo",
  });
  const completedTasks = filtered.filter((t) => t.status === "done");

  const chartData = [
    {
      browser: "safari",
      completed: completedTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Tasks Completed",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Completed Tasks</CardTitle>
          <CardDescription>
            Track your progress on completed tasks and activities.
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
            <RadialBar dataKey="completed" background cornerRadius={10} />
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
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Completed
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
            ? "Showing all-time completed tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export function TaskDueTodayChart({ data, session }: ChartProps<Task>) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "assignedTo",
  });

  const dueTodayTasks = filtered.filter(
    (t) => isToday(new Date(t.dueAt)) && t.status !== "done",
  );

  const chartData = [
    {
      browser: "safari",
      completed: dueTodayTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Tasks Completed",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Today's Tasks</CardTitle>
          <CardDescription>
            Your pending tasks that need attention today.
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
            <RadialBar dataKey="completed" background cornerRadius={10} />
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
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Due Tasks
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
            ? "Showing all-time completed tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export function TaskOverdueRadialChart({ data, session }: ChartProps<Task>) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "assignedTo",
  });

  const overdueTasks = filtered.filter((t) => {
    if (!t.dueAt || t.status === "done") return false;
    const dueDate = new Date(t.dueAt);
    return isBefore(dueDate, new Date()) && !isToday(dueDate);
  });

  const chartData = [
    {
      browser: "safari",
      completed: overdueTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Overdue Tasks",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Your Overdue Tasks</CardTitle>
          <CardDescription>
            Tasks that need your immediate attention.
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
              className="first:fill-muted last:fill-background"
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="completed" background cornerRadius={10} />
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
                          {chartData[0].completed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Overdue
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
            ? "Showing all-time overdue tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export function AverageTaskCompletionRadialChart({
  data,
  session,
}: ChartProps<Task>) {
  const [timeframe, setTimeframe] = useState<Timeframe>("overall");

  const filtered = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "assignedTo",
  });
  const completedTasks = filtered.filter((t) => t.status === "done");

  const taskPerDayMap = new Map<string, number>();

  for (const task of completedTasks) {
    const dateKey = format(new Date(task.createdAt), "yyyy-MM-dd");
    taskPerDayMap.set(dateKey, (taskPerDayMap.get(dateKey) || 0) + 1);
  }

  const totalDays = taskPerDayMap.size || 1;
  const totalCompleted = completedTasks.length;
  const averageCompleted = Math.round(totalCompleted / totalDays);

  const chartData = [
    {
      browser: "safari",
      completed: averageCompleted,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Average Tasks",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getTaskTrendMessage(data, session?.userId);
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
          <CardTitle>Your Task Completion Rate</CardTitle>
          <CardDescription>
            Your average task completion {readableLabel.toLowerCase()}.
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
              className="first:fill-muted last:fill-background"
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="completed" background cornerRadius={10} />
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
                          {chartData[0].completed.toLocaleString()}
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
            ? "Average per day across all completed tasks"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}

export function TotalIssuesResolvedRadialChart({
  data,
  session,
}: ChartProps<Issue>) {
  const [timeframe, setTimeframe] = useState("overall");

  const filtered = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "assignedTo",
  });

  const resolvedTasks = filtered.filter((t) => t.status === "resolved");

  const chartData = [
    {
      browser: "safari",
      visitors: resolvedTasks.length,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Issues Resolved",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getIssueTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div>
          <CardTitle>Your Issue Resolution</CardTitle>
          <CardDescription>
            Track how many issues you've successfully resolved
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Issues Resolved
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
            ? "All-time issue resolution data"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>{" "}
    </Card>
  );
}

export function AverageResolutionRateRadialChart({
  data,
  session,
}: ChartProps<Issue>) {
  const [timeframe, setTimeframe] = useState("overall");
  const filtered = filterByTimeframe(data, timeframe, {
    userId: session?.userId,
    userIdProperty: "assignedTo",
  });
  const avgHours = calculateAverageResolutionHours(filtered);

  const chartData = [
    {
      browser: "safari",
      visitors: avgHours,
      fill: "var(--color-safari)",
    },
  ];

  const chartConfig = {
    visitors: {
      label: "Average Resolution Time",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const trendMessage = getIssueTrendMessage(data, session?.userId);
  const Icon = trendMessage.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div>
          <CardTitle>Your Response Efficiency</CardTitle>
          <CardDescription>
            Your average time to resolve issues (in hours)
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
            <RadialBar dataKey="visitors" background cornerRadius={10} />
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
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          hrs avg
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
            ? "All-time average resolution"
            : `Filtered by ${timeframe}`}
        </div>
      </CardFooter>
      <div className="flex items-center justify-center">
        <FilterTimeframe value={timeframe} onChange={setTimeframe} />
      </div>
    </Card>
  );
}
