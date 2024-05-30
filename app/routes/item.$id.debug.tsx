import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import { IWorkshopItem } from "~/utils/types";

import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";
import { useAppSelector } from "~/utils/hooks";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};
  
export default function ItemConfig() {
    const i = useOutletContext<IWorkshopItem>();
    const store = useAppSelector(state => state.user);
    return (
        <>
            <div className="left flex column">
                <h1>Debug</h1>
                <InfoCard status="info">
                    <b>Output from the backend</b><br></br>
                    <a href="/api/swagger">More API docs</a>
                </InfoCard>
                <pre>
                    {
                        !store.id 
                        ?JSON.stringify([
                            "You are not logged in",
                            "This page is only available for logged in users"
                        ], null, 2)
                        :JSON.stringify(i, null, 2)
                    }
                </pre>
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