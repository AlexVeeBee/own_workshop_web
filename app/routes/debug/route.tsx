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
                <div className="flex justify-start align-start">
                    <ImageGallery
                        images={[
                            {
                                image: "http://localhost:8080/assets/items/5/images/1.jpg",
                                alt: "Image 1",
                                shortDescription: "Toru from Dragon Maid",
                            },
                            {
                                image: "http://localhost:8080/assets/items/5/images/CalmTFDown.jpg",
                                alt: "Image 2",
                                shortDescription: "This is a funny image",
                            },
                            {
                                image: "http://localhost:8080/assets/items/5/images/image0.gif",
                                alt: "Image 3",
                            }
                        ]}
                    />
                    <ImageGallery
                        images={[
                            {
                                image: "http://localhost:8080/assets/items/5/images/1.jpg",
                                alt: "Image 1",
                                shortDescription: "Toru from Dragon Maid",
                            },
                        ]} />

                </div>
            </div>
        </main>
    )
}