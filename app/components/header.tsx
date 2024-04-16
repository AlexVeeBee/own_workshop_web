import { useUser } from "./contexts/user/userProvider";

export function AppHeader() {
    const user = useUser();

    return <>
        <header>
            <div className={"center"}>
                <div className="left">
                    <h1>Own Workshop</h1>
                </div>
                <div className="right">
                    {user?.username}
                </div>
            </div>
        </header>
    </>
}