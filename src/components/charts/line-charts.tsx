import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import type { Collection } from "@/schemas/collection-schema";
import type { ChartProps } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { ExportTableDataToExcel } from "../core/generate-excel-file";

export function TotalCollectionLineChart({ data }: ChartProps<Collection>) {
  const groupDataByMonth = data.reduce<
    Record<
      string,
      {
        count: number;
        items: Collection[];
        monthName: string;
        year: string;
      }
    >
  >((acc, item) => {
    const date = parseISO(String(item.createdAt));
    const monthYearKey = format(date, "yyyy-MM");

    if (!acc[monthYearKey]) {
      acc[monthYearKey] = {
        count: 0,
        items: [],
        monthName: format(date, "MMMM"),
        year: format(date, "yyyy"),
      };
    }

    acc[monthYearKey].count++;
    acc[monthYearKey].items.push(item);

    return acc;
  }, {});

  const chartData = Object.entries(groupDataByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, monthData]) => ({
      month: monthData.monthName,
      collections: monthData.count,
    }));

  const lineColor = "var(--chart-1)";
  const dotColor = "var(--chart-1)";

  const chartConfig = {
    collections: {
      label: "Collections",
      color: lineColor,
    },
  } satisfies ChartConfig;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const defaultYear =
    Object.values(groupDataByMonth)[0]?.year ?? format(new Date(), "yyyy");

  const exportableData = months.map((month) => {
    const foundEntry = Object.values(groupDataByMonth).find(
      (entry) => entry.monthName === month,
    );

    return {
      Month: `${month} ${defaultYear}`,
      "Number of Collections": foundEntry?.count || 0,
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Collections Per Month</CardTitle>
          <ExportTableDataToExcel
            data={exportableData}
            filename={`monthly-collections-${Object.values(groupDataByMonth)[0]?.year}.xlsx`}
          />
        </div>
        <CardDescription>
          {Object.values(groupDataByMonth)[0]?.year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[400px]">
          <LineChart
            width={undefined}
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
            className="w-full"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="collections"
              type="natural"
              stroke={lineColor}
              strokeWidth={2}
              dot={{
                fill: dotColor,
                stroke: dotColor,
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: dotColor,
                stroke: "#fff",
                strokeWidth: 2,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Monthly collection trends
        </div>
      </CardFooter>
    </Card>
  );
}
