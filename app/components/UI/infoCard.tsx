import "./infoCard.css"

interface InfoCardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    status?: "info" | "success" | "warning" | "error";
}

export default function InfoCard({
    children, style, status,
}: InfoCardProps) {
    return (
        <div style={style} className={`info-card ${status}`}>
            {children}
        </div>
    );
}