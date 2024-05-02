import { Link, useRouteError } from "@remix-run/react";
import React from "react";

interface WorkshopItemProps {
    id: number;
    title: string;
    description?: string;
    style?: React.CSSProperties;
    image: string;
}

export default function WorkshopItem(
    {id, title, description, style, image}: WorkshopItemProps
) {
    return (
        // @ts-ignore
        <Link to={`/item/${id}`} className="workshop-item" style={{cursor: "pointer", ...style}}>
            <img src={image} alt="Workshop" className={"image"} />
            <div className="details">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </Link>
    );
}