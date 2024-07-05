import { useOutletContext } from "@remix-run/react";

export default function ItemVersion() {
    const o = useOutletContext();

    return (
        <div>
            <pre>{JSON.stringify(o, null, 2)}</pre>
        </div>
    )
}