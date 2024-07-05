import { DragEvent, useEffect, useRef, useState } from "react";
import InfoCard from "~/components/UI/infoCard";
import ImageGallery from "~/components/imageGallery";
import DragAndDrop from "~/components/uploads/dragAndDrop";
import { TagTest } from "./comp.TagsTest";
import Error from "~/components/_error";
import { useRouteError } from "@remix-run/react";
import SimpleError from "~/components/_simpleError";
import { useModal } from "~/components/contexts/modal/modalProvider";
import Button from "~/components/UI/buttons";


export const handle = {
    breadcrumb: () => {
        return "Debug zone";
    }
};

// mock ReferenceError: DataTransfer is not defined

export default function DebugPage() {
    const modal = useModal();

    const openTagTest = () => {
        modal.openModal({
            id: "imageUtils",
            title: "Image Utils",
            style: {
                width: "100%",
                height: "100%",
            },
            content(id, forceClose) {
                return <TagTest />
            },
        })
    }

    return (
        <main>
            <div className="center flex column align-start">
                <h1>Debug Page</h1>
                <p>Debugging the website and the API</p>
                <h2>Included Features</h2>
                <ul>
                    {/* <li>Debugging the website</li>
                    <li>Debugging the API</li>
                    <li>Testing the website</li>
                    <li>Testing the API</li> */}
                    <li>React Components</li>
                </ul>
            </div>
            <div className="center mainbkg flex column align-start"
                style={{
                    padding: "24px",
                    margin: "24px",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
                }}
            >
                <p>This is a debug page. It is used to test and debug the website.</p>
                <h1>Image Gallery</h1>
                <div className="flex justify-start align-start fillwidth">
                    <ImageGallery
                        showimageinfo={true}
                        images={[
                            // place holder images
                            {
                                src: "https://via.placeholder.com/50",
                                type: "image",
                                alt: "Image 1",
                                shortDescription: "This is a placeholder image",
                            },
                            {
                                src: "https://via.placeholder.com/500x200",
                                type: "image",
                                alt: "Image 2",
                                shortDescription: "This is a placeholder image",
                            },
                            {
                                src: "https://via.placeholder.com/1920x1080",
                                type: "image",
                                alt: "Image 3",
                            }
                        ]}
                    />
                    <ImageGallery
                        images={[
                            {
                                src: "https://via.placeholder.com/150",
                                type: "image",
                                alt: "Image 1",
                                shortDescription: "Single image",
                            },
                        ]} 
                    />
                </div>
                <ImageGallery
                    imageSwitcher="arrows"
                    showimageinfo={true}
                    showImageInfoButton={true}
                    images={[
                        // place holder images
                        {
                            src: "https://via.placeholder.com/50",
                            type: "image",
                            alt: "Image 1",
                            shortDescription: "This is a placeholder image",
                        },
                        {
                            src: "https://via.placeholder.com/500x200",
                            type: "image",
                            alt: "Image 2",
                            shortDescription: "This is a placeholder image",
                        },
                        {
                            src: "https://via.placeholder.com/1920x1080",
                            type: "image",
                            alt: "Image 3",
                        }
                    ]}
                />
                <h1>Info cards</h1>
                <InfoCard status="info">
                    <p>This is an info card</p>
                    <a>Click me</a>
                </InfoCard>
                <InfoCard status="warning">
                    <p>This is a warning card</p>
                    <a>Click me</a>
                </InfoCard>
                <InfoCard status="error">
                    <p>This is an error card</p>
                    <a>Click me</a>
                </InfoCard>
                <InfoCard status="success">
                    <p>This is a success card</p>
                    <a>Click me</a>
                </InfoCard>
                <Button
                    onClick={openTagTest}
                    btnType="PRIMARY"
                >Open Image Utils</Button>
            </div>
        </main>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (
        <main>
            <div className="center"> <SimpleError errordata={error} /> </div>
        </main>
    );
}