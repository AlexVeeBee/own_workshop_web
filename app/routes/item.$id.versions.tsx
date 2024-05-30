import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import Card from "~/components/UI/card";
import { AssetVersion, IWorkshopItem } from "~/utils/types";

import { useSidebar } from "~/components/contexts/sidebar/sidebarProvider";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import Icon from "~/components/icons";
import InfoCard from "~/components/UI/infoCard";
import Button, { Buttons } from "~/components/UI/buttons";
import { serverHost } from "~/utils/vars";

export const meta: MetaFunction = () => {
    return [
      { title: "item versions" },
      { name: "description", content: "" },
    ];
};

interface IVersionItem {
    id: string | number,
    version: string,
    isLatest: boolean,
}

interface IVersionData {
    version: string,
}

// export async function loader({ params }: LoaderFunctionArgs) {
//     // /api/workshop/get/:id/versions
//     const f = await fetch(`${serverHost}/api/workshop/get/${params.id}/versions`)
//     if (!f.ok) {
//         throw new Error("Item not found");
//     }
//     return await f.json();
// }

const Version = ({ id, version, isLatest }: IVersionItem) => {
    const downloadlink = `${serverHost}/api/workshop/download/${id}/zip/${version}`;
    return (
        <Card className="version-item">
            <div className="flex column fillwidth">
                <div className="flex fillwidth justify-between align-center">
                    <h1>{version}</h1>
                    {isLatest && <div className="flex info align-center">
                        <Icon name="check" />
                        <span style={{marginLeft: "10px"}}>Latest version</span>
                    </div>}    
                </div>
                <div className="flex align-center">
                    {isLatest ? <Button 
                        btnType="SUCCESS"
                        style={{width: "100%"}}
                        onClick={() => {
                            window.open(downloadlink, "_blank")
                        }}
                        className="flex align-center"
                    >
                        <Icon name="download" />
                        <span style={{marginLeft: "10px"}}>Download</span>
                    </Button>
                    : <Buttons.LiminalButton
                        onClick={() => {
                            window.open(downloadlink, "_blank")
                        }}
                        style={{width: "100%"}}
                        className="flex align-center"
                    >
                        <Icon name="download" />
                        <span style={{marginLeft: "10px"}}>Download</span>
                    </Buttons.LiminalButton>}
                </div>
            </div>
        </Card>
    )
}

export default function ItemVersions() {
    // const versions = useLoaderData<string[]>();
    const {item, versions} = useOutletContext<{item: IWorkshopItem, versions: AssetVersion[]}>();
    console.log(versions);
    return (
        <>
            <div className="left flex column">
                <h1>Versions</h1>
                <InfoCard status="info">
                    <b>This page has placeholders until a DB is implemented</b>
                </InfoCard>
                <div className="versions flex column fillwidth"
                    style={{gap: "20px"}}
                >
                    {versions.map((version, index) => {
                        return <Version key={index} id={item.id} version={version.version} isLatest={index === 0} />
                    })}
                    {
                        versions.length === 0 && <InfoCard status="warning">
                            <b>No versions found or available</b>
                        </InfoCard>
                    }
                </div>
                {/* <Version id={i.id} isLatest={true} version="1.0.2" />
                <Version id={i.id} isLatest={false} version="1.0.0" />
                <Version id={i.id} isLatest={false} version="0.9.31" /> */}
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