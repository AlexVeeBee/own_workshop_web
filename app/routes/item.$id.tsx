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
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoadingStatus, setImageLoadingStatus] = useState<IImageLoadingStatus>("loading");
    const itemimageref = useRef<HTMLImageElement>(null);
    const [showThumb, setShowThumb] = useState(true);

    // set meta tags
    useEffect(() => {
        document.title = i.name;
        document.querySelector('meta[name="description"]')?.setAttribute("content", i.description);
    }, [i])

    useEffect(() => {
        i.images && i.images.length > 0 ? setShowThumb(true) : setShowThumb(false);
    }, [])

    if (itemimageref.current) {
        const observer = new MutationObserver((changes) => {
            // check if the src attribute has changed
            if (changes.length === 1 && changes[0].attributeName === "src") {
                setImageLoadingStatus("loading");
            }
        })
        observer.observe(itemimageref.current, {
            attributes: true,
            attributeFilter: ["src"]
        });
    }

    useEffect(() => {
        if (itemimageref.current) {
            itemimageref.current.addEventListener("error", () => {
                setImageLoadingStatus("error");
            });
            itemimageref.current.addEventListener("load", () => {
                setImageLoadingStatus("loaded");
            });
            // if the image is already loaded, set the status to loaded
            if (itemimageref.current.complete) {
                setImageLoadingStatus("loaded");
            }

            return () => {
                itemimageref.current?.removeEventListener("error", () => {
                    setImageLoadingStatus("error");
                });
                itemimageref.current?.removeEventListener("load", () => {
                    setImageLoadingStatus("loaded");
                });
            }
        }
    }, [itemimageref]);

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
                        images={i.images?.map((image, index) => {
                            return {
                                image: `http://localhost:8080/${image}`,
                                alt: `Image ${index + 1}`,
                            }
                        }) || []}
                    />
                    {/* <div className="image-gallery">
                        <div className="image" style={{aspectRatio: "16/9",}}>
                            {
                                imageLoadingStatus === "loading" && (<div className="image-status-overlay"><LoadingCircle /></div>)
                            }
                            {
                                i.images && i.images.length > 0 ? (
                                    <img ref={itemimageref} src={`http://localhost:8080/${i.images[selectedImage]}`} alt="Workshop" />
                                ) : (
                                    <img ref={itemimageref}src={`http://localhost:8080/${i.thumb}`} alt="Workshop" />
                                )
                            }
                        </div>
                        {
                            i.images && i.images.length > 1 && (
                                <div className="item-images-row">
                                {
                                    i.images.map((image, index) => {
                                        return (
                                            <img src={`http://localhost:8080/${image}`} alt="Workshop image"
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={selectedImage === index ? "selected" : ""}
                                            />
                                        )
                                    })
                                }
                            </div>
                            )
                        }
                    </div> */}
                    <Card style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <div>
                            <h1>{i.name}</h1>
                            <p>{i.description}</p>
                        </div>
                        <button className="btn btn-success flex align-center" style={{gap: "10px"}}
                            onClick={() => sidebar.openSidebar("right", <WorkshopItemSidebar thumb={i.thumb} tags={i.tags} authors={i.authors} />, {
                                id: "workshop-item-extrainfo",
                                width: "300px",
                            })}
                        >
                            Download as ZIP <Icon icon="folder" />
                        </button>
                    </Card>
                    <Card>
                        <div>
                            <h3>Contained Files</h3>
                        </div>
                    </Card>
                </div>
                <div className="right">
                    <WorkshopItemSidebar 
                    authors={i.authors}
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