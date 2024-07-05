import SidebarContainer from "~/components/UI/sidebarContainer";
import TextHeader from "~/components/UI/textHeader";
import UserHeader from "~/components/user/UserHeader";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useAppSelector } from "~/utils/hooks";
import { serverHost } from "~/utils/vars";

export const handle = {
    breadcrumb: () => {
        return "Account";
    }
};

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
                <div className="center">

                <SidebarContainer 
                    style={{ height: "100%", width: "100%"}}
                    onSidebarClick={(page) => {}}
                    pages={[
                        {
                            path: `${urlprefix}/`,
                            title: "Overview",
                            default: true,
                        },
                        {
                            path: `${urlprefix}/settings`,
                            title: "Settings",
                        },
                        // {
                        //     path: `${urlprefix}/security`,
                        //     title: "Security",
                        // },
                    ]}
                />
                </div>
            </main>
        </>
    )
}