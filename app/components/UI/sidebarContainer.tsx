import "./sidebarContainer.css";
import { useEffect, useState } from "react";
import { useLocation, Link, Outlet } from "@remix-run/react";

interface SidebarContainerProps {
    pages: {
        title: string;
        path: string;
        content?: React.ReactNode;
        default?: boolean;
    }[];
    style?: React.CSSProperties;
    className?: string;
    usePaths?: boolean;
    onSidebarClick: (path: string) => void;
}

export default function SidebarContainer({ 
    pages, 
    style = {},
    className = "",
    usePaths = true,
    onSidebarClick
}: SidebarContainerProps) {
    const location = useLocation();
    const [page, setPage] = useState("");

    useEffect(() => {
        if (!usePaths) return;
        const path = window.location.pathname;
        const p = pages.find((p) => p.path === path);
        if (p) {
            setPage(p.path);
        }
    }, [location]);

    return (
        <div className={`sidebar-container ${className}`} style={style}>
            <div className="sidebar">
                <div className="content">
                    {usePaths && pages.map((p) => (
                        <Link
                            key={p.path}
                            to={p.path}
                            className={`item ${page === p.path ? "active" : ""}`}
                            onClick={() => {
                                if (!usePaths) {
                                    onSidebarClick(p.path);
                                }
                            }}
                        >
                            {p.title}
                        </Link>
                    ))}
                    {
                        !usePaths && pages.map((p) => (
                            <div
                                key={p.path}
                                className={`item ${page === p.path ? "active" : ""}`}
                                onClick={() => {
                                    onSidebarClick(p.path);
                                }}
                            >
                                {p.title}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="content">
                <div className="center">
                    { usePaths ? <Outlet /> : pages.find((p) => p.path === page)?.content }
                </div>
            </div>
        </div>
    )
}
