import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMessages = (id: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", id],
    queryFn: ({ pageParam }) =>
      axios
        .get<{
          page: number;
          messages: {
            _id: string;
            message: string;
            sender: { id: string; displayName: string };
          }[];
          total: number;
          hasNextPage: boolean;
        }>(`/chat/messages/${id}`, { params: { page: pageParam } })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });
};
