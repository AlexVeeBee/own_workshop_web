import Markdoc from "@markdoc/markdoc"
import { useEffect, useState } from "react"
import "./Markdown.css"

interface MarkdownProps {
    markdown: string,
    style?: React.CSSProperties
}

export default function Markdown({
    markdown,
    style
}: MarkdownProps) {
    const [mddrc, setMddrc] = useState(markdown)

    const parsed = Markdoc.parse(markdown)
    const content = Markdoc.transform(parsed)
    const render = Markdoc.renderers.html(content)

    useEffect(() => {
        setMddrc(markdown)
    }, [mddrc, markdown])

    return (
        <div className="markdown-container"
            style={style}
        >
            <div dangerouslySetInnerHTML={{__html: render}}></div>
        </div>
    )
}

