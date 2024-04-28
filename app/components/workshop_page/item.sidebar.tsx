import { IUser } from "~/utils/types";
import Card from "../card";
import User from "../user/user";
import "./item.sidebar.css"

export default function WorkshopItemSidebar({
    thumb, tags, authors,
    style,
}: {
    thumb: string | null;
    tags?: string[],
    authors: IUser[],
    style?: React.CSSProperties;
}) {
    return (
        <div className="workshop-item-sidebar" style={style}>
            {
                thumb && (
                    <img src={`http://localhost:8080/${thumb}`} alt="Workshop preview image" className="thumb" />
                )
            }
            <h3>Tags</h3>
            <div className="tags">
                {tags && tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <Card
                style={{display: "flex", flexDirection: "column",}}
            >
                <p>Authors:</p>
                <div className="authors flex column">
                    {authors.map((author, index) => (
                        <User key={index} data={
                            {
                                id: author.id,
                                username: author.username,
                                pfp: author.pfp,
                            }
                        } />
                    ))}
                </div>
            </Card>
        </div>
    );
}
