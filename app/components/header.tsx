import { Link } from "@remix-run/react";
import { useSidebar } from "./contexts/sidebar/sidebarProvider";
import User from "./user/user";
import { IUser } from "~/utils/types";

export function AppHeader({
    user,
}: {
    user?: IUser
}) {
    const sidebar = useSidebar()
    return <>
        <header>
            <div className={"center"}>
                <div className="left">
                    <Link to="/" className="link">
                        <h1>Own Workshop</h1>
                    </Link>
                </div>
                <div className="right">
                    <User 
                        data={user}
                        showUsername={false} 
                        onClick={() => sidebar.openSidebar("right",
                           ( <div>
                                <h1>User</h1>
                            </div>)
                        , {
                            id: "user-info",
                            width: "300px",
                        })}
                    />
                </div>
            </div>
        </header>
    </>
}