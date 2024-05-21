import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/card";
import { AssetVersion, IWorkshopItem } from "~/utils/types";

import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import ImageGallery from "~/components/imageGallery";
import InfoCard from "~/components/UI/infoCard";
import ChangeLogItem from "~/components/UI/changeLog";

export const meta: MetaFunction = () => {
    return [
      { title: "Item" },
      { name: "description", content: "" },
    ];
};
  
export default function ItemChangeLog() {
    const i = useOutletContext<{
        versions: AssetVersion[],
    }>();
    return (
        <>
            <div className="left flex column">
                <h1>Change Log</h1>
                <InfoCard status="info">
                    <b>This page has placeholders until a DB is implemented</b>
                </InfoCard>
                {
                    i.versions.map((v, i) => (
                        <ChangeLogItem 
                            key={i}
                            version={v.version}
                            markdown={`No change log available for this version`}
                        />
                    ))
                }
                {
                    i.versions.length === 0 && <InfoCard status="info">
                        <b>No matching versions found</b><br></br>
                        <Link to="../versions">
                            Check the versions page
                        </Link>
                    </InfoCard>
                }
                {/* <ChangeLogItem 
                    version="1.0.0"
                    markdown={`
# New version 🎉
- Added a new feature
- Fixed a bug

## Some other changes
- Added a new feature
- Fixed a bug
                    `}
                /> */}
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