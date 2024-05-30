import React from "react"
import "./card.css"

interface CardProps {
    title?: string,
    description?: string,
    children?: React.ReactNode | React.ReactNode[],
    style?: React.CSSProperties
    cardStyle?: React.CSSProperties
    className?: string
}

export default function Card({
    title = "",
    description = "",
    children,
    style = {},
    cardStyle = {},
    className = ""
}: CardProps) {
    return <div className={`card ${className}`} style={cardStyle}>
        <div className="header">
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
        {children && <div className="content" style={style}>{children}</div>}
    </div>
}