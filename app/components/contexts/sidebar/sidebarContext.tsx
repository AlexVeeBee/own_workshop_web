import React, { createContext } from "react";

type SidebarPosition = "left" | "right";

export interface sidebarOptions {
    id: string;
    width?: React.CSSProperties["width"];
    dismissable?: boolean;
}

export type SidebarAPI = {
    openSidebar: (side: SidebarPosition, content: React.ReactNode, opts: sidebarOptions) => void;
    closeSidebar: (side: SidebarPosition) => void;
};

export const SidebarContext = createContext<SidebarAPI | null>(null);