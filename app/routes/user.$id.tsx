import { useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { WorkshopHeader } from "~/components/WorkshopHeader";
import { useUser } from "~/components/contexts/user/userProvider";
import { IUser } from "~/utils/types";

export async function loader({ params }: { params: { id: string } }) {
    const f = await fetch(`http://localhost:8080/api/user/get/${params.id}`);
    if (!f.ok) {
        throw new Error("User not found");
    }
    return f.json();
}

export default function UserPage() {
    const { username } = useLoaderData<IUser>()
    const [showUsername, setShowUsername] = useState(false)

    return (
        <main>
            <div className="center">
                {/* <WorkshopHeader
                    title="Own Workshop"
                    description="This is a workshop"
                    // showUser={true}
                    // id={id}
                    // showUsername={true}
                /> */}
            </div>
            <div className="center">
                <div className="flex align-center" style={{gap: "10px"}}>
                    <h1>{username}</h1>
                </div>
            </div>
        </main>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
    return (
      <>
        <main>
          <div className="center flex column">
            <div style={{ textAlign: "center", padding: "20px", paddingBottom: "0" }}>
                {/* @ts-ignore */}
                <p>Unable to fetch user: {error.message}</p>
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
      </>
    );
  }