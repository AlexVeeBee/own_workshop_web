import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/card";
import { IUser, IWorkshopItem } from "~/utils/types";

import Icon from "~/components/icons";
import User from "~/components/user/user";
import FormattedTextArea from "~/components/UI/formattedTextArea";
import InfoCard from "~/components/UI/infoCard";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};
// /api/workshop/get/:id/comments

interface IComment {
    id: string,
    user: IUser,
    comment: string
    date: string
}

const Comment = ({ data }: { data: IComment }) => {
    return (
        <Card style={{display: "flex", flexDirection: "column", gap: "5px"}}>
            <div className="flex">
                <User 
                    data={data.user} 
                    showUserModal={true}
                    style={{flexGrow: 1, background: "transparent"}}
                />
                <span style={{width: "max-content"}}>{data.date}</span>
            </div>
            <p>{data.comment}</p>
        </Card>
    )
}

export async function loader({ params }: LoaderFunctionArgs) {
    const c = await fetch(`http://localhost:8080/api/workshop/get/${params.id}/comments`)
    if (!c.ok) {
        throw new Error(`Unable to fetch comments (${c.status})`);
    }
    return c.json();
}

export default function ItemComments() {
    const i = useOutletContext<IWorkshopItem>();
    const c = useLoaderData<IComment[]>();

    const [disabled, setDisabled] = useState(false);

    // check if the workshop item has the "disable-comments" flag in the limits
    useEffect(() => {
        const disableComments = i.limits && i.limits.includes("disable-comments");
        if (disableComments) {
            setDisabled(true);
        }
    }, [i])

    return (
        <>
            <div className="left flex column">
                <h1>Comments</h1>
                {
                    !disabled ? 
                    <>
                        <FormattedTextArea
                            value=""
                            onChange={() => {}}
                            placeholder="Write a comment..." 
                            style={{width: "100%", height: "100px"}}
                        >
                        </FormattedTextArea>
                        <div className="flex justify-end">
                            <button className="btn btn-success">Submit</button>
                        </div>
                    </> : <InfoCard status="warning">Comments are disabled for this item</InfoCard>
                }
                <div className="flex column" style={{gap: "10px"}}>
                    {
                        c.map((comment, i) => (
                            <Comment 
                                key={i} 
                                data={comment}
                            />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (
        <main>
          <div className="center flex column">
            <div style={{ textAlign: "center", padding: "20px", paddingBottom: "0" }}>
                {/* @ts-ignore */}
                <p>Error on this item: {error.message}</p>
            </div>
            {
                // @ts-ignore
                error.stack && <pre
                    style={{padding: "20px", overflow: "auto", whiteSpace: "pre-wrap"}}
                // @ts-ignore
                >{error.stack}</pre>
            }
          </div>
      </main>
    );
  }