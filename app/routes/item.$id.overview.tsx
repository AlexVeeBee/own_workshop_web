import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/card";
import { IWorkshopItem, IWorkshopItemMedia } from "~/utils/types";

import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";
import { useModal } from "~/components/contexts/modal/modalProvider";
import DownloadAsModal from "~/components/UI/Modals/downloadas";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};
  

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//     const f = await fetch(`http://localhost:8080/api/workshop/get/${params.id}`);
//     if (!f.ok) {
//         throw new Error("Item not found");
//     }
//     return f.json();
// }

type IImageLoadingStatus = "loading" | "loaded" | "error";
export default function Item() {
    const [filteredMediaTypes, setFilteredMediaTypes] = useState<IWorkshopItemMedia[]>([]);
    const sidebar = useSidebar()
    const modal = useModal();
    const i = useOutletContext<IWorkshopItem>();

    // set meta tags
    useEffect(() => {
        document.title = i.name;
        document.querySelector('meta[name="description"]')?.setAttribute("content", i.description);
    }, [i])

    useEffect(() => {
        if (i.media) {
            const filtered = i.media.filter(m => m.type === "image" || m.type === "video");
            setFilteredMediaTypes(filtered);
        }
    }, [i.media])

    const buttonDownloadAs = () => {
        modal.openModal({
            id: "downloadas",
            title: "Download as",
            content: <DownloadAsModal
                onClose={() => modal.closeModal("downloadas")}
                itemid={i.id}
            />,
        })
    }

    

    return (
            // <div className="center mainbkg flex align-start" id="workshop-item">
        <>
            <div className="left flex column">
                <ImageGallery
                    images={
                        i.media && i.media.length > 0 ? i.media.map(image => {
                            return {
                                src: `http://localhost:8080/${image.src}`,
                                type: image.type,
                                alt: "Workshop image",
                            }
                        }
                        ) : [
                            {
                                src: `http://localhost:8080/${i.thumb}`,
                                type: "image",
                                alt: "Workshop Thumbnail",
                                shortDescription: "Item Thumbnail image",
                            }
                        ]
                    }
                />
                <Card style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        <h1>{i.name}</h1>
                        <p style={{opacity:"0.5"}}>This asset may contain copyrighted assets</p>
                    </div>
                    <div className="flex" style={{gap: "10px"}}>
                        <button className="btn btn-success flex align-center" style={{gap: "10px"}} onClick={buttonDownloadAs}>
                            <Icon name="download" />
                        </button>
                        <button className="btn btn-success flex align-center" style={{gap: "10px"}}
                            onClick={() => sidebar.openSidebar("right", <WorkshopItemSidebar 
                                version={i.version} 
                                thumb={i.thumb} 
                                tags={i.tags} 
                                authors={i.authors} 
                                owner={i.owner}
                            />, {
                                id: "workshop-item-extrainfo",
                                width: "300px",
                            })}
                        >
                            <Icon name="information" />
                        </button>
                    </div>
                </Card>
                <Card>
                    <p>{i.description}</p>
                </Card>
                <Card>
                    <div>
                        <h3>Contained Files</h3>
                    </div>
                </Card>
            </div>
        </>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (
        <main>
          <div className="center flex column">
            <div style={{ textAlign: "center", padding: "20px", paddingBottom: "0" }}>
                {/* @ts-ignore */}
                <p>Error on this item: {error.message}</p>
            </div>
            {
                // @ts-ignore
                error.stack && <pre
                    style={{padding: "20px", overflow: "auto", whiteSpace: "pre-wrap"}}
                // @ts-ignore
                >{error.stack}</pre>
            }
          </div>
      </main>
    );
  }