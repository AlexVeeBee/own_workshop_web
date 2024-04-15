import "../style/index.css";
import Card from "./card";
import { AppHeader } from "./header";

export default function Error({
    errordata
}: {
    errordata: any
}) {
    return (
        <>
            <AppHeader />
            <main>
                <div className="center">
                    <div style={{padding: "20px"}} className="fillwidth">
                        <Card title="Error" description="An error occurred">
                            <p>{errordata.status}</p>
                            <p>{errordata.message}</p>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
}