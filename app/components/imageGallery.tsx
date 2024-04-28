import { useEffect, useRef, useState } from "react";
import "./imageGallery.css";
import LoadingCircle from "./LoadingCircle";

interface imageItem {
    image: string;
    alt: string;
    shortDescription?: string;
}

interface ImageGalleryProps {
    images: imageItem[];
    className?: string;
    defaultAlt?: string;
}

export default function ImageGallery({
    images,
    className,
    defaultAlt = "Gallery image"
}: ImageGalleryProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageLoadingState, setImageLoadingState] = useState<"loading" | "loaded" | "error">("loading");
    const itemimageref = useRef<HTMLImageElement>(null);

    const [showOverlay, setShowOverlay] = useState(true);
    const [overlayContent, setOverlayContent] = useState<JSX.Element | null>(<LoadingCircle />);

    const selectimage = (index: number) => {
        setCurrentImage(index);
    }

    if (itemimageref.current) {
        const observer = new MutationObserver((changes) => {
            if (changes.length === 1 && changes[0].attributeName === "src") {
                setImageLoadingState("loading");
            }
        });
        observer.observe(itemimageref.current, {
            attributes: true,
            attributeFilter: ["src"]
        });
    }

    useEffect(() => {
        if (!itemimageref.current) {
            setShowOverlay(true);
            setOverlayContent(
                <p>No image</p>
            );
        }
        if (itemimageref.current) {
            itemimageref.current.addEventListener("error", () => {
                setImageLoadingState("error");
            });
            itemimageref.current.addEventListener("load", () => {
                setImageLoadingState("loaded");
            });
            // if the image is already loaded, set the status to loaded
            if (itemimageref.current.complete) {
                setImageLoadingState("loaded");
            }

            return () => {
                itemimageref.current?.removeEventListener("error", () => {
                    setImageLoadingState("error");
                });
                itemimageref.current?.removeEventListener("load", () => {
                    setImageLoadingState("loaded");
                });
            }
        }
    }, [itemimageref]);

    useEffect(() => {
        switch (imageLoadingState) {
            case "loading":
                setShowOverlay(true);
                setOverlayContent(
                    <LoadingCircle />
                );
                break;
            case "error":
                setShowOverlay(true);
                setOverlayContent(
                    <p>Error loading image</p>
                );
                break;
            case "loaded":
                setShowOverlay(false);
                setOverlayContent(null);
                break;
        }
    }, [imageLoadingState])


    return (
        <div className={`imageGallery ${className}`}>
            <div className="imageContainer">
                {
                    showOverlay && (
                        <div className={`overlay show`}> {overlayContent} </div>
                    )
                }
                {
                    images.length > 0 && (
                        <>
                        <img ref={itemimageref} src={images[currentImage].image} alt={images[currentImage].alt || defaultAlt} 
                            className="mainImage"
                        />
                        {images[currentImage].shortDescription && (
                            <p className="shortDescription"
                            >{images[currentImage].shortDescription}</p>
                        )}
                        </>
                    )
                }
            </div>
            {
                images.length > 1 && (
                <div className="gallery">
                    {
                        images.map((image, index) => {
                            return (
                                <div className="image" key={index} onClick={() => selectimage(index)}>
                                    <img src={image.image} alt={image.alt}
                                        className={`thumbnail ${index === currentImage ? "selected" : ""}`}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
                )
            }
        </div>
    )
}