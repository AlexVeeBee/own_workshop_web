import type { MetaFunction } from "@remix-run/node";
import "../style/index.css";
import { Outlet } from "@remix-run/react";
import WorkshopItem from "~/components/workshop.item";
import { WorkshopHeader } from "~/components/WorkshopHeader";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <main>
        <div className="center flex column">
          <Outlet />
          {/* <WorkshopHeader title="Workshop" description="This is a workshop" /> */}
          <div className="flex">
            <WorkshopItem
              id="aa"
              title="Asset 1"
              description="This is a description"
            />
            <WorkshopItem
              id="bb"
              title="Asset 2"
              description="This is a description"
            />
            <WorkshopItem
              id="cc"
              title="Asset 3"
              description="This is a description"
            />
          </div>
        </div>
      </main>

      {/* <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul> */}
    </>
  );
}
