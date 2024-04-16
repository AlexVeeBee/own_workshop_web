import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    return { id: params.id };
}

export default function Item() {
    const i = useLoaderData<{ id: string }>();
    return (
        <div>
            <h1>Item</h1>
            <p>{i.id}</p>
        </div>
    )
}