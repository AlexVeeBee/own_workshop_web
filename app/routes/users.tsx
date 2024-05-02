import { Link, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useUser } from "~/components/contexts/user/userProvider";
import UserHeader from "~/components/user/UserHeader";
import { IUser } from "~/utils/types";
import User from "~/components/user/user";

export async function loader() {
    const f = await fetch(`http://localhost:8080/api/users`);
    if (!f.ok) {
        throw new Error("404");
    }
    return f.json();
}

export default function UserPage() {
    const user = useLoaderData<IUser[]>()

    return (
        <main>
            <div className="center flex column align-start" style={{padding:"12px 0" ,position: "relative",}}>
                <h1>Users</h1>
            </div>
            <div className="center">
                <div className="flex align-center column" style={{gap: "10px", width: "100%", textDecoration: "none"}}>
                    {
                        user.map((u) => (
                            <Link to={`/user/${u.id}`} key={u.id}
                                style={{width: "100%", textDecoration: "none"}}
                            >
                                <User
                                    data={u}
                                />
                            </Link>
                        ))
                    }
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
                <p>Unable to fetch users: {error.message}</p>
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