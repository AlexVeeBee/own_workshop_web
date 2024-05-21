import { IUser, IWorkshopItem, imageFitOptions } from "~/utils/types";
import Card from "../card";
import User from "../user/user";
import "./item.sidebar.css"
import { useModal } from "../contexts/modal/modalProvider";
import ImageGallery from "../imageGallery";
import { UserInfoCard } from "../user/userInfoCard";
import { ActionBar } from "../UI/IconsActionBar";
import { useState } from "react";
import ThumbnailPreviewModal from "./item.thumbnail_preview";
import InfoCard from "../UI/infoCard";

interface WorkshopItemSidebar {
    style?: React.CSSProperties;
}

interface minWorkshopItem {
    thumb?: string;
    tags?: string[];
    authors: IUser[];
    /**
     * Owner of the item
     * 
     * Fallback if the list of authors is empty
     */
    owner?: IUser;
    version: string | null;
}

export default function WorkshopItemSidebar({
    thumb, tags, authors, owner, version,
    style,
}: minWorkshopItem & WorkshopItemSidebar) {
    const [fitoptions, setFitOptions] = useState<imageFitOptions>("original");
    const modal = useModal();
    const openTumbModal = () => {
        if (!thumb) return;
        modal.openModal({
            style: {
                width: "100%",
                height: "100%",
                maxWidth: "90%",
                display: "flex",
                flexDirection: "column",
            },
            contentStyle: {
                display: "flex",
                flexDirection: "column",
                height: "100%",
            },
            id: "workshop-thumb-modal",
            title: "Thumbnail image",
            content: (
                <>
                <ThumbnailPreviewModal image={`http://localhost:8080/${thumb}`} />
                {/* <ImageGallery 
                    style={{width: "100%", height: "100%"}}
                    overrideAspectRatio={"1/1"}
                    images={[{image: `http://localhost:8080/${thumb}`, alt: "Workshop preview image"}]}
                    currImage={0}
                    disableModal={true}
                    imagefit={fitoptions}
                />*/}
                </>
            ),
        });
    }
    
    return (
        <div className="workshop-item-sidebar flex column" style={
            {
                ...style,
                gap: "20px",
            }
        }>
            { thumb && ( <img src={`http://localhost:8080/${thumb}`} alt="Workshop preview image" className="thumb"
                onClick={openTumbModal}
            /> )}
            <Card style={{display: "flex", flexDirection: "column", gap: "4px"}}>
            <h3>Version</h3>    
                <p>{version || "No version"}</p>
            </Card>
            <Card style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                <h3>Tags</h3>
                <div className="tags">
                    {tags && tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </Card>
            <Card style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                <p>{authors ? "Created by:" : "Owner:"}</p>
                <div className="authors flex column" style={{gap: "4px"}}>
                    {authors && authors.map((author, index) => (
                        <User key={index} data={
                            author
                        }
                        showUserModal={true}
                        />
                    ))}
                    {!authors && owner && <User data={owner} showUserModal={true} />}
                    {
                        !authors && !owner && 
                            <InfoCard status="warning">
                                <p>No authors or owner attached</p>
                            </InfoCard>
                    }
                </div>
            </Card>
        </div>
    );
}
