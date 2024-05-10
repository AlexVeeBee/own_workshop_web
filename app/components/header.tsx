import { Link } from "@remix-run/react";
import User from "./user/user";
import { IUser } from "~/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "~/utils/store/user";

export function AppHeader({
    user,
}: {
    user: IUser
}) {
    const store = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
    }, [])

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