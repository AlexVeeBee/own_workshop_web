import { ReactNode, useContext } from "react";
import { SidebarContext } from "./sidebarContext";

const openSidebar = () => {
    console.log("Opening sidebar");
}

const closeSidebar = () => {
    console.log("Closing sidebar");
}

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarContext.Provider value={{
          sidebar: {
              openSidebar,
              closeSidebar
          }
        }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
  const sidebar = useContext(SidebarContext);
  if (!sidebar) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return sidebar;
};