import SidebarContainer from "~/components/UI/sidebarContainer";
import TextHeader from "~/components/UI/textHeader";
import UserHeader from "~/components/user/UserHeader";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useAppSelector } from "~/utils/hooks";
import { serverHost } from "~/utils/vars";

const urlprefix = "/account";
const pages = [
    "overview",
    "settings",
    "security",
    // "subscriptions",
    // "billing"
]

export default function Account() {
    const userstore = useAppSelector(state => state.user)

    if (!userstore.id) {
        return (
            <>
                <main>
                    <div className="center flex column">
                        <TextHeader
                            title="Not logged in"
                            description="You need to be logged in to view this page"
                        />    
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <style>
                {`
                html, body {
                    min-height: 100dvh;
                }
                
                body {
                    gap: 0;
                    justify-content: space-between;
                    grid-template-columns: 250px 1fr;
                }

                header {
                    color: white;
                    text-align: center;
                    flex-shrink: 0;
                }
                .account-page {
                    position: relative;
                    height: -webkit-fill-available;
                    height: -moz-available;
                    height: fill-available;
                }
                `}
            </style>
            <main className="account-page">
                <SidebarContainer 
                    style={{ height: "100%", width: "100%"}}
                    onSidebarClick={(page) => {}}
                    pages={[
                        {
                            path: `${urlprefix}/overview`,
                            title: "Overview",
                            default: true,
                        },
                        {
                            path: `${urlprefix}/settings`,
                            title: "Settings",
                        },
                        {
                            path: `${urlprefix}/security`,
                            title: "Security",
                        },
                    ]}
                />
                <div className="center flex column">
                    {/* <TextHeader
                        title="Account"
                        description="Your account information"
                    />    
                    <WorkshopHeader
                        title=""
                        description=""
                        showGradient={false}
                        textAlignment="right"
                        image={`${serverHost}/${userstore.banner}`}
                    />
                    <UserHeader user={userstore} />
                    <pre>
                        {JSON.stringify(userstore, null, 2)}
                    </pre> */}
                    
                    {/* <div className="sidebar-container">
                        <div className="sidebar">
                            {pages.map((page, index) => (
                                <a key={index} href={`${urlprefix}/${page}`}>
                                    {page}
                                </a>
                            ))}
                        </div>
                        <div className="content">
                            <div className="flex column">
                                <TextHeader
                                    title="Overview"
                                    description="Your account overview"
                                />
                                <pre>
                                    {JSON.stringify(userstore, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div> */}
                </div>
            </main>
        </>
    )
}