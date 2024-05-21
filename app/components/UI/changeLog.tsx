import Markdoc from "@markdoc/markdoc"
import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"
    
const markdownsrc = `
### This item has no change log details
`

interface ChangeLogItemProps {
    version: string
    markdown: string
}

export default function ChangeLogItem({
    version,
    markdown
}: ChangeLogItemProps) {
    const [mddrc, setMddrc] = useState(markdownsrc)

    const parsed = Markdoc.parse(markdown)
    const content = Markdoc.transform(parsed)
    const render = Markdoc.renderers.html(content)

    useEffect(() => {
        setMddrc(markdown)
    }, [mddrc, markdown])

    return (
        <div className="change-log flex column" style={{gap: "10px"}}>
            <div className="divider"></div>
            <div>
                <div className="flex justify-between align-center">
                    <h1>{version}</h1>
                    <Link to={`../versions/${version}`}>See Version</Link>
                </div>
                <div dangerouslySetInnerHTML={{__html: render}}></div>
            </div>
        </div>
    )
}

export function ChangeLogFull() {
    return (
        <div className="change-log">
            <h2>Version 1.0.0</h2>
            <ul>
                <li>Initial release</li>
            </ul>
        </div>
    )
}