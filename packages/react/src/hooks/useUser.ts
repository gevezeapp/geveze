import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => axios.get(`/chat/users/${id}`).then((res) => res.data),
  });
};
