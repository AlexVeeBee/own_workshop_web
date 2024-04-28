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
                    <h1>Own Workshop</h1>
                </div>
                <div className="right">
                    <User 
                        data={user}
                        showUsername={true} 
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