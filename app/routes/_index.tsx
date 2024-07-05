import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import "../style/index.css";
import { Link, useLoaderData } from "@remix-run/react";
import WorkshopItem from "~/components/workshop_page/workshop.item";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { IWorkshopItem, WorkshopInfo } from "~/utils/types";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import SidebarFilters from "~/components/homepage/sidebar.filters";
import Card from "~/components/UI/card";
import InfoCard from "~/components/UI/infoCard";
import { serverHost } from "~/utils/vars";
import { FetchError } from "~/utils/errors";

export const handle = {
  breadcrumb: () => {
      return "Workshop";
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Own Workshop" },
    { name: "description", content: "Self-hosted workshop" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const i = await fetch(`${serverHost}/v1/info/get`);
  if (!i.ok) {
      throw new FetchError("Unable to fetch workshop info");
  }
  const w = await fetch(`${serverHost}/v1/workshop`);
  if (!w.ok) {
      throw new FetchError("No items found");
  }
  const final = [ await w.json(), await i.json() ];
  return final;
}

export default function Index() {
  const [items, info] = useLoaderData<
    [IWorkshopItem[], WorkshopInfo]
  >();
  return (
    <>
      <main>
        <div className="center">
          <WorkshopHeader 
            textAlignment="right"
            title="Workshop"
            description="This is a workshop"
            image={`${serverHost}/${info.headerimage}`}
          />
        </div>
        <div className="center flex column mainbkg" style={{padding: "20px"}}>
          <div className="flex" style={{ width: "100%", gap: "20px" }}>
            <Card
              style={{flexDirection:"column", padding: "0"}}
              cardStyle={{padding: "0", width: "100%"}}
            >
              <div className="flex">
                <Link to="/users">
                  <InfoCard
                    status="info"
                  >
                    <h1>Users</h1>
                    <p>View all users</p>
                  </InfoCard>
                </Link>
              </div>
              <div 
                className="wrap align-top justify-center"
                style={{padding: "12px", gap:"12px",  display: "grid", width: "100%", justifyContent: "center", 
                gridTemplateColumns: "repeat(auto-fill, minmax(256px, 1fr))", }}
              >
                {
                  items.map((item) => (
                    <WorkshopItem
                      key={item.id}
                      id={item.id}
                      title={item.name}
                      description={item.shortDescription}
                      tags={item.tags}
                      image={`${serverHost}/${item.thumb}`}
                      style={{ maxWidth: "512px", justifyContent: "flex-start" }}
                    />
                  ))
                }
              </div>
            </Card>
            <div className="right mobile-v-hide">
              <SidebarFilters />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
