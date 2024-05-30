import { useEffect, useRef, useState } from "react";
import "./imageGallery.css";
import LoadingCircle from "./LoadingCircle";
import { useModal } from "./contexts/modal/modalProvider";
import Icon from "./icons";

interface MediaItem {
    src: string;
    smallsrc?: string;
    type: "image" | "video";
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

interface videoinfo {
    size: `${number}x${number}`;
    format:
        | "unknown"
        | "mp4"
        | "webm"
        | "ogg"
}

interface ImageGalleryProps {
    images: MediaItem[];
    imagefit?: "contain" | "cover" | "original"
    className?: string;
    defaultAlt?: string;
    currImage?: number;
    /**
     * Style of the image container
     */
    style?: React.CSSProperties;
    /**
     * Disable the aspect ratio of the image container
     * 
     * This will make the image container to be responsive
     */
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
    /**
     * Appearance of the image switcher
     * 
     * - `thumbnail` - show thumbnails of the images
     * - `arrows` - show arrows to switch images
     * - `none` - don't show any image switcher
     */
    imageSwitcher?: imageSwitcherAppearance;

    /**
     * Blur the image
     * 
     * aslo shows the small image 
     */
    blurImage?: boolean;
}

type imageSwitcherAppearance = 
    | "thumbnail" 
    | "arrows"
    | "none";

export default function ImageGallery({
    images: media,
    imagefit = "original",
    className = "",
    defaultAlt = "Gallery image",
    currImage = 0,
    style = {},
    disableAspectRatio = false,
    overrideAspectRatio = null,
    disableModal = false,
    showimageinfo = false,
    zoomable = false,
    imageSwitcher = "thumbnail",
    blurImage = false
}: ImageGalleryProps) {
    const [jsLoaded, setJsLoaded] = useState(false);
    useEffect(() => {
        setJsLoaded(true);
    }, [])

    const [currentImage, setCurrentImage] = useState(currImage);
    const [imageLoadingState, setImageLoadingState] = useState<"loading" | "loaded" | "error">("loading");
    const itemimageref = useRef<HTMLImageElement | null>(null);
    const modal = useModal();

    const [showOverlay, setShowOverlay] = useState(true);
    const [overlayContent, setOverlayContent] = useState<JSX.Element | null>(<LoadingCircle />);
    const [mediaInfo, setMediaInfo] = useState<imageinfo | videoinfo | null>(null);
    
    const verifyImageFormat = (format: string) => {
        return ["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(format);
        // return ["png", "jpg", "jpeg", "webp", "svg", "gif", "bmp", "tiff", "ico", "cur", "heic", "heif", "avif"].includes(format);
    }

    const getImageInfo = () => {
        if (!itemimageref.current) return;
        const ref = itemimageref.current;
        setMediaInfo({
            size: `${ref.naturalWidth}x${ref.naturalHeight}`,
            format: verifyImageFormat(ref.src.split(".").pop() || "") ? ref.src.split(".").pop() as imageinfo["format"] : "unknown"
        });
    }

    useEffect(() => {
        setImageLoadingState("loading");

        if (!itemimageref.current) {
            return;
        };

        const observer = new MutationObserver((changes) => {
            if (changes.length === 1 && changes[0].attributeName === "src") {
                setImageLoadingState("loading");
            }
        });
        observer.observe(itemimageref.current, {
            attributes: true,
            attributeFilter: ["src"]
        });

        itemimageref.current.onload = () => {
            setImageLoadingState("loaded");
            getImageInfo();
        }
        itemimageref.current.onerror = () => {
            setImageLoadingState("error");
        }
        if (itemimageref.current.complete) {
            setImageLoadingState("loaded");
            getImageInfo();
        }
        
        return () => {
            if (itemimageref.current) {
                itemimageref.current.onload = null;
                itemimageref.current.onerror = null;
            }
            observer.disconnect();
        }
    }, [itemimageref, jsLoaded])
    
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

    
    const selectimage = (index: number) => {
        if (index < 0 || index >= media.length) return;
        setCurrentImage(index);
    }

    const switchImage = (index: number) => {
        if (index < 0) {
            setCurrentImage(media.length - 1);
        } else if (index >= media.length) {
            setCurrentImage(0);
        } else {
            setCurrentImage(index);
        }
    }

    const openImagePreviewModal = () => {
        if (!modal) return;
        if (blurImage) return;
        if (disableModal) return;

        const modal_media: MediaItem[] = media
            .filter(item => item.type === "image")
            .map(image => {
            return {
                type: "image",
                src: image.src,
                alt: image.alt
            }
        })
        if (modal_media.length === 0) return;


        modal.openModal({
            style: { width: "90dvw", height: "100vh"  },
            contentStyle: {},
            id: "imageGallery",
            content: () => (
                <ImageGallery
                    imageSwitcher="arrows"
                    imagefit="contain"
                    style={{ width: "100%", height: "100%"}}
                    currImage={currentImage}
                    images={modal_media}
                    // { image: images[currentImage].image, alt: images[currentImage].alt }
                    disableModal={true}
                    defaultAlt={media[currentImage].alt}
                    disableAspectRatio={true}
                />
            )
        });
    }

    return (
        <div className={`imageGallery ${className}`} style={style}>
            {/* <div className="debug">
                <p>currentImage: {currentImage}</p>
                <p>imageLoadingState: {imageLoadingState}</p>
                <p>showOverlay: {showOverlay ? "true" : "false"}</p>
                <p>overlayContent: {overlayContent ? "true" : "false"}</p>
            </div> */}
            <div className={`imageContainer ${disableAspectRatio ? "disableAspectRatio" : ""} ${disableModal ? "disablePointer" : ""} imgfit-${
                imageLoadingState == "loaded" && !blurImage ? imagefit : "contain"
            }`}
                onClick={() => openImagePreviewModal()}
                style={{
                    overflow: zoomable ? "auto" : "hidden",
                    aspectRatio: overrideAspectRatio || `16/9`,
                    ...style
                }}
            >
                {
                    blurImage ? (
                        <div className="overlay show blur">
                            <Icon 
                                size="128px"
                                name="eye_off"
                            />
                        </div>
                    ) : null
                }
                {
                    showOverlay ? (
                        <div className={`overlay show ${blurImage ? "blur" : ""}`}> {overlayContent} </div>
                    ) : null
                }
                {   
                    media.length > 0 &&
                        <>
                        {jsLoaded ? <img 
                            ref={itemimageref} 
                            src={!blurImage ? media[currentImage].src : media[currentImage].smallsrc || media[currentImage].src} 
                            alt={media[currentImage].alt || defaultAlt} 
                            className="mainImage"
                        /> : null}
                        { showimageinfo ? mediaInfo ? (
                            <div className="imageinfo">
                                <p>size: {mediaInfo.size} format: {mediaInfo.format}</p>
                            </div>
                        ) : (
                            <div className="imageinfo">
                                <p>Loading image info...</p>
                            </div>
                        ) : null }
                        {media[currentImage].shortDescription && (
                            <p className="shortDescription">{media[currentImage].shortDescription}</p>
                        )}
                        </>
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
            {   imageSwitcher === "thumbnail" &&
                media.length > 1 && (
                <div className="gallery">
                    {
                        media.map((item, index) => {
                            return (
                                <div className="noselect image" key={index} onClick={() => selectimage(index)}>
                                    <img src={item.smallsrc || item.src} alt={item.alt}
                                        draggable={false}
                                        className={`noselect thumbnail ${index === currentImage ? "selected" : ""}`}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
                )
            }
            {
                imageSwitcher === "arrows" &&
                media.length > 1 && (
                    <>
                        <div className="arrows flex">
                            <button className="arrow left" onClick={() => switchImage(currentImage - 1)}>
                                <Icon name="arrow_left" />
                            </button>
                            <div className="currentImage">
                                {currentImage + 1} / {media.length}
                            </div>
                            <button className="arrow right" onClick={() => switchImage(currentImage + 1)}>
                                <Icon name="arrow_right" />
                            </button>
                        </div>
                    </>
                )
            }
        </div>
    )
}