import { Link, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useEffect, useState } from "react";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { IUser } from "~/utils/types";
import User from "~/components/user/user";
import LoadingCircle from "~/components/LoadingCircle";
import { serverHost } from "~/utils/vars";
import TextHeader from "~/components/UI/textHeader";
import SimpleError from "~/components/_simpleError";
import { FetchError } from "~/utils/errors";

export const handle = {
    breadcrumb: () => {
        return "Users";
    }
};

export async function loader() {
    const f = await fetch(`${serverHost}/v1/users`);
    if (!f.ok) {
        throw new FetchError(`${f.status} - ${f.statusText}: ${await f.text()}`);
    }
    return f.json();
}

export default function UserPage() {
    const user = useLoaderData<IUser[]>()
    const [users, setUsers] = useState<IUser[]>(user)
    const [searching, setSearching] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")

    const backendSearch = async (search: string) => {
        const f = await fetch(`${serverHost}/v1/users?search=${search}`);
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
            <div className="center">
                <TextHeader
                    title={`Users (${users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())).length})`}
                />
            </div>
            <div className="center flex column align-start" style={{paddingBottom:"12px" ,position: "relative",}}>
                {/* <h1>Users ({ users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())).length })</h1> */}
                <input
                    type="text"
                    placeholder="Search for user"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{width: "100%", padding: "10px", fontSize: "1rem"}}
                />
            </div>
            <div className="center mainbkg users-list"
                style={{padding:"var(--global-page-padding)"}}
            >
                <div className="flex align-center column" style={{gap: "10px", width: "100%", textDecoration: "none"}}>
                    {
                        !searching ?
                        users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                            <p>No user found</p>
                        ) : <LoadingCircle />
                    }
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
                <div className="center">
                    <SimpleError errordata={error} />
                </div>
            </main>
        </>
    );
  }