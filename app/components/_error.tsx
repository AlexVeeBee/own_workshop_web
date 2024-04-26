import "../style/index.css";
import Card from "./card";

function getErrorCode(status: string | number) {
    if (typeof status === "number") {
        status = status.toString();
    }
    
    switch (status) {
        case "404": return "Page not found"
        case "500": return "Internal server error"
        default:
            return "Unknown error: Check the error below."
    }
}

export default function Error({
    errordata
}: {
    errordata: any
}) {
    const errmsg = getErrorCode(errordata.status);

    return (
        <>
            <div style={{padding: "20px 0"}} className="fillwidth">
                <Card style={{display:"flex", flexDirection: "column"}}>
                    <div>
                        <h1>{errordata.status}</h1>
                        <p>{errmsg}</p>
                    </div>
                    {/* <p>{errordata.message}</p> */}
                    {
                        errordata.message && <p>{errordata.message}</p>
                    }
                    {errordata.stack && <pre>{errordata.stack}</pre>}
                </Card>
                <div className="flex wrap" style={{marginTop: "12px"}}>
                    <button onClick={() => window.location.reload()} className="btn-primary">Reload</button>
                    {/* Create issue */}
                    <a href="" className="btn-secondary">Create issue</a>
                </div>
            </div>
        </>
    );
}