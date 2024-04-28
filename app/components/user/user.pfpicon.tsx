import "./user.pfpicon.css"

export default function UserPFPIcon({
    src,
    alt,
    style,
}: {
    src: string;
    alt: string;
    style?: React.CSSProperties;
    className?: string;
}) {
    return (
        <img
            src={src}
            alt={alt}
            style={style}
            className={"user-pfp-icon"}
        />
    );
}