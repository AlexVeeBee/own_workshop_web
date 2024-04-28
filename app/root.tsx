import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import Error from "./components/_error";
import { AppHeader } from "./components/header";
import { UserProvider } from "./components/contexts/user/userProvider";
import { SidebarProvider } from "./components/contexts/sidebar/sidebarProvider";
import { LoaderFunctionArgs } from "@remix-run/node";
import { IUser } from "./utils/types";
import Footer from "./components/footer";

export async function loader({ request }: LoaderFunctionArgs) {
  const f = await fetch(`http://localhost:8080/api/user/get/1`);
  if (!f.ok) {
    return { status: 404 };
  }
  return f.json();
}

export function Layout({ children }: { children: React.ReactNode }) {
  const i = useLoaderData<IUser>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UserProvider>
          <SidebarProvider>
            <AppHeader
              user={i}
            />
            {children}
            <Footer />
          </SidebarProvider>
        </UserProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <>
      <main>
        <div className="center flex column">
          <div style={{ textAlign: "center", padding: "20px", paddingBottom: "0" }}>
            <p>The entire website broke. Oops.</p>
          </div>
          <Error errordata={error} />
        </div>
    </main>
    </>
  );
}