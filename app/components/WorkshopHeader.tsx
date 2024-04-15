import React from "react";

export function WorkshopHeader(
    {
        title,
        description
    }: {
        title: string,
        description: string
    }
) {
    return <div className="workshop-header">
        <div className="bkg-gradient"></div>
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
}