import Icon from "~/components/icons";
import "./modal.css"
import { useModal } from "./modalProvider";

interface ButtonProps {
    text: string;
    onClick: () => void;
    side?: "left" | "right";
}
interface ButtonsTableProps {
    text: string,
    onClick: () => void,
}
interface ModalProps {
    modalId: string,
    show: boolean;
    title?: string,
    buttons?: ButtonsTableProps[] | undefined | null,
    showCloseButton?: boolean,
    className?: string,
    children: any,
    style?: React.CSSProperties,
    contentStyle?: React.CSSProperties;
}

export const Modal = ({
    modalId,
    show = false,
    title,
    buttons,
    showCloseButton,
    className = "",
    children,
    style = {},
    contentStyle = {}
}: ModalProps) => {
    const modal = useModal();
    return (
        <div className={`modal-wrapper ${show ? "open" : ""}`}>
        <div className={"modal modal-style " + className} style={{...style}}>
            {
                title && (
                    <div className="modal-header">
                        <div className="modal-title">{title}</div>
                        {
                            showCloseButton && (
                                <div className="overlay modal-close" onClick={() => {
                                    modal.closeModal(modalId);
                                }}>
                                    <Icon name="close" />
                                </div>
                            )
                        }
                    </div>
                )
            }
            {
                !title && showCloseButton && (
                    <div className="overlay modal-close" onClick={() => {modal.closeModal(modalId);}}>
                        <Icon name="close" />
                    </div>
                )
            }
            <div className="modal-body" style={{...contentStyle}}>
                {/* check if children are empty */}
                {
                    children || <div style={{padding: "12px"}} className="flex gap-10 column">
                        <h2>Empty Modal</h2>
                        <button 
                            onClick={() => {
                            }}
                        >Close</button>
                    </div>
                }
            </div>
            {
                buttons && (
                    <div className="modal-footer">
                        <div className="modal-buttons left">
                            {
                                buttons.map((button: ButtonProps, index) => {
                                    if (button.side === "left") {
                                        return (
                                            <button
                                                key={index}
                                                onClick={button.onClick}
                                            >
                                                {button.text}
                                            </button>
                                        )
                                    }
                                    return null;
                                })
                            }
                        </div>
                        <div className="modal-buttons right">
                            {
                                buttons.map((button, index) => (
                                    <button key={index} onClick={button.onClick}>{button.text}</button>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
        </div>
    );
}
    
export default Modal;