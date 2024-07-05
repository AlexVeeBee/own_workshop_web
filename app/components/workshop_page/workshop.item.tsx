import { Link, useRouteError } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import "./workshop.item.css"

interface WorkshopItemProps {
    id: number;
    title: string;
    description?: string;
    style?: React.CSSProperties;
    image: string;
    tags: string[];
}

export default function WorkshopItem(
    {id, title, description, style, image, tags}: WorkshopItemProps
) {
    const [blur, setBlur] = useState(false)
    const [showimg, setShowimg] = useState(false)

    useEffect(() => {
        if (!tags) return
        // check for tags

        // MATCHES: "NSFW", "18+", "NSFL"
        const nsfwTags = ["NSFW", "18+", "NSFL"]
        const hasNSFW = tags.some(tag => nsfwTags.includes(tag))
        if (hasNSFW) {
            setBlur(true)
        }
    }, [tags])

    useEffect(() => {
        setShowimg(true)
    }, [])

    return (
        // @ts-ignore
        <Link to={`/item/${id}`} className={`workshop-item ${blur ? "blur" : ""}`} style={{cursor: "pointer", ...style}}>
            {showimg && <img draggable={false} src={image} alt="Workshop" className={"image"} />}
            <div className="details">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            {
                !tags ? <p>No tags</p> : null
            }
        </Link>
    );
}