import { Archive } from "lucide-react";
import { Button } from "../ui/button";

interface ShowArchivesTableProps {
  showArchives: boolean;
  toggleArchives: () => void;
}

export default function ShowArchivesTable({
  showArchives,
  toggleArchives,
}: ShowArchivesTableProps) {
  return (
    <Button
      onClick={toggleArchives}
      variant="outline"
      className="h-9 border-muted border-[1px]"
    >
      <Archive className="w-4 h-4" />
      {showArchives ? "Hide Archives" : "Show Archives"}
    </Button>
  );
}
