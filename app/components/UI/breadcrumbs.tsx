import {
    useMatches,
} from "@remix-run/react"

import "./breadcrumbs.css"

export default function Breadcrumbs() {
    const matches = useMatches();

    return (
        <div className="breadcrumbs">
            <div className="center">
                {matches
                    // @ts-expect-error
                    .filter((match) => match.handle && match.handle.breadcrumb)
                    .map((match, index) => {
                        const { handle } = match;
                        return (
                            <span key={index} className="breadcrumb"
                            style={{zIndex : 100 - index}}>
                                <span>
                                    {/* @ts-expect-error */}
                                    {match.handle.breadcrumb(match) || handle.id}
                                </span>
                            </span>
                        );
                    })
                }
            </div>
        </div>
    );
}