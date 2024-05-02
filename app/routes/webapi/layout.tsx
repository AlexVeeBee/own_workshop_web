import { Link } from "@remix-run/react";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="layout">
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/webapi">Web API</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    );
}