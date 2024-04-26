import { createContext } from "react";

interface ISidebar {
    openSidebar: () => void;
    closeSidebar: () => void;
}

export type SidebarAPI = {
    sidebar: ISidebar
};

export const SidebarContext = createContext<SidebarAPI | null>(null);