import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useChannels = () => {
  return useInfiniteQuery({
    queryKey: ["channels"],
    queryFn: ({ pageParam }) =>
      axios
        .get("/chat/channels", { params: { page: pageParam } })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.page + 1,
  });
};
