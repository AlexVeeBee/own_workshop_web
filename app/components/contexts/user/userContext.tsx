// user context
import { createContext, useContext, ReactNode } from "react";

export type User = {
    id: string;
    username: string;
};

export const UserContext = createContext<User | null>(null);