import { useEffect, useState } from "react";
import "./user.pfpicon.css"
import svgIcons from "../icons";

interface UserPFPIconProps {
    src: string;
    alt: string;
    style?: React.CSSProperties;
    className?: string;
    size?: number | string;
    hoverIcon?: keyof typeof svgIcons;
    onClick?: () => void;
}

export default function UserPFPIcon({
    src,
    alt,
    style = {},
    size = 32,
}: UserPFPIconProps) {
    const [pfpSize, setPfpSize] = useState<number>(32);

    useEffect(() => {
        if (typeof size === "string") {
            setPfpSize(parseInt(size));
        } else {
            setPfpSize(size);
        }
    }, [size]);

    return (
        <div className="user-pfp-container"
            style={{
                ...style,
                width: pfpSize,
                height: pfpSize,
            }}
        >
            <img
                src={src}
                alt={alt}
                className={"user-pfp-icon"}
            />
        </div>
    );
}