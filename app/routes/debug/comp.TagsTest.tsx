import { useRef, useState } from "react";
import LoadingCircle from "~/components/LoadingCircle";
import { useModal } from "~/components/contexts/modal/modalProvider";
import ImageGallery from "~/components/imageGallery";
import DragAndDrop from "~/components/uploads/dragAndDrop";
import { ImageUtils } from "~/utils/imageUtils";

// mock FileList and DataTransfer
// @ts-ignore
globalThis.FileList = class FileList {
    [index: number]: File;
    item(index: number): File | null {
        return this[index] || null;
    }
}


export const TagTest = () => {
    // if (typeof FileList === "undefined") return <p>FileList is not supported</p>;
    // if (typeof DataTransfer === "undefined") return <p>DataTransfer is not supported</p>;
    
    const droparea_utilstest = useRef<HTMLDivElement>(null);
    const droparea_uploadField = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<FileList | null>();
    const [droparea_tags, setDropareaTags] = useState<string[]>([]);

    const fileInputOnChange = async () => {
        // setDropareaTags(["No event listener attached"])
        console.log("Processing files...");
        setDropareaTags(["Processing files..."]);
        setFiles(droparea_uploadField.current?.files || new DataTransfer().files);
        const img = droparea_uploadField.current?.files?.item(0);
        try {
            await ImageUtils.extractStableDifusionTags(img, (tags) => {
                console.log(tags);

                if (tags.tags == null) {
                    setDropareaTags(["No tags found"]);
                    return;
                }
                if (typeof tags.tags === "undefined") {
                    setDropareaTags(["Undefined tags"]);
                    return;
                }
                setDropareaTags(tags.tags);
            })
        } catch (e: any ) {
            console.log("Encountered an error")
            console.error(e);
            setDropareaTags(["Error: " + e.message]);
        }
    }

    return (
        <div className="dropTest fillwidth fillheight flex column">
            <div className="test flex justify-around align-start fillwidth fillheight">
                <div style={{flexShrink: "0"}}>
                    <DragAndDrop
                        uploadArea={droparea_utilstest}
                        uploadField={droparea_uploadField}
                        onFileInsert={(e) => {
                            console.log("File inserted");
                            fileInputOnChange();
                        }}
                        insertFilesFromEvent={(e) => {
                            fileInputOnChange();
                        }}
                        accepts={[
                            "image/png"
                        ]}
                    />
                </div>
                <div className="inputs flex column fillheight"
                style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    flexShrink: "1",
                    flexGrow: "1"
                }}
                >
                    <ImageGallery
                        disableAspectRatio={true}
                        style={{
                            maxWidth: "100%",
                            width: "100%",
                            height: "100%",
                        }}
                        className="fillwidth"
                        images={
                            // []
                            Array.from(files || 
                                new DataTransfer().files
                            ).map((file, i) => {
                                return {
                                    src: URL.createObjectURL(file),
                                    type: "image",
                                    alt: "Dropped image",
                                    shortDescription: file.name
                                }
                            })
                        }
                    />
                </div>
                <div className="outputs"
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        flexShrink: "1",
                        flexGrow: "1"
                    }}
                >
                    <h2>Outputs</h2>
                    <ul>
                        {
                            droparea_tags.map((tag, i) => {
                                return <li key={i}>{tag}</li>
                            })
                        }
                    </ul>
                    <LoadingCircle />
                </div>
            </div>
        </div>
    );
}