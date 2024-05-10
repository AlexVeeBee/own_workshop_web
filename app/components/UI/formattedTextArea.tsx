import "./formattedTextArea.css"
import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";

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

export default function FormattedTextArea({
    value, onChange, placeholder, style,
}: FormattedTextAreaProps) {
    const inputref = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState(value);
    useEffect(() => {
        setText(value);
    }, [value]);

    return (
        <div className="formatted-textarea-container">
            <div className="formater">
                <select>
                    <option value="bold">Bold</option>
                    <option value="italic">Italic</option>
                    <option value="underline">Underline</option>
                    <option value="strike">Strike</option>
                </select>
            </div>
            {/* <Editor /> */}
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