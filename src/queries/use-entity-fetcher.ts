import useIssue from "@/queries/use-issue";
import useTrashbin from "@/queries/use-trashbin";
import useHistory from "@/queries/use-history";
import useRequestAccess from "./use-request-access";

export default function useEntityFetcher(entity: string) {
  const { getIssueById } = useIssue();
  const { getTrashbinById } = useTrashbin();
  const { getHistoryById } = useHistory();
  const { getRequestAccessById } = useRequestAccess();

  return {
    issue: getIssueById,
    trashbin: getTrashbinById,
    history: getHistoryById,
    "request-access": getRequestAccessById,
  }[entity];
}
