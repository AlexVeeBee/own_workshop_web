import { ReactNode, useContext, useEffect, useState } from "react";
import { SidebarContext, sidebarOptions } from "./sidebarContext";

interface ISidebarElement {
  id: string;
  options: sidebarOptions;
  content: ReactNode;
}

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  // holds the sidebar open if
  const [holdOpenIdsLeft, setHoldOpenIdsLeft] = useState<string[]>([]);
  const [holdOpenIdsRight, setHoldOpenIdsRight] = useState<string[]>([]);
  // left, right
  const [leftSidebar, setLeftSidebar] = useState<ISidebarElement[] | null>(null);
  const [rightSidebar, setRightSidebar] = useState<ISidebarElement[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (holdOpenIdsLeft.length || holdOpenIdsRight.length) {
      setOpen(true);
      holdOpenIdsLeft?.forEach((item) => {
        if (!leftSidebar?.find((sidebar) => sidebar.id === item)) {
          closeSidebar(item);
          setOpen(false);
        }
      })
      holdOpenIdsRight?.forEach((item) => {
        if (!rightSidebar?.find((sidebar) => sidebar.id === item)) {
          closeSidebar(item);
          setOpen(false);
        } 
      });
    } else {
      setOpen(false);
    }
  }, [holdOpenIdsLeft, holdOpenIdsRight, leftSidebar, rightSidebar])


  const openSidebar = (side: "left" | "right", content: ReactNode, opts: sidebarOptions) => {
    // check if the sidebar is already open
    if (side === "left" && holdOpenIdsLeft.includes(opts.id)) return;
    if (side === "right" && holdOpenIdsRight.includes(opts.id)) return;

    // add the content to the sidebar
    if (side === "left") {
      setHoldOpenIdsLeft((prev) => {
        if (prev.includes(opts.id)) { return prev; }
        return prev.concat(opts.id);
      })
      setLeftSidebar((prev) => {
        if (prev === null) {
          return [{ id: opts.id, options: opts, content }];
        }
        return prev.concat({ id: opts.id, options: opts, content });
      })
    } else {
      setHoldOpenIdsRight((prev) => {
        if (prev.includes(opts.id)) { return prev; }
        return prev.concat(opts.id);
      })
      setRightSidebar((prev) => {
        if (prev === null) {
          return [{ id: opts.id, options: opts, content }];
        }
        return prev.concat({ id: opts.id, options: opts, content });
      })
    }
  }
  const closeSidebar = (id: string) => {
    // remove the content from the sidebar
    setHoldOpenIdsLeft((prev) => {
      if (!prev.includes(id)) {return prev;}
      return prev.filter((item) => item !== id);
    })
    setHoldOpenIdsRight((prev) => {
      if (!prev.includes(id)) { return prev;}
      return prev.filter((item) => item !== id);
    })
    setTimeout(() => {
      setLeftSidebar((prev) => {
        if (prev === null) {
          return null;
        }
        return prev.filter((item) => item.id !== id);
      });
      setRightSidebar((prev) => {
        if (prev === null) {
          return null;
        }
        return prev.filter((item) => item.id !== id);
      });
    }, 500);
  }
  return (
    <SidebarContext.Provider value={{
      openSidebar,
      closeSidebar
    }}>
      <div className={`sidebar-container ${open ? "open" : ""}`}>
        <div className={`left-sidebar ${holdOpenIdsLeft?.length ? "has-content" : "" }`}>
            <div className="inner">
              {leftSidebar?.map((content, index) => (
                <div key={index} className="sidebar-content left"
                    style={{ width: content.options.width }}
                >
                  <button className="btn btn-primary"
                    onClick={() => closeSidebar(content.id)}
                  >
                  </button>
                    {content.content}
                </div>
              ))}
          </div>
        </div>
        <div className={`right-sidebar ${holdOpenIdsRight?.length ? "has-content" : "" }`}>
            <div className="inner">
              {rightSidebar?.map((content, index) => (
                <div key={index} className="sidebar-content right"
                  style={{ width: content.options.width }}
                >
                  <button className="btn btn-primary"
                    onClick={() => closeSidebar(content.id)}
                  >
                  </button>
                  {content.content}
                </div>
              ))}
            </div>
        </div>
      </div>
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