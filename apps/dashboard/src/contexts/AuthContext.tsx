import React from "react";
import { jwtDecode } from "jwt-decode";

type Context = { user: any; initUser: (token: string) => void };

const AuthContext = React.createContext<Context>({} as Context);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState(() => {
    const token = localStorage.getItem("tokenx");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded;
    }
    return null;
  });

  const initUser = (token: string) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser(decoded);
  };

  return (
    <AuthContext.Provider value={{ user, initUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
