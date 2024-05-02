import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import LoadingCircle from "~/components/LoadingCircle";
import Card from "~/components/card";
import { IWorkshopItem } from "~/utils/types";
import { SidebarContext } from "~/components/contexts/sidebar/sidebarContext";

import "~/style/workshop-page.css";
import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
  };
  

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const f = await fetch(`http://localhost:8080/api/workshop/get/${params.id}`);
    if (!f.ok) {
        throw new Error("Item not found");
    }
    return f.json();
}

type IImageLoadingStatus = "loading" | "loaded" | "error";
export default function Item() {
    const sidebar = useSidebar()
    const i = useLoaderData<IWorkshopItem>();
    const [showThumb, setShowThumb] = useState(true);

    // set meta tags
    useEffect(() => {
        document.title = i.name;
        document.querySelector('meta[name="description"]')?.setAttribute("content", i.description);
    }, [i])

    useEffect(() => {
        i.images && i.images.length > 0 ? setShowThumb(true) : setShowThumb(false);
    }, [])

    return (
        <main id="workshop-item-container">
            {i.properties?.CSS ? (<link rel="stylesheet" href={`http://localhost:8080/${i.properties.CSS}`} />) : null}
            <div className="center" style={{margin: "0 24px"}}>
                <div style={{width: "100%", margin: "24px 0"}} className="margin">
                    <h1>Someonws Workshop</h1>
                </div>
            </div>
            <div className="center mainbkg flex align-start" id="workshop-item">
                <div className="left flex column">
                    <ImageGallery
                        images={
                            i.images && i.images.length > 0 ? i.images.map(image => {
                                return {
                                    image: `http://localhost:8080/${image}`,
                                    alt: "Workshop image",
                                }
                            }
                            ) : [
                                {
                                    image: `http://localhost:8080/${i.thumb}`,
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
                            <button className="btn btn-success flex align-center" style={{gap: "10px"}}>
                                Download as ZIP <Icon name="folder" />
                            </button>
                            <button className="btn btn-success flex align-center" style={{gap: "10px"}}
                                onClick={() => sidebar.openSidebar("right", <WorkshopItemSidebar thumb={i.thumb} tags={i.tags} creators={i.authors} />, {
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
                <div className="right mobile-v-hide">
                    <WorkshopItemSidebar 
                    creators={i.authors}
                    thumb={showThumb ? i.thumb : null}
                    tags={i.tags} />
                </div>
            </div>
        </main>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (
      <>
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
      </>
    );
  }