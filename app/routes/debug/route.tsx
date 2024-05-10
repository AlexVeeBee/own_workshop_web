import InfoCard from "~/components/UI/infoCard";
import ImageGallery from "~/components/imageGallery";

export default function DebugPage() {
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
            </div>
        </main>
    )
}