import { Link, Outlet, useLoaderData, useLocation, useOutlet } from "@remix-run/react";
import "./../style/admin-panel.css";
import TextHeader from "~/components/UI/textHeader";
import { useEffect, useState } from "react";

export const handle = {
    breadcrumb: () => {
        return "Admin";
    }
};

const urlprefix = "/admin";
const pages: {
    path: string;
    title: string;
    default?: boolean;
}[] = [
    { title: "Dashboard", path: "/", default: true },
    { title: "Users", path: "/users" },
]
// { title: "A", path: "/users" },
// { title: "A", path: "/items" },
// { title: "A", path: "/UGC" },
// { title: "A", path: "/settings" },
// { title: "A", path: "/feedback" },
// { title: "A", path: "/reports" },
// { title: "A", path: "/bans" },

export async function loader({ request }: { request: Request }) {
    // check if user is admin
    // if not, return 403

    request.headers.set("Cache-Control", "no-store");
    console.log("Admin panel loaded");
    const login = request.headers.get("Cookie")?.includes("login");
    if (!login) {
        return new Response("Forbidden", { status: 403 });
    }
    return { status: 200 };
}

export default function Admin() {
    const location = useLocation();
    const outlet = useOutlet();
    const data = useLoaderData<{ status: number }>();
    const [page, setPage] = useState("");

    useEffect(() => {
        const path = window.location.pathname.replace(urlprefix, "");
        const p = pages.find((p) => p.path === path);
        if (p) {
            setPage(p.path);
        }
    }, [location]);

    useEffect(() => {
        // check if user is in a page, if not, redirect to default page
        if (page === "...") {
            const p = pages.find((p) => p.default);
            if (p) {
                setPage(p.path);
                window.location.href = `${urlprefix}${p.path}`;
            }
        }
    }, [location]);

    if (data.status !== 200) {
        return (
            <main className="admin-page">
                <div className="center mainbkg flex column"
                    style={{
                        padding: "20px",
                    }}
                >
                    <h1>Access Denied</h1>
                    <p>You do not have permission to access this page.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            <style>
                {`
                html, body {
                    height: 100%;
                }
                
                body {
                    display: flex;
                    flex-direction: column;
                }

                header {
                    color: white;
                    text-align: center;
                    flex-shrink: 0;
                }
                .admin-page-container {
                    height: 100%;
                }
                `}
            </style>
            <div className="admin-page-container center">
                <div className="left sidepanel mainbkg ">
                    <div className="links flex column">
                        {
                            pages.map((p) => {
                                return (
                                    <Link to={`${urlprefix}${p.path}`} key={p.path} className={
                                        p.path === page ? "active" : ""
                                    } >{p.title}</Link>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="right content">
                    <div className="center">
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    );
}