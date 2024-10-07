import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (data: any) =>
      axios.post(`/chat/mark-as-read`, data).then((res) => res.data),
  });
};
