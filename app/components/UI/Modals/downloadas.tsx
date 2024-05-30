import LoadingCircle from "~/components/LoadingCircle";
import { useModal } from "~/components/contexts/modal/modalProvider";
import Icon from "~/components/icons";
import { serverHost } from "~/utils/vars";

interface DownloadAsModalProps {
    downloadAvailable: boolean;
    itemid: string | number;
    version?: "latest" | string;
}

export default function DownloadAsModal({
    downloadAvailable,
    itemid,
    version
}: DownloadAsModalProps) {
    const modal = useModal();

    const openShareMenu = () => {
        if (!navigator.share) {
            alert("Your browser does not support this feature");
            return;
        }

        modal.closeModal("downloadas");

        navigator.share({
            title: "Share",
            text: "Check out this item",
            url: window.location.href
        })
    }

    return (<div style={{padding: "20px"}}>
        {
            downloadAvailable ?
            <>
                <h2>Download {!version ? "latest" : version} version</h2>
                <div className="flex column" style={{ gap: "5px" }}>
                    <a className="flex align-center btn btn-success" href={`${serverHost}/api/workshop/download/${itemid}/zip${version ? `/${version}` : ""}`} target="_blank" rel="noreferrer">
                        <Icon name="download" />
                        Download
                    </a>
                </div>
            </>
            : <h2>No download available</h2>
        }
        <h2 style={{marginTop: "20px"}}>Share</h2>
        <div className="share-container flex">
            <button className="btn btn-success" onClick={openShareMenu}>Share</button>
            <div className="flex column fillwidth" style={{ gap: "5px" }}>
                <input readOnly type="text" value={window.location.href} />
            </div>
        </div>
    </div>)
}