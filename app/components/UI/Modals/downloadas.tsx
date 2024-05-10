interface DownloadAsModalProps {
    onClose: () => void;
    itemid: string | number;
}

export default function DownloadAsModal({
    onClose,
    itemid
}: DownloadAsModalProps) {
    return (<div style={{padding: "20px"}}>
        <h2>Download as</h2>
        <div className="flex column" style={{ gap: "5px" }}>
            <a className="btn btn-success" href={`http://localhost:8080/api/workshop/download/${itemid}/zip`} target="_blank" rel="noreferrer">Zip</a>
        </div>
        <h2 style={{marginTop: "20px"}}>Share</h2>
        <div className="flex column" style={{ gap: "5px" }}>
            <a className="btn" href={`http://localhost:8080/workshop/${itemid}`} target="_blank" rel="noreferrer">Link</a>
        </div>
        <style>{`
            .close {
                color: #aaaaaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
            }
            .close:hover,
            .close:focus {
                color: #000;
                text-decoration: none;
                cursor: pointer;
            }
        `}</style>
    </div>)
}