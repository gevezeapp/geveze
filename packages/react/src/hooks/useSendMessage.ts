import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useGeveze } from "../context/GevezeContext";

export const useSendMessage = () => {
  const { updateMessageQueryData } = useGeveze();

  return useMutation({
    onSuccess: (data) => {
      updateMessageQueryData(["messages", data.channel], data);
    },
    mutationFn: (data: any) =>
      axios.post(`/chat/messages`, data).then((res) => res.data),
  });
};
