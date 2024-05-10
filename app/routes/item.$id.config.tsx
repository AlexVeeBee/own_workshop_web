import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/card";
import { IWorkshopItem } from "~/utils/types";

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
  
export default function ItemConfig() {
    const i = useOutletContext<IWorkshopItem>();

    const [disabled, setDisabled] = useState(false);

    // check if the workshop item has the "disable-config" flag in the limits
    useEffect(() => {
        const disableConfig = i.limits && i.limits.includes("disable-config");
        if (disableConfig) {
            setDisabled(true);
        }
    }, [i])

    return !disabled ? (
        <>
            <div className="left flex column">
                <h1>Configuration</h1>
                <InfoCard status="info">
                    <b>This page is empty until a DB is implemented</b>
                </InfoCard>
                <div className="config-pages">
                    <TabBar
                        onTabChange={() => {}}
                        activeIndex={0}
                        tabs={[
                            {
                                title: "Details",
                                link: `/item/${i.id}/config/details`,
                                position: "left"
                            }
                        ]}
                    />
                    <Outlet />
                </div>
            </div>
        </>
    ) : (
        <div className="left flex column">
            <h1>Configuration</h1>
            <InfoCard status="warning">
                <b>This item cannot be configured</b>
            </InfoCard>
        </div>
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