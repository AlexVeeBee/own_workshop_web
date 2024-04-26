// user context
import { createContext } from "react";

interface IUser {
    id: string;
    username: string;
}

export type UserAPI = {
    getUser: (id: string) => IUser
};

export const UserContext = createContext<UserAPI | null>(null);