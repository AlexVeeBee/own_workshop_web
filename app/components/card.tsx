import React from "react"

export default function Card({
    title,
    description,
    children
}: {
    title: string,
    description: string,
    children: React.ReactNode | React.ReactNode[]
}) {
    return <div className="card">
        <div className="header">
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
        <div className="content">
            {children}
        </div>
    </div>
    }