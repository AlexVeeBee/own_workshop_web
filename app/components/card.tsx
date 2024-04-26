import React from "react"

export default function Card({
    title = "",
    description = "",
    children,
    style = {},
    cardStyle = {}
}: {
    title?: string,
    description?: string,
    children?: React.ReactNode | React.ReactNode[],
    style?: React.CSSProperties
    cardStyle?: React.CSSProperties
}) {
    return <div className="card" style={cardStyle}>
        <div className="header">
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
        {children && <div className="content" style={style}>{children}</div>}
    </div>
    }