import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import "../style/index.css";
import { useLoaderData } from "@remix-run/react";
import WorkshopItem from "~/components/workshop_page/workshop.item";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { IWorkshopItem, WorkshopInfo } from "~/utils/types";
import WorkshopItemSidebar from "~/components/workshop_page/item.sidebar";
import SidebarFilters from "~/components/homepage/sidebar.filters";
import Card from "~/components/card";
import InfoCard from "~/components/UI/infoCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Own Workshop" },
    { name: "description", content: "Self-hosted workshop" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const i = await fetch(`http://localhost:8080/api/info/get`);
  if (!i.ok) {
      throw new Error("Unable to fetch workshop info");
  }
  const w = await fetch(`http://localhost:8080/api/workshop`);
  if (!w.ok) {
      throw new Error("No items found");
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
            image={`http://localhost:8080/${info.headerimage}`}
          />
        </div>
        <div className="center flex column mainbkg" style={{padding: "20px"}}>
          <div className="flex" style={{ width: "100%", gap: "20px" }}>
            <Card
              style={{padding: "0"}}
              cardStyle={{padding: "0", width: "100%"}}
            >
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
                      description={item.description}
                      tags={item.tags}
                      image={`http://localhost:8080/${item.thumb}`}
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
