import { IUser, imageFitOptions } from "~/utils/types";
import Card from "../card";
import User from "../user/user";
import "./item.sidebar.css"
import { useModal } from "../contexts/modal/modalProvider";
import ImageGallery from "../imageGallery";
import { UserInfoCard } from "../userInfoCard";
import { ActionBar } from "../UI/IconsActionBar";
import { useState } from "react";
import ThumbnailPreviewModal from "./item.thumbnail_preview";

export default function WorkshopItemSidebar({
    thumb, tags, creators,
    style,
}: {
    thumb: string | null;
    tags?: string[],
    creators: IUser[],
    style?: React.CSSProperties;
}) {
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
        <div className="workshop-item-sidebar" style={style}>
            { thumb && ( <img src={`http://localhost:8080/${thumb}`} alt="Workshop preview image" className="thumb"
                onClick={openTumbModal}
            /> )}
            <h3>Tags</h3>
            <div className="tags">
                {tags && tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <Card
                style={{display: "flex", flexDirection: "column", gap: "4px"}}
            >
                <p>Created by:</p>
                <div className="authors flex column" style={{gap: "4px"}}>
                    {creators.map((author, index) => (
                        <User key={index} data={
                            author
                        }
                        showUserModal={true}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}
