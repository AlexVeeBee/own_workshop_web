// user context provider
import { ReactNode, useContext } from "react";
import { UserContext } from "./userContext";
import { IUser } from "~/utils/types";
import { useAppDispatch } from "~/utils/hooks";
import { setUser } from "~/utils/store/user";
import cookie from "~/utils/cookie";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const getUser = async (id: string | number): Promise<IUser> => {
    id = id.toString();
    const f = await fetch(`http://localhost:8080/api/user/get/${id}`);
    if (!f.ok) {
      throw new Error("User not found");
    }
    return f.json();
  };

  const login = async (username: string, password: string): Promise<IUser> => {
    const f = await fetch(`http://localhost:8080/api/user/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });
    if (!f.ok) {
      throw new Error("User not found: " + await f.text());
    }
    const json = await f.json();
    dispatch(setUser({
      id: json.id,
      username: json.username,
      pfp: json.pfp,
      banner: json.banner,
    }));
    // set cookie
    cookie.set("login", json.token, 7);
    return json;
  }

  return (
    <UserContext.Provider value={{
      getUser: getUser,
      login: login,
    }}>
        {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user;
};
