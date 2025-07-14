import directionApi from "@/api/direction-api";
import type { Direction } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

function useGetDirection() {
  return useMutation({
    mutationFn: (data: Direction) => directionApi.getDirections(data),
  });
}

export default function useDirection() {
  const getDirections = useGetDirection();
  return { getDirections };
}
