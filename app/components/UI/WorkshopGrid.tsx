import { IWorkshopItem } from "~/utils/types";
import WorkshopItem from "../workshop_page/workshop.item";

type GridMode = "grid" | "list"

interface WorkshopGrid {
    items: IWorkshopItem[]
    gridMode: GridMode
}

export default function WorkshopGrid({
    items,
    gridMode
}: WorkshopGrid) {
    return (
        <div className={`workshop-grid grid-${gridMode}`}>
            {items.map((item) => (
                <WorkshopItem key={item.id}
                    id={item.id}
                    title={item.name}
                    description={item.shortDescription}
                    image={item.thumb}
                    tags={item.tags}
                />
            ))}
        </div>
    )
}