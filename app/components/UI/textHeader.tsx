import "./textHeader.css";

interface TextHeaderProps {
    title: string;
    description?: string;
}

export default function TextHeader(
    { title, description }: TextHeaderProps
) {
    return (
        <div className="textHeader flex column">
            <h1>{title}</h1>
            {description && <p>{description}</p>}
        </div>
    );
}