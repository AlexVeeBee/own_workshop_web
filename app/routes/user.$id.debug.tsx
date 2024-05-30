import { useOutletContext } from "@remix-run/react"
import InfoCard from "~/components/UI/infoCard";

export default function UserDebug() {
    const i = useOutletContext();

    return (
        <div className="flex column fillwidth">
            <h1>User Debug</h1>
            <InfoCard status="info">
                <b>Outputs from the backend</b><br></br>
                <a href="/api/swagger">More API docs</a>
            </InfoCard>
            <pre>{JSON.stringify(i, null, 2)}</pre>
        </div>
    )
}