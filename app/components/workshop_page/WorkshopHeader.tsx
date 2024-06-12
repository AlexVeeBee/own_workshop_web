import "./WorkshopHeader.css"
import React from "react";

interface WorkshopHeaderProps {
    title: string;
    description: string;
    image: string;
    showGradient?: boolean;
    overrideAspectRatio?: string | null;
    children?: React.ReactNode;
    childrenPos?: "left" | "right";
    textAlignment?: "left" | "center" | "right";
}

export function WorkshopHeader(
    {
        title,
        description,
        image,
        showGradient = true,
        overrideAspectRatio,
        children,
        childrenPos = "left",
        textAlignment = "left"
    }: WorkshopHeaderProps
) {
    return <div className="workshop-header" style={{
        backgroundImage: `url(${image})`,
        ...overrideAspectRatio && {
            aspectRatio: overrideAspectRatio,
        },
    }}>
        {showGradient && <div className="bkg-gradient"></div>}
        <div className={`details ${textAlignment}`}>
            {
                children && childrenPos === "left" && (
                    <div className="children left fillwidth">
                        {children}
                    </div>
                )
            }
            <div className="inner">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {
                children && childrenPos === "right" && (
                    <div className="children right fillwidth">
                        {children}
                    </div>
                )
            }
        </div>
    </div>
}