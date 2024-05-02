import { Link } from "@remix-run/react";
import User from "./user/user";
import { IUser } from "~/utils/types";

export function AppHeader({
    user,
}: {
    user: IUser
}) {
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
                        showUserModal={true}
                    />
                </div>
            </div>
        </header>
    </>
}