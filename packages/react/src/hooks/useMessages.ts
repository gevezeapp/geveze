import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMessages = (id: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", id],
    queryFn: ({ pageParam }) =>
      axios
        .get(`/chat/messages/${id}`, { params: { page: pageParam } })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.page + 1,
  });
};
