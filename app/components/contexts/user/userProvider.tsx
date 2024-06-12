// user context provider
import { ReactNode, useContext } from "react";
import { UserContext } from "./userContext";
import { IUser } from "~/utils/types";
import { useAppDispatch } from "~/utils/hooks";
import { setUser } from "~/utils/store/user";
import cookie from "~/utils/cookie";
import { serverHost } from "~/utils/vars";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  const getUser = async (id: string | number): Promise<IUser> => {
    id = id.toString();
    const f = await fetch(`${serverHost}/api/user/get/${id}`);
    if (!f.ok) {
      throw new Error("User not found");
    }
    return f.json();
  };

  const login = async (username: string, password: string): Promise<IUser> => {
    const f = await fetch(`${serverHost}/api/user/login`, {
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
    dispatch(setUser(json));
    // set cookie
    cookie.set("login", json.token, 1);
    return json;
  }

  const logout = async () => {
    const f = await fetch(`${serverHost}/api/user/logout`);
    if (!f.ok) {
      throw new Error("Failed to logout");
    }
    dispatch(setUser(await f.json()));
    cookie.remove("login");
  }

  const verifyLogin = async (): Promise<boolean> => {
    const token = cookie.get("login");
    if (!token) {
      throw new Error("No login cookie");
    }
    const f = await fetch(`${serverHost}/api/user/login/${token}`);
    console.log("Verify login", f.ok)
    return f.ok;
  }

  const loginViaCookie = async (): Promise<IUser> => {
    const token = cookie.get("login");
    if (!token) {
      throw new Error("No login cookie");
    }
    const f = await fetch(`${serverHost}/api/user/login/${token}?pulldata=true`);
    if (!f.ok) {
      throw new Error("User not found: " + await f.text());
    }
    const json = await f.json();
    dispatch(setUser(json));
    return json;
  }

  return (
    <UserContext.Provider value={{
      getUser: getUser,
      login: login,
      logout: logout,
      loginViaCookie: loginViaCookie,
      verifyLogin: verifyLogin,
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
