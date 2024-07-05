import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/UI/card";
import { AssetVersion, IWorkshopItem, IWorkshopItemMedia } from "~/utils/types";

import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";
import { useModal } from "~/components/contexts/modal/modalProvider";
import DownloadAsModal from "~/components/UI/Modals/downloadas";
import Button, { Buttons } from "~/components/UI/buttons";
import { useAppSelector } from "~/utils/hooks";
import { useUser } from "~/components/contexts/user/userProvider";
import { serverHost } from "~/utils/vars";
import Markdown from "~/components/UI/Markdown";

export const handle = {
    breadcrumb: () => {
        return "Overview";
    }
};

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};
  

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//     const f = await fetch(`${serverHost}/api/workshop/get/${params.id}`);
//     if (!f.ok) {
//         throw new Error("Item not found");
//     }
//     return f.json();
// }

type IImageLoadingStatus = "loading" | "loaded" | "error";
export default function Item() {
    const store = useAppSelector(state => state.user);
    const sidebar = useSidebar()
    const modal = useModal();
    const user = useUser();
    const i = useOutletContext<{
        item: IWorkshopItem,
        versions: AssetVersion[],
        versionsAvailable: boolean,
    }>();
    const [NSFW_warning, setNSFW_warning] = useState(i.item.nsfw);

    const showAnyway = () => {
        if (store.id) {
            user.verifyLogin().then((data) => {
                if (!data) { return; }
                setNSFW_warning(false);
            });
            return;
        }
        LoginToViewModal();
    }

    const LoginToViewModal = () => {
        modal.openModal({
            id: "login-to-view",
            title: "Login to view",
            contentStyle: {
                padding: "20px",
                width: "100%"
            },
            content: () => <Card
                cardStyle={{padding: "20px", width: "100%"}}
                style={{flexDirection: "column", gap: "10px"}}
            >
                <h1>You need to login to show NSFW content</h1>
                <h3>Unless you know how to bypass this</h3>
                <p>Would you like to login?</p>
            </Card>,
            style: {
                maxWidth: "800px"
            }
        })
    }

    const buttonDownloadAs = () => {
        modal.openModal({
            id: "downloadas",
            title: "Download or share",
            style: {
                width: "600px"
            },
            content: () => <DownloadAsModal
                downloadAvailable={i.versionsAvailable}
                version="latest"
                itemid={i.item.id}
            />,
        })
    }

    return (
            // <div className="center mainbkg flex align-start" id="workshop-item">
        <>
            <div className="left flex column">
                <div className="imageview">
                    {
                        NSFW_warning && <InfoCard 
                            status="warning"
                        >
                            <div className="flex justify-between">
                                <div className="flex align-center">
                                    <Icon name="alert"/>
                                    <p>This item contains NSFW content</p>
                                </div>
                                <Buttons.LiminalButton
                                    style={{
                                        padding: "5px 10px",
                                        borderRadius: "64px",
                                    }}
                                    onClick={() => {
                                        showAnyway();
                                    }}
                                >Show anyway</Buttons.LiminalButton>
                            </div>
                        </InfoCard>
                    }
                    <ImageGallery
                        blurImage={NSFW_warning}
                        images={
                            i.item.media && i.item.media.length > 0 ? i.item.media.map(image => {
                                return {
                                    src: `${serverHost}/${image.src}`,
                                    smallsrc: image?.smallSrc && `${serverHost}/${image.smallSrc}`,
                                    type: image.type,
                                    alt: "Workshop image",
                                }
                            }
                            ) : [
                                {
                                    src: `${serverHost}/${i.item.thumb}`,
                                    type: "image",
                                    alt: "Workshop Thumbnail",
                                    shortDescription: "Item Thumbnail image",
                                }
                            ]
                        }
                    />
                </div>
                <Card style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <div>
                        <h1>{i.item.name}</h1>
                        <p style={{opacity:"0.5"}}>This asset may contain copyrighted assets</p>
                    </div>
                    <div className="flex" style={{gap: "10px"}}>
                        <Button btnType="SUCCESS" className="flex align-center" style={{gap: "10px"}} onClick={buttonDownloadAs}>
                            <Icon name="download" />
                        </Button>
                        <Button className="flex align-center" style={{gap: "10px"}}
                            onClick={() => sidebar.openSidebar("right", <WorkshopItemSidebar 
                                version={i.versionsAvailable ? i.versions[0].version : ""}
                                thumb=  {i.item.thumb} 
                                tags=   {i.item.tags} 
                                authors={i.item.authors} 
                                owner=  {i.item.owner}
                            />, {
                                id: "workshop-item-extrainfo",
                                width: "300px",
                            })}
                        >
                            <Icon name="information" />
                        </Button>
                    </div>
                </Card>
                <Card>
                    <Markdown
                        markdown={Array.isArray(i.item.description) ? i.item.description.join("\n") : i.item.description}
                    />
                </Card>
                <Card>
                    <div>
                        <h3>Contained Files</h3>
                    </div>
                </Card>
            </div>
        </>
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