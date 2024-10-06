import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useChannel = (id: string) => {
  return useQuery({
    queryKey: ["channel", id],
    queryFn: () => axios.get(`/chat/channels/${id}`).then((res) => res.data),
  });
};
