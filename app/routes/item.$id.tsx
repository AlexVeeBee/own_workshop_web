import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import LoadingCircle from "~/components/LoadingCircle";
import Card from "~/components/card";
import { IWorkshopItem } from "~/utils/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const f = await fetch(`http://localhost:8080/api/workshop/get/${params.id}`);
    if (!f.ok) {
        throw new Error("Item not found");
    }
    return f.json();
    // return { id: params.id };
}

type IImageLoadingStatus = "loading" | "loaded" | "error";
export default function Item() {
    const i = useLoaderData<IWorkshopItem>();
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageLoadingStatus, setImageLoadingStatus] = useState<IImageLoadingStatus>("loading");
    const itemimageref = useRef<HTMLImageElement>(null);

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
            <style>
                {
                    `
                    #workshop-item-container {
                    }
                    .item-image {
                        overflow: hidden;
                        position: relative;
                    }
                    .item-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;  
                    }
                    .item-images-row {
                        background: var(--card-bkg-color);
                        width: 100%;
                        display: flex;
                        gap: 10px;
                        margin-top: -10px;
                        overflow: auto;
                    }
                    .item-images-row img {
                        height: 100px;
                        object-fit: contain;
                        aspect-ratio: 16/9;
                    }
                    .item-images-row img.selected {
                        outline: 4px solid var(--primary-color);
                        outline-offset: -4px;
                    }
                    .item-image .image-status-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: rgba(0, 0, 0, 0.5);
                    }

                    #workshop-item .left {
                        width: auto;
                        position: relative;
                        overflow: hidden;
                        width: 100%;
                    }
                    #workshop-item .right {
                        position: relative;
                        width: auto;
                        position: relative;
                        overflow: hidden;
                        max-width: 300px;
                        width: 100%;
                        margin: 20px 20px 0 0;
                    }
                    #workshop-item .right img.thumb {
                        background: var(--card-bkg-color);
                        aspect-ratio: var(--item-thumb-aspect-ratio);
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    `
                }
            </style>
            <div className="center" style={{margin: "0 24px"}}>
                <div style={{width: "100%", margin: "24px 0"}} className="margin">
                    <h1>Someonws Workshop</h1>
                </div>
            </div>
            <div className="center mainbkg flex align-start" id="workshop-item">
                <div style={{padding: "20px", gap: "20px", flexGrow: 1}} className="left flex column">
                    <div className="item-image"
                        style={{aspectRatio: "16/9",}}
                    >
                        {
                            imageLoadingStatus === "loading" && (
                            <div className="image-status-overlay">
                                <LoadingCircle />
                            </div>
                            )
                        }
                        {/* check if there is a image in the iamges list
                        if so, only show the first image,
                        if not default to the thumb
                        */}
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
                    <Card style={{display: "flex", flexDirection: "column",}}>
                        <h1>{i.name}</h1>
                        <p>{i.description}</p>
                        <button className="btn btn-success">
                            Download as ZIP
                        </button>
                    </Card>
                </div>
                <div className="right" style={{ flexGrow: 1 }}>
                    <img src={`http://localhost:8080/${i.thumb}`} alt="Workshop preview image" className="thumb" />
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
                <p>Unable to fetch item: {error.message}</p>
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