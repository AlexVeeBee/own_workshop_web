import { useLoaderData } from "@remix-run/react";
import Card from "~/components/UI/card";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { WorkshopInfo } from "~/utils/types";
import { serverHost } from "~/utils/vars";

export async function loader() {
    const i = await fetch(`${serverHost}/api/info/get`);
    if (!i.ok) {
        throw new Error("Unable to fetch workshop info");
    }
    const final = [ await i.json() ];
    return final;
}

export default function Login() {
    const [i] = useLoaderData<
        [WorkshopInfo]
    >();

    return (
        <main>
            <div className="center flex column">
                <WorkshopHeader
                    textAlignment="right"
                    title={i.title}
                    description={i.description}
                    image={`${serverHost}/${i.headerimage}`}
                />
            </div>
            <div className="center flex column mainbkg">
                <h1>Login</h1>
                <Card cardStyle={{width: "fit-content"}}>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" />
                        </div>
                        <button className="btn" type="submit">Login</button>
                    </form>
                </Card>
            </div>
        </main>
    )
}