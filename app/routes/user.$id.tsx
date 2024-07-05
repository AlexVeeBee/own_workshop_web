import { Link, Outlet, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { useEffect, useState } from "react";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useUser } from "~/components/contexts/user/userProvider";
import UserHeader from "~/components/user/UserHeader";
import { IUser } from "~/utils/types";
import { UserInfoCard } from "~/components/user/userInfoCard";
import Button, { Buttons } from "~/components/UI/buttons";
import Icon from "~/components/icons";
import Markdown from "~/components/UI/Markdown";
import Card from "~/components/UI/card";
import TabBar from "~/components/UI/tabBar";
import InfoCard from "~/components/UI/infoCard";
import { useAppSelector } from "~/utils/hooks";
import { useModal } from "~/components/contexts/modal/modalProvider";
import UploadModal from "~/components/uploads/modal";
import { serverHost } from "~/utils/vars";

export const handle = {
    breadcrumb: () => {
        return "User";
    }
};

const pages: {
    path: string;
    title: string;
    default?: boolean;
}[] = [
    { title: "Items", path: "/", default: true },
    { title: "Info", path: "/users" },
]

export async function loader({ params }: { params: { id: string } }) {
    const f = await fetch(`${serverHost}/v1/user/get/${params.id}`);
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
    const userStore = useAppSelector(state => state.user);
    const modal = useModal();

    const upload = () => {
        modal.openModal({
            id: "upload-assets",
            title: "Upload",
            style: {
                width: "100%",
                maxWidth: "500px",
            },
            contentStyle: {
                padding: "20px",
            },
            content: (id) => <UploadModal modalid="upload-assets"/>,
        })
    }
    
    if ("status" in user) {
        return <>
            <main>
                <div className="center flex column">
                    <h1>User not found: {user.status}</h1>
                </div>
            </main>
        </>
    }

    const [nsfw, setNsfw] = useState<boolean>(user.nsfw);

    useEffect(() => {
        // check if the user is logged in and owns the account
        if (userStore.id === user.id) {
            setNsfw(false);
        }
    }, [userStore.id, user.id])

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
            {
                !nsfw ? (
                    <>
                    <div className="center flex column"
                        style={{
                            position: "relative",
                        }}
                    >
                            {
                            user.nsfw && 
                                <InfoCard
                                    status="error"
                                >
                                    <div className="flex align-center"
                                        style={{
                                            gap: "var(--global-page-gap-2)",
                                        }}
                                    >
                                        <Icon name="alert" />
                                        <p>This user has NSFW content</p>
                                    </div>
                                </InfoCard>
                        }
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
                                    flexGrow: 1,
                                }}
                            >
                                <div className="flex column" style={{ gap: "10px", }}>

                                    { userStore.id === user.id && (
                                        <Buttons.Button
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "5px",
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center",
                                            }}
                                            onClick={() => {
                                                upload();
                                            }}
                                        >
                                            <Icon
                                                name="upload"
                                            />
                                            <span>Upload</span>
                                        </Buttons.Button>
                                    )}

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
                            <div className="right flex column"
                                style={{
                                    flexBasis: "75%",
                                    gap: "20px",
                                }}
                            >
                                <Card>
                                    <Markdown
                                    style={{
                                        width: "100%"
                                    }}
                                    markdown={`# ${user.username}'s Workshop Items
`}
                                    />
                                </Card>
                                <div className="userContent">
                                    <TabBar
                                        onTabChange={(tab) => {}}
                                        tabs={[
                                            { title: "Home", link: "./" },
                                            { title: "Debug", link: "./debug" },
                                            // { title: "Comments", link: "./comments" },
                                            // { title: "Followers", link: "./followers" },
                                            // { title: "Following", link: "./following" },
                                        ]}
                                    />
                                    <Outlet
                                        context={{
                                            user
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex align-center" style={{gap: "10px"}}>
                        </div> */}
                    </div>
                    </>
                ) : (
                    <div className="center flex column">
                        <InfoCard
                            status="error"
                        >
                            <div className="flex align-center"
                                style={{gap: "var(--global-page-gap-2)",}}
                            >
                                <Icon name="alert" size={64} />
                                <h1>NSFW Content</h1>
                            </div>
                            <p>This user has NSFW content. Are you sure you want to view it?</p>
                            <Button
                                onClick={() => setNsfw(false)}
                            >
                                Yes
                            </Button>
                        </InfoCard>
                    </div>
                )
            }
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