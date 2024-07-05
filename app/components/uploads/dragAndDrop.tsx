import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import "./dragAndDrop.css"
import Icon from "../icons";

interface DragAndDropProps {
    onFileInsert: (e: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement> | Event) => void;
    insertFilesFromEvent: (e: DragEvent) => void;
    uploadArea: React.RefObject<HTMLDivElement>;
    uploadField: React.RefObject<HTMLInputElement>;
    // files: FileList;
    // setFiles: React.Dispatch<React.SetStateAction<FileList>>;
    accepts?: acceptTypes[];
    className?: string;
    style?: React.CSSProperties;
}
const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const ErrorBox = (title: string, errors: string[]) => {
    const style: React.CSSProperties = {
        borderRadius: "5px",
        margin: "10px 10px",
        maxWidth: "100%",
        width: "100%",
        pointerEvents: "none",
    }
    return (
        <div className="flex column" style={style}>
            <h3>{title}</h3>
            {
                errors.map((error, i) => {
                    return <p key={i}>{error}</p>
                })
            }
        </div>
    )
}

type acceptAuidoTypes =
    | "*"
    | "mpeg"
    | "mp3"
    | "webm"

type acceptVideoTypes =
    | "*"
    | "mp4"
    | "webm"
    | "ogg"

type acceptImageTypes =
    | "*"
    | "png"
    | "jpeg"
    | "webp"


type acceptTypes =
    | "*"
    | `audio/${acceptAuidoTypes}`
    | `video/${acceptVideoTypes}`
    | `image/${acceptImageTypes}`
    | "application/pdf"
    | "application/zip"
    | "application/zip-compressed"
    | "application/x-zip-compressed"


export default function DragAndDrop({
    onFileInsert,
    insertFilesFromEvent,
    uploadArea,
    uploadField,
    // files,
    // setFiles,
    accepts = ["*"],
    className = "",
    style = {}
}: DragAndDropProps) {
    const [hover, setHover] = useState(false);
    const [dragging, setDragging] = useState(false);

    const [dargErrors, setDragErrors] = useState<{
        title: string;
        errors: string[];
    }[]>([]);

    useEffect(() => {
        uploadField.current?.addEventListener("change", (e) => {
            setHover(false);
            setDragging(false);
            onFileInsert(e);
            checkFiles(uploadField.current?.files || new DataTransfer().files);
        });
        return () => {
            uploadField.current?.removeEventListener("change", () => {
                console.log("removed event listener")
            });
        }
        // hover
    }, [])

    const onClick = () => {
        uploadField.current?.click();
    }

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        console.log("dropped:", e.dataTransfer.files);
        if (uploadField.current == null) {
            console.error("uploadField is null. Skipping drop event");
            return;
        }
        if (e.dataTransfer.files == null) {
            console.error("e.dataTransfer.files is null. Skipping drop event");
            return;
        }
        console.log("Setting up files")
        uploadField.current.files = e.dataTransfer.files;
        e.preventDefault();
        setHover(false);
        setDragging(false);
        checkFiles(e.dataTransfer.files);
        insertFilesFromEvent(e);
    }

    const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHover(true);
        setDragging(true);
    }

    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHover(false);
        setDragging(false);
    }

    const checkFiles = (files: FileList) => {
        const errors: { title: string, errors: string[] }[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let ers = []
            if (file.size > 100000000) {
                ers.push(`File size is ${bytesToSize(file.size)}, max size is 100MB`);
            }
            if (accepts.indexOf(file.type as acceptTypes) === -1) {
                if (accepts.indexOf("*") === -1) {
                    ers.push(`File type ${file.type} is not allowed of type ${accepts.join(", ")}`);
                }
            }
            if (ers.length !== 0) {
                errors.push({
                    title: file.name,
                    errors: ers
                })
            }
        }
        setDragErrors(errors);
    }

    return (
        <div 
            style={style}
            className={`${className} drag-and-drop flex column ${hover ? "hover" : ""} ${dragging ? "dragging" : ""}`}
            ref={uploadArea}
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e)}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        >
            <input
                type="file"
                ref={uploadField}
                accept={accepts.join(", ")}
                multiple
            />
            <div className="noMouseEvents flex column align-center">
                <Icon name="upload" size="64px" />
                <p>Click or drag to upload</p>
            </div>
            {
                dargErrors.length > 0 && <div className="flex column">
                    {
                        dargErrors.map((er, i) => {
                            return ErrorBox(er.title, er.errors)
                        })
                    }
                </div>
            }
        </div>
    )
}