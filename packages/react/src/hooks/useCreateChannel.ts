import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useCreateChannel = () => {
  return useMutation({
    mutationFn: (data: any) =>
      axios.post(`/chat/channels`, data).then((res) => res.data),
  });
};
