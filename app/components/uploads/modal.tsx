import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/user/userProvider";
import Card from "../UI/card";
import InfoCard from "../UI/infoCard";
import Button from "../UI/buttons";
import { useModal } from "../contexts/modal/modalProvider";
import ImageGallery from "../imageGallery";
import DragAndDrop from "./dragAndDrop";

interface UploadModalProps {
    modalid: string;
}

export default function UploadModal({
    modalid,
}: UploadModalProps) {
    const modal = useModal();
    const [progress, setProgress] = useState<number>(0);
    const user = useUser();
    const uploadField = useRef<HTMLInputElement>(null);
    const uploadArea = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState<FileList>(new DataTransfer().files);

    const onFileInsert = async (e:
        | DragEvent<HTMLDivElement>
        | ChangeEvent<HTMLInputElement>
        | Event
    ) => {
        uploadArea.current?.classList.remove("hover");
        // @ts-ignore
        const files = e?.target?.files;
        if (!files) return;
        setFiles(files);
    }

    const insertFilesFromEvent = (e: DragEvent) => {
        e.preventDefault();
        uploadArea.current?.classList.remove("hover");
        console.log(e.dataTransfer.files);
        const dt = e.dataTransfer;
        if (!dt.items) return;
        const files = dt.files;
        setFiles(files);
    }

    const bytesToSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }

    // useEffect(() => {
    //     uploadField.current?.addEventListener("change", (e) => {
    //         uploadArea.current?.classList.remove("hover");
    //         if (uploadArea.current) uploadArea.current.style.borderColor = "#333";
    //         onFileInsert(e);
    //     });
    //     // hover
    //     uploadArea.current?.addEventListener("dragenter", () => {
    //         uploadArea.current?.classList.add("hover");
    //         if (uploadArea.current) uploadArea.current.style.borderColor = "#666";
    //     });
    //     uploadArea.current?.addEventListener("dragleave", () => {
    //         uploadArea.current?.classList.remove("hover");
    //         if (uploadArea.current) uploadArea.current.style.borderColor = "#333";
    //     });
    //     return () => {
    //         uploadField.current?.removeEventListener("change", () => {});
    //         uploadArea.current?.removeEventListener("dragenter", () => {});
    //         uploadArea.current?.removeEventListener("dragleave", () => {});
    //     }
    // }, [uploadField, uploadArea]);

    return (
        <div className="upload-modal flex column"
            style={{
                gap: "var(--global-page-gap-2)",
            }}
        >
            <Card>
                <p>Max file size: 100MB</p>
                <p>Allowed file types: .zip</p>
                <p>Max files: 1</p>
            </Card>
            <Card>
                {/* <div 
                    ref={uploadArea}
                    className="flex column drag-or-click-upload fillwidth justify-center align-center"
                    style={{
                        minHeight: "200px",
                        border: "2px dashed #333",
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor: "#232323"
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={(e) => {
                        insertFilesFromEvent(e);
                    }}
                    onClick={() => {
                        uploadField.current?.click();
                    }}
                >
                    <p style={{pointerEvents: "none"}}>Drag or click to upload</p>
                </div> */}
                <DragAndDrop
                    onFileInsert={onFileInsert}
                    insertFilesFromEvent={insertFilesFromEvent}
                    uploadArea={uploadArea}
                    uploadField={uploadField}
                    // files={files}
                    // setFiles={setFiles}
                    accepts={[
                        "application/zip",
                        "application/zip-compressed",
                        "application/x-zip-compressed"
                    ]}                    
                />
            </Card>
            <Card>
                <div className="flex align-center"
                    style={{
                        gap: "var(--global-page-gap-2)",
                    }}
                >
                    <Button onClick={() => {}} btnType="PRIMARY">Upload</Button>
                    <Button onClick={
                        () => modal.closeModal(modalid)
                    } btnType="DANGER">Cancel</Button>
                    <select>
                        <optgroup label="as">
                            <option value="new">New asset</option>
                        </optgroup>
                        <optgroup label="update">
                            <option value="asset-1">Asset 1</option>
                            <option value="asset-2">Asset 2</option>
                            <option value="asset-3">Asset 3</option>
                        </optgroup>
                    </select>
                </div>
            </Card>
            {
                Array.from(files).map((file, i) => {
                    return <Card
                        key={i}
                        style={{
                            flexDirection: "row",
                            gap: "var(--global-page-gap-2)",
                        }}
                    >
                        {
                            file.type && file.type.startsWith("image") &&
                            <img 
                                src={URL.createObjectURL(file)}
                                style={{
                                    width: "64px",
                                }}
                                onClick={() => {
                                    modal.openModal({
                                        id: "file-preview",
                                        title: "File preview",
                                        style: {
                                            width: "100%",
                                            maxWidth: "1200px",
                                            height: "100%",
                                        },
                                        content: () => (
                                            <ImageGallery
                                                imagefit="contain"
                                                images={[{src: URL.createObjectURL(file),type:"image",alt: "File preview"}]}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                currImage={0}
                                                disableModal={true}
                                                disableAspectRatio={true}
                                            />
                                        )
                                    });
                                
                                }}
                            />
                        }
                        <div className="flex column justify-center">
                            <p>{file.name}</p>
                            <p>{bytesToSize(file.size)}</p>
                        </div>
                    </Card>
                } )
            }
            <input 
                ref={uploadField}
                style={{
                    display: "none"
                }}
                type="file" 
                accept=".zip"
            />
        </div>
    )
} 