import React, { useEffect } from "react";

export default function WorkshopItem(
    {id, title, description}: {
        id: string,
        title: string,
        description: string
    }
) {
    useEffect(() => {
        console.log("Workshop Item Mounted");
    }, []);
    const GoToItem = () => {
        if (typeof window === 'undefined') {
            return;
        }
        window.location.href = `/iten/${id}`;
    }

    return (
        // @ts-ignore
        <div className="workshop-item" onClick={() => GoToItem(0)} style={{cursor: "pointer"}} >
            <img src="https://via.placeholder.com/512"
            alt="Workshop" className={"image"} />
            <div className="details">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
}