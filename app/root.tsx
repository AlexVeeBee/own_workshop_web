import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import Error from "./components/_error";
import { AppHeader } from "./components/header";
import { UserProvider } from "./components/contexts/user/userProvider";

export function Layout({ children }: { children: React.ReactNode }) {
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
          <AppHeader />
          {children}
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