import { Database, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface NoResultsFoundProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  isFetching?: boolean;
}

export default function NoResultsFound({
  title = "No data available",
  description = " There's currently no data to display. Once new entries are added, they will appear here.",
  onRefresh,
  isFetching,
}: NoResultsFoundProps) {
  return (
    <div className="flex items-center justify-center h-[90vh] w-full p-4">
      <Card className="border-dashed pt-10 pb-5">
        <CardContent className="flex flex-col items-center justify-center max-w-sm">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Database className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isFetching ? "Fetching data" : title}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            {isFetching
              ? "Please wait while we fetch the latest data. This may take a moment depending on your connection."
              : description}
          </p>
          <Button
            className="mt-3 rounded-full w-10 h-10 p-0 flex items-center justify-center"
            onClick={onRefresh}
            disabled={isFetching}
            variant="outline"
          >
            <RefreshCcw
              className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
