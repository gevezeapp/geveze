import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUsers = () => {
  return useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam }) =>
      axios
        .get<{
          page: number;
          users: { id: number; displayName: string }[];
          total: number;
          hasNextPage: boolean;
        }>("/chat/users", { params: { page: pageParam } })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });
};
