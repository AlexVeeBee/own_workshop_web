import { useOutletContext } from "@remix-run/react";
import WorkshopGrid from "~/components/UI/WorkshopGrid";

export const handle = {
    breadcrumb: () => {
        return "Items";
    }
};

export default function UserInfo() {
    const o = useOutletContext();

    return (
        <div>
            <WorkshopGrid items={[]} gridMode="grid"/>
        </div>
    )
} 