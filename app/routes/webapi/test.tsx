import { json } from "@remix-run/node";

export const loader = async () => {
    return new Response("Hello, World!", {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}

export default function Test() {
    return json({ message: "Hello, World!" });
}