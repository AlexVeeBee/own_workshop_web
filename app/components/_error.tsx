import { Editor } from "@monaco-editor/react";
import "../style/index.css";
import Card from "./UI/card";
import { monaco } from "react-monaco-editor";

function getErrorCode(status: string | number) {
    if (typeof status === "number") {
        status = status.toString();
    }
    
    switch (status) {
        case "404": return "Page not found"
        case "500": return "Internal server error"
        default:
            return "Unknown error: Check the error below."
    }
}

const custom_monaco_theme: monaco.editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    colors: {
        'editor.foreground': '#F8F8F2',
        'editor.background': '#282A36',
        'editor.selectionBackground': '#44475A',
        'editor.lineHighlightBackground': '#44475A',
        'editorCursor.foreground': '#F8F8F0',
        'editorWhitespace.foreground': '#3B3A32',
    },
    rules: [
        { token: 'comment', foreground: 'ffa500', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff0000' },
        { token: 'string', foreground: 'ff0000' },
    ]
}

export default function Error({
    errordata
}: {
    errordata: any
}) {
    const errmsg = getErrorCode(errordata.status);

    return (
        <>
            <div style={{padding: "20px 0"}} className="fillwidth">
                <Card style={{display:"flex", flexDirection: "column"}}>
                    <div>
                        <h1>{errordata.status}</h1>
                        <p>{errmsg}</p>
                    </div>
                    {/* <p>{errordata.message}</p> */}
                    {
                        errordata.message && <p>{errordata.message}</p>
                    }
                    {/* {errordata.stack && <pre>{errordata.stack}</pre>} */}
                    {
                        errordata.stack && <Editor
                        language="log"
                        value={errordata.stack}
                        options={{
                            wordWrap: "on",
                            minimap: {
                                enabled: false
                            },
                            readOnly: true
                        }}
                        height={"300px"}
                        theme="custom"
                        className="formatted-textarea"
                        beforeMount={(monaco) => {
                            monaco.editor.defineTheme("custom", custom_monaco_theme);
                        }}
                    />
                    }
                </Card>
                <div className="flex wrap" style={{marginTop: "12px"}}>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">Reload</button>
                    {/* Create issue */}
                    <a href="" className="btn btn-secondary">Create issue</a>
                </div>
            </div>
        </>
    );
}