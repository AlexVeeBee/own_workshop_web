import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useOutlet, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/card";
import { IWorkshopItem } from "~/utils/types";

import "~/style/workshop-page.css";
import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";
import TabBar from "~/components/UI/tabBar";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};

const pages = [
    "overview",
    "comments",
    "changelog",
    "config",
    "debug"
]

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const f = await fetch(`http://localhost:8080/api/workshop/get/${params.id}`);
    if (!f.ok) {
        throw new Error("Item not found");
    }
    return {
        id: params.id,
        item: await f.json()
    }
}

type IImageLoadingStatus = "loading" | "loaded" | "error";
export default function Item() {
    const location = useLocation();
    const outlet = useOutlet();
    const i = useLoaderData<{ 
        id: string,
        item: IWorkshopItem
    }>();
    const [tabIndex, setTabIndex] = useState(-1);
    const [showThumb, setShowThumb] = useState(true);
    useEffect(() => {
    }, [])

    const itemWarning: {
        type: "warning" | "error" | "info",
        message: string
    }[] = [
        // {
        //     type: "warning",
        //     message: "This item cannot be modified while being a placeholder"
        // },
        {
            type: "info",
            message: "This is only a placeholder"
        }
    ]
    
    useEffect(() => {
        const page = window.location.pathname.split("/").pop();
        if (page && pages.includes(page)) {
            setTabIndex(pages.indexOf(page));
            console.log("setting tab index to", pages.indexOf(page));
            if (page === "overview") {
                i.item.media && i.item.media.length > 0 ? setShowThumb(true) : setShowThumb(false);
            } else {
                setShowThumb(true);
            }
        }
    }, [location])

    return (
        <main id="workshop-item-container">
            {i.item.properties?.CSS ? (<link rel="stylesheet" href={`http://localhost:8080/${i.item.properties.CSS}`} />) : null}
            <div className="center" style={{margin: "0 24px"}}>
                <div style={{width: "100%", margin: "24px 0"}} className="margin">
                    <h1>Someonws Workshop</h1>
                </div>
            </div>
            {
                itemWarning.length > 0 && <div className="center flex column" style={{
                    marginBottom: "20px"
                }}>
                    {
                        itemWarning.map((w, i) => {
                            return <InfoCard key={i} status={w.type}>{w.message}</InfoCard>
                        })
                    }
                </div>
            }
            <div className="center">
            <TabBar
                activeIndex={tabIndex}
                onTabChange={(tab) => {
                    setTabIndex(tab);
                }}
                tabs={[
                    {
                        title: "Overview",
                        link: `/item/${i.id}/overview`,
                        position: "left"
                    },
                    {
                        title: "Comments",
                        link: `/item/${i.id}/comments`,
                        position: "left"
                    },
                    {
                        title: "Changelog",
                        link: `/item/${i.id}/changelog`,
                        position: "left"
                    },
                    {
                        title: "Config",
                        link: `/item/${i.id}/config`,
                        position: "left"
                    },
                    {
                        title: "Debug",
                        link: `/item/${i.id}/debug`,
                        position: "left"
                    }
                ]}
            />
            </div>
            <div className="center mainbkg flex align-start" id="workshop-item">
                { outlet ? <Outlet context={i.item} /> : <div className="left"></div> }
                <div className="right mobile-v-hide">
                    <WorkshopItemSidebar 
                        version={i.item.version}
                        authors={i.item.authors}
                        thumb={showThumb ? i.item.thumb : ""}
                        tags={i.item.tags}
                        owner={i.item.owner}
                    />
                </div>
            </div>
        </main>
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