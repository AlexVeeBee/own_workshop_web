import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import { IWorkshopItem } from "~/utils/types";

import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};
  
export default function ItemConfig() {
    return (
        <>
            <div className="left flex column">
                <p>Item details config</p>
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