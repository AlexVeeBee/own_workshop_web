// user context provider
import { ReactNode, useContext } from "react";
import { UserContext } from "./userContext";

const getUser = (id: string) => ({
    id,
    username: "test"
});

const getUserDescription = (id: string) => {
    return "This is a user description";
}

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
