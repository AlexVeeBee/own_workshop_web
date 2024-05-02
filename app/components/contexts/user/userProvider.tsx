// user context provider
import { ReactNode, useContext } from "react";
import { UserContext } from "./userContext";
import { IUser } from "~/utils/types";

const getUser = async (id: string | number): Promise<IUser> => {
  id = id.toString();
  const f = await fetch(`http://localhost:8080/api/user/get/${id}`);
  if (!f.ok) {
    throw new Error("User not found");
  }
  return f.json();
};


export const UserProvider = ({ children }: { children: ReactNode }) => {
    return (
        <UserContext.Provider value={{
          getUser: getUser,
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
