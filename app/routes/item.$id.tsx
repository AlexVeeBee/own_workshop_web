import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useOutlet, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import { AssetVersion, IWorkshopItem } from "~/utils/types";

import "~/style/workshop-page.css";
import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";
import TabBar from "~/components/UI/tabBar";
import Button, { Buttons } from "~/components/UI/buttons";
import { serverHost } from "~/utils/vars";
import TextHeader from "~/components/UI/textHeader";
import { FetchNotOkError } from "~/utils/errors";
import SimpleError from "~/components/_simpleError";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};

const urlprefix = "/item";
const pages = [
    "overview",
    "comments",
    "changelog",
    "versions",
    "config",
    "debug"
]

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const f = await fetch(`${serverHost}/v1/workshop/get/${params.id}`);
    if (!f.ok) {
        throw new FetchNotOkError("Unable to fetch item: " + `${f.status} ${f.statusText}`);
    }
    const versions = await fetch(`${serverHost}/v1/workshop/get/${params.id}/versions`);
    if (!versions.ok) {
        console.warn("[WARN]:Versions not found");
    }
    return {
        id: params.id,
        item: await f.json(),
        versions: await versions.json()
    }
}

interface ItemWarning {
    type: "warning" | "error" | "info",
    message: string
}

type IImageLoadingStatus = "loading" | "loaded" | "error";
export default function Item() {
    const location = useLocation();
    const outlet = useOutlet();
    const i = useLoaderData<{ 
        id: string,
        item: IWorkshopItem,
        versions: AssetVersion[],
        // versions: {
        //     version: string,
        //     isLatest: boolean
        // }[]
    }>();
    const [tabIndex, setTabIndex] = useState(-1);
    const [showThumb, setShowThumb] = useState(true);
    const [versionsAvailable, setVersionsAvailable] = useState(false);
    const [itemWarnings] = useState<Map<string, ItemWarning>>(new Map());
    useEffect(() => {
        if (i.versions.length > 0) {
            setVersionsAvailable(true);
        }
    }, [i])

    itemWarnings.set("placeholder", {
        type: "info",
        message: "This is only a placeholder"
    })
    
    // set meta tags
    useEffect(() => {
        document.title = i.item.name;
        document.querySelector('meta[name="description"]')?.setAttribute("content", i.item.shortDescription);
    }, [i])

    useEffect(() => {
        console.log("is nsfw", i.item.nsfw);
        if (i.item.nsfw) {
            itemWarnings.set("NSFW", {
                type: "warning",
                message: "This item is marked as NSFW"
            });
        }
    }, [i])
    
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
            {i.item.properties?.CSS ? (<link rel="stylesheet" href={`${serverHost}/${i.item.properties.CSS}`} />) : null}
            <div className="center" style={{margin: "0 24px"}}>
                {/* <div style={{width: "100%", margin: "24px 0"}} className="margin">
                    <h1>Someonws Workshop</h1>
                </div> */}
                <TextHeader
                    title={i.item.name}
                    description={i.item.shortDescription}
                />
            </div>
            {
                itemWarnings.size > 0 && <div className="center flex column" style={{
                    marginBottom: "20px"
                }}>
                    {
                        Array.from(itemWarnings).map(([key, value], i) => {
                            return <InfoCard key={i} status={value.type}>
                                <p>{value.message}</p>
                            </InfoCard>
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
                        link: `${urlprefix}/${i.id}/overview`,
                        position: "left"
                    },
                    {
                        title: "Comments",
                        link: `${urlprefix}/${i.id}/comments`,
                        position: "left"
                    },
                    {
                        title: "Changelog",
                        link: `${urlprefix}/${i.id}/changelog`,
                        position: "left"
                    },  
                    {
                        title: "Versions",
                        link: `${urlprefix}/${i.id}/versions`,
                        position: "left"
                    },
                    {
                        title: "Config",
                        link: `${urlprefix}/${i.id}/config`,
                        position: "left"
                    },
                    {
                        title: "Debug",
                        link: `${urlprefix}/${i.id}/debug`,
                        position: "left"
                    }
                ]}
            />
            </div>
            <div className="center mainbkg flex align-start" id="workshop-item">
                { outlet ? <Outlet context={{
                    item: i.item,
                    versions: i.versions,
                    versionsAvailable: versionsAvailable,
                }} /> : <div className="left"></div> }
                <div className="right mobile-v-hide">
                    <WorkshopItemSidebar 
                        version={versionsAvailable ? i.versions[0].version : ""}
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
            <div className="center"> <SimpleError errordata={error} /> </div>
        </main>
    );
  }