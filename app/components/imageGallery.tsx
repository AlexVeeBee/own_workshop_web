import { useEffect, useRef, useState } from "react";
import "./imageGallery.css";
import LoadingCircle from "./LoadingCircle";
import { useModal } from "./contexts/modal/modalProvider";
import Icon from "./icons";

interface imageItem {
    image: string;
    alt: string;
    shortDescription?: string;
}

interface imageinfo {
    size: `${number}x${number}`;
    format: 
        | "unknown"
        | "png" 
        | "jpg" 
        | "jpeg" 
        | "webp" 
        | "svg" 
        | "gif" 
        | "bmp" 
        | "tiff" 
        | "ico" 
        | "cur" 
        | "heic" 
        | "heif" 
        | "avif";
}

interface ImageGalleryProps {
    images: imageItem[];
    imagefit?: "contain" | "cover" | "original"
    className?: string;
    defaultAlt?: string;
    currImage?: number;
    style?: React.CSSProperties;
    disableAspectRatio?: boolean;
    /**
     * Override the aspect ratio of the image container
     * 
     * Ues CSS aspect ratio syntax like `16/9` or `1/1`
     */
    overrideAspectRatio?: string | null;
    /**
     * Disable the modal when clicking on the image
     */
    disableModal?: boolean;
    /**
     * Show the short description of the image
     * 
     * example: `size: 1920x1080 format: jpg`
     */
    showimageinfo?: boolean;
    /**
     * Enable zooming in the image
     * 
     * like how zoom on a large image like how default behavior of a browser
     */
    zoomable?: boolean;
}

export default function ImageGallery({
    images,
    imagefit = "original",
    className = "",
    defaultAlt = "Gallery image",
    currImage = 0,
    style = {},
    disableAspectRatio = false,
    overrideAspectRatio = null,
    disableModal = false,
    showimageinfo = false,
    zoomable = false
}: ImageGalleryProps) {
    const [currentImage, setCurrentImage] = useState(currImage);
    const [imageLoadingState, setImageLoadingState] = useState<"loading" | "loaded" | "error">("loading");
    const [imageLoadingProgress, setImageLoadingProgress] = useState(0);
    const itemimageref = useRef<HTMLImageElement>(null);
    const modal = useModal();

    const [showOverlay, setShowOverlay] = useState(true);
    const [overlayContent, setOverlayContent] = useState<JSX.Element | null>(<LoadingCircle />);
    const [imageinfo, setImageinfo] = useState<imageinfo | null>(null);

    const selectimage = (index: number) => {
        setCurrentImage(index);
    }
    
    const verifyImageFormat = (format: string) => {
        return ["png", "jpg", "jpeg", "webp", "svg", "gif", "bmp", "tiff", "ico", "cur", "heic", "heif", "avif"].includes(format);
    }

    const getImageInfo = () => {
        if (!itemimageref.current) return;
        setImageinfo({
            size: `${itemimageref.current.naturalWidth}x${itemimageref.current.naturalHeight}`,
            format: verifyImageFormat(itemimageref.current.src.split(".").pop() || "") ? itemimageref.current.src.split(".").pop() as imageinfo["format"] : "unknown"
        });
    }

    if (itemimageref.current) {
        const observer = new MutationObserver((changes) => {
            if (changes.length === 1 && changes[0].attributeName === "src") {
                setImageLoadingState("loading");
                getImageInfo();
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
                getImageInfo();
            });
            // if the image is already loaded, set the status to loaded
            if (itemimageref.current.complete) {
                setImageLoadingState("loaded");
                getImageInfo();
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

    const openImagePreviewModal = (data: imageItem) => {
        if (!modal) return;
        if (disableModal) return;
        modal.openModal({
            style: { width: "90dvw", height: "100vh"  },
            contentStyle: {},
            id: "imageGallery",
            content: (
                <ImageGallery
                    imagefit="contain"
                    style={{ width: "100%", height: "100%"}}
                    images={[
                        { image: images[currentImage].image, alt: images[currentImage].alt }
                    ]}
                    disableModal={true}
                    defaultAlt={images[currentImage].alt}
                    disableAspectRatio={true}
                />
            )
        });
    }

    useEffect(() => {
        switch (imageLoadingState) {
            case "loading":
                setShowOverlay(true);
                setOverlayContent(
                    <>
                        <LoadingCircle />
                    </>
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
        <div className={`imageGallery ${className}`} style={style}>
            <div className={`imageContainer ${disableAspectRatio ? "disableAspectRatio" : ""} ${disableModal ? "disablePointer" : ""} imgfit-${imagefit}`}
                onClick={() => openImagePreviewModal(images[currentImage])}
                style={{
                    overflow: zoomable ? "auto" : "hidden",
                    aspectRatio: overrideAspectRatio || `16/9`,
                    ...style
                }}
            >
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
                        { showimageinfo ? imageinfo ? (
                            <div className="imageinfo">
                                <p>size: {imageinfo.size} format: {imageinfo.format}</p>
                            </div>
                        ) : (
                            <div className="imageinfo">
                                <p>size: {itemimageref.current?.naturalWidth}x{itemimageref.current?.naturalHeight}</p>
                            </div>
                        ) : null }
                        {images[currentImage].shortDescription && (
                            <p className="shortDescription">{images[currentImage].shortDescription}</p>
                        )}
                        </>
                    )
                }
                {
                    !disableModal && (
                        <div className="corner-hover">
                            <div className="inner">
                                <Icon name="magnify_plus" />
                            </div>
                        </div>
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