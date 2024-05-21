import { useState } from "react";
import { ActionBar } from "../UI/IconsActionBar";
import ImageGallery from "../imageGallery";
import { imageFitOptions } from "~/utils/types";

export default function ThumbnailPreviewModal({
    image
}: {
    image: string;
}) {
    const [fitOptions, setFitOptions] = useState<imageFitOptions>("original");
    return (
        <>
            <ImageGallery
                style={{ width: "100%", height: "100%" }}
                images={[{ src: image, type: "image", alt: "Workshop preview image" }]}
                currImage={0}
                disableModal={true}
                imagefit={fitOptions}
                overrideAspectRatio={"1/1"}
            />
            <div className="flex justify-center align-center" style={{gap: "8px"}}>
            <ActionBar
                clickBehavior="single"
                actions={[
                    {
                        text: "Original",
                        onClick: () => {
                            setFitOptions("original");
                        },
                        title: "Original size",
                        active: true,
                    },
                    {
                        text: "Contain",
                        onClick: () => {
                            setFitOptions("contain");
                        },
                        title: "Fit to screen",
                    }
                ]}
            />
            </div> 
        </>
    );
}