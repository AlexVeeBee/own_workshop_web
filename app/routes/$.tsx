import Card from "~/components/UI/card";

export default function Route() {
    return (
        <main>
            <div className="center">
                <Card
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h1>404</h1>
                    <p>Page not found</p>
                </Card>
            </div>
        </main>
    )
}