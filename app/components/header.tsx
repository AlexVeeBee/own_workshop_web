import User from "./user";

export function AppHeader() {
    return <>
        <header>
            <div className={"center"}>
                <div className="left">
                    <h1>Own Workshop</h1>
                </div>
                <div className="right">
                    <User id={"1"} showUsername={true} />
                </div>
            </div>
        </header>
    </>
}