// user context
import { createContext } from "react";
import { IUser } from "~/utils/types";

export type UserAPI = {
    getUser: (id: string) => Promise<IUser>;
    login: (username: string, password: string) => Promise<IUser>;
};

export const UserContext = createContext<UserAPI | null>(null);