import "./formattedTextArea.css"
import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Buttons } from "./buttons";
import { monaco } from "react-monaco-editor";

interface FormattedTextAreaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

// const Editor = () => {
// 	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
// 	const monacoEl = useRef(null);

// 	useEffect(() => {
// 		if (monacoEl) {
// 			setEditor((editor) => {
// 				if (editor) return editor;

// 				return monaco.editor.create(monacoEl.current!, {
// 					value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
// 					language: 'typescript'
// 				});
// 			});
// 		}

// 		return () => editor?.dispose();
// 	}, [monacoEl.current]);

// 	return <div className={""} ref={monacoEl}></div>;
// }

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

export default function FormattedTextArea({
    value, onChange, placeholder, style,
}: FormattedTextAreaProps) {
    const inputref = useRef<HTMLTextAreaElement>(null);
    const [useMonaco, setUseMonaco] = useState(false);
    const [text, setText] = useState(value);
    useEffect(() => {
        setText(value);
    }, [value]);

    useEffect(() => {
        if (!useMonaco) return;
        if (!inputref.current) return;
    }, [inputref, useMonaco]);

    return (
        <div 
        className="formatted-textarea-container"
        style={style}
        >
            <div className="formater">
                <select>
                    <option value="bold">Bold</option>
                    <option value="italic">Italic</option>
                    <option value="underline">Underline</option>
                    <option value="strike">Strike</option>
                </select>
                <Buttons.LiminalButton
                    onClick={() => {
                        setUseMonaco(!useMonaco);
                    }}
                >
                    {useMonaco ? "Use Textarea" : "Use Monaco"}
                </Buttons.LiminalButton>
            </div>
            {
                useMonaco ? (
                    <Editor
                        language="text"
                        value={text}
                        onChange={(value) => {
                            if (!value) {
                                setText("");
                                return;
                            };
                            setText(value);
                            onChange(value);
                        }}
                        options={{
                            wordWrap: "on",
                            minimap: {
                                enabled: false
                            },
                        }}
                        theme="custom"
                        beforeMount={(monaco) => {
                            monaco.editor.defineTheme("custom", custom_monaco_theme);
                        }}
                        className="formatted-textarea"
                    />
                ) : (
                    <textarea
                        ref={inputref}
                        className="formatted-textarea monaco-editor"
                        style={style}
                        value={text}
                        placeholder={placeholder}
                        onChange={(e) => {
                            setText(e.target.value);
                            onChange(e.target.value);
                        }}
                    />
                    
                )
            }
            
            {/* <MonacoEditor
                language="markdown"
                value={text}
                options={{
                    wordWrap: "on",
                }}
                onChange={(value) => {
                    setText(value);
                    onChange(value);
                }}
                editorDidMount={(editor, monaco) => {
                    editor.onDidBlurEditorText(() => {
                        onChange(text);
                    });
                }}
                theme="vs-dark"
                height="100%"
                width="100%"
            /> */}
        </div>
    );
}