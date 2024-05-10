import { useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useUser } from "~/components/contexts/user/userProvider";
import UserHeader from "~/components/user/UserHeader";
import { IUser } from "~/utils/types";
import { UserInfoCard } from "~/components/user/userInfoCard";

export async function loader({ params }: { params: { id: string } }) {
    const f = await fetch(`http://localhost:8080/api/user/get/${params.id}`);
    if (!f.ok) {
        return { status: f.status };
    }
    return f.json();
}

export default function UserPage() {
    const user = useLoaderData<IUser | { status: number }>()

    if ("status" in user) {
        return <>
            <main>
                <div className="center flex column">
                    <h1>User not found: {user.status}</h1>
                </div>
            </main>
        </>
    }

    return (
        <main>
            <div className="center flex column"
                style={{
                    position: "relative",
                }}
            >
                <UserInfoCard 
                    user={user} 
                    className="fillwidth"
                />
            </div>
            <div className="center">
                <div className="flex align-center" style={{gap: "10px"}}>
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