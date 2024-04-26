// autorow
// 
// Automaticly sets the row of the component to the next row in the grid

import { useEffect, useRef } from "react";
{/* <gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"}}> */}

export default function AutoColumn({
    children,
    className,
    maxRows = 3
}: {
    children: any
    className?: string
    maxRows?: number
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            const children = ref.current.children;
            let row = 1;
            let rowHeight = 0;

            const maxwidth = 300
            
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                const height = child.getBoundingClientRect().height;
                const width = child.getBoundingClientRect().width;
                if (rowHeight + height > maxwidth) {
                    row++;
                    rowHeight = 0;
                }
                child.style.gridRow = `${row} / ${row + 1}`;
                rowHeight += height;
                if (row > maxRows) {
                    break;
                }
            }
        }
    }, []);
    return (
        <div ref={ref} style={{display: "grid"}} className={className}>
            {children}
        </div>
    );
}