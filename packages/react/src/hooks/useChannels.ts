import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useChannels = () => {
  return useInfiniteQuery({
    queryKey: ["channels"],
    queryFn: ({ pageParam }) =>
      axios
        .get<{
          page: number;
          channels: {
            _id: string;
            user: { id: string; displayName: string };
            lastMessage?: { message: string };
            unread: number;
          }[];
          total: number;
          hasNextPage: boolean;
        }>("/chat/channels", { params: { page: pageParam } })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });
};
