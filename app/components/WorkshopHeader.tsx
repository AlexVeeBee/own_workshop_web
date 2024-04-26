import React from "react";

export function WorkshopHeader(
    {
        title,
        description,
        image
    }: {
        title: string,
        description: string,
        image: string
    }
) {
    return <div className="workshop-header" style={{backgroundImage: `url(${image})`}}>
        <div className="bkg-gradient"></div>
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
}