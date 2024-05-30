import { Link, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useEffect, useState } from "react";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useUser } from "~/components/contexts/user/userProvider";
import UserHeader from "~/components/user/UserHeader";
import { IUser } from "~/utils/types";
import User from "~/components/user/user";
import LoadingCircle from "~/components/LoadingCircle";
import { serverHost } from "~/utils/vars";

export async function loader() {
    const f = await fetch(`${serverHost}/api/users`);
    if (!f.ok) {
        throw new Error(`${f.status} - ${f.statusText}: ${await f.text()}`);
    }
    return f.json();
}

export default function UserPage() {
    const user = useLoaderData<IUser[]>()
    const [users, setUsers] = useState<IUser[]>(user)
    const [searching, setSearching] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")

    const backendSearch = async (search: string) => {
        const f = await fetch(`${serverHost}/api/users?search=${search}`);
        if (!f.ok) {
            throw new Error("404");
        }
        return f.json();
    }

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        timeout = setTimeout(() => {
            if (search === "") {
                setUsers(user);
                return;
            }
            setSearching(true);
            backendSearch(search).then((data: IUser[]) => {
                setUsers(data);
                setSearching(false);
            }).catch((e) => {
                console.error(e);
                setSearching(false);
            })
        }, 500)
        return () => {
            clearTimeout(timeout);
        }
    }, [search])


    return (
        <main>
            <div className="center flex column align-start" style={{padding:"12px 0" ,position: "relative",}}>
                <h1>Users ({ users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())).length })</h1>
                <input
                    type="text"
                    placeholder="Search for user"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{width: "100%", padding: "10px", fontSize: "1rem"}}
                />
            </div>
            {
                !searching ?
                users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <p>No user found</p>
                ) : <LoadingCircle />
            }
            <div className="center">
                <div className="flex align-center column" style={{gap: "10px", width: "100%", textDecoration: "none"}}>
                    {
                        users
                        .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
                        .map((u) => (
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