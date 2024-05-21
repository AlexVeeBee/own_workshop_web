import { Link, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useUser } from "~/components/contexts/user/userProvider";
import UserHeader from "~/components/user/UserHeader";
import { IUser } from "~/utils/types";
import { UserInfoCard } from "~/components/user/userInfoCard";
import Button, { Buttons } from "~/components/UI/buttons";
import Icon from "~/components/icons";
import Markdown from "~/components/UI/Markdown";
import Card from "~/components/card";

export async function loader({ params }: { params: { id: string } }) {
    const f = await fetch(`http://localhost:8080/api/user/get/${params.id}`);
    if (!f.ok) {
        return { status: f.status };
    }
    return f.json();
}

const SmallSection = ({ children, title }: { children: React.ReactNode, title: string }) => {
    return (
        <div className="flex column" style={{gap: "10px"}}>
            <h2>{title}</h2>
            {children}
        </div>
    )
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
            <div className="center">
                <Link to="/users" className="btn-liminal flex align-center"
                    style={{gap: "10px", padding: "10px 10px"}}
                >
                    <Icon name="arrow_left" />
                    <span>Back</span>
                </Link>
            </div>
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
            <div className="center mainbkg">
                <div className="center flex row fillwidth v-mobile"
                    id="user-content"
                    style={{
                        gap: "20px",
                        padding: "20px",
                    }}
                >
                    <div className="left"
                        style={{
                            width: "25%"
                        }}
                    >
                        <div className="flex column" style={{ gap: "10px", }}>
                            <Buttons.Button
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                }}
                                onClick={() => {}}
                            >
                                <Icon
                                    name="upload"
                                />
                                <span>Upload</span>
                            </Buttons.Button>
                            <SmallSection
                                title="Stats"
                            >
                                <div>
                                    <p>Items: 0</p>
                                    <p>Followers: 0</p>
                                    <p>Following: 0</p>
                                </div>
                            </SmallSection>
                        </div>
                    </div>
                    <div className="right"
                        style={{
                            width: "100%"
                        }}
                    >
                        <Card>
                            <Markdown
                            style={{
                                width: "100%"
                            }}
                            markdown={`
# ${user.username}'s Workshops
## Here are the workshops created by ${user.username}:
### Hello
#### Ho
Here are the workshops created by ${user.username}:
`}
                            />
                        </Card>
                    </div>
                </div>
                {/* <div className="flex align-center" style={{gap: "10px"}}>
                </div> */}
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