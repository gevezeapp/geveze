import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUsers = () => {
  return useInfiniteQuery({
    queryKey: ["users"],
    queryFn: ({ pageParam }) =>
      axios
        .get("/chat/users", { params: { page: pageParam } })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.page + 1,
  });
};
