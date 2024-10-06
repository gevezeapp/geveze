import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

type ContextType = {
  updateMessageQueryData: (queryKey: string[], data: any) => void;
  user: null | any;
};

const Context = createContext<ContextType>({} as ContextType);

const queryClient = new QueryClient();

export function GevezeProvider({
  children,
  token,
  project,
  ws_url = "ws://localhost:5000",
  api_url = "http://localhost:4000",
}: {
  children: ReactNode;
  token: string;
  project: string;
  ws_url?: string;
  api_url?: string;
}) {
  const [socket] = useState(
    io(ws_url, {
      autoConnect: false,
      auth: (cb) => cb({ token: localStorage.getItem("geveze-token") }),
    })
  );
  const [user, setUser] = useState(null);

  axios.defaults.baseURL = api_url;

  const getToken = async () => {
    try {
      const res = await axios.post("/chat/token", { project, token });
      if (!res.data.token) return;
      localStorage.setItem("geveze-token", res.data.token);
      setUser(jwtDecode(res.data.token));
      axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
      socket.connect();
    } catch (error) {}
  };

  const updateMessageQueryData = (queryKey: any, message: any) => {
    queryClient.setQueryData(queryKey, (queryData: any) => {
      if (!queryData) return;
      return {
        ...queryData,
        pages: queryData.pages.map((page: any, index: number) =>
          index == 0 ? { ...page, messages: [message, ...page.messages] } : page
        ),
      };
    });
    queryClient.invalidateQueries({ queryKey: ["channels"] });
  };
  const onNewMessage = (data: any) => {
    updateMessageQueryData(["messages", data.channel._id], data.message);
  };

  useEffect(() => {
    getToken();
    socket.on("NEW_MESSAGE", onNewMessage);

    return () => {
      socket.off("NEW_MESSAGE", onNewMessage);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={{ updateMessageQueryData, user }}>
        {children}
      </Context.Provider>
    </QueryClientProvider>
  );
}

export const useGeveze = () => {
  const context = useContext(Context);

  if (!context) throw new Error(`Can't use geveze provider`);

  return context;
};
