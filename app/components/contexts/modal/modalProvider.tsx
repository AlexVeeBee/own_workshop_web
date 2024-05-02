import { useContext, useEffect, useState } from "react";
import { ModalContext, ModalAPI, OpenModalProps } from "./modalContext"
import Modal from "./modal";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modals, setModals] = useState<OpenModalProps[]>([]);

    useEffect(() => {
        if (modals.length > 0) {
            const timers = modals.map((modal) => {
                modal.open = true;
            //     return setTimeout(() => {
            //         setModals((prev) => {
            //             return prev.filter((m) => m.id !== modal.id);
            //         });
            //     }, 1000);
            });
            // setModalRemovalTimers(timers);
        }
    }, [modals]);

    const openModal = (props: OpenModalProps) => {
        setModals((prev) => {
            const index = prev.findIndex((modal) => modal.id === props.id);
            if (index !== -1) {
                prev[index].open = true;
                prev[index] = props;
                return prev;
            }
            return prev.concat(props);
        });
    }

    const closeModal = (id: string) => {
        // setModals((prev) => {
        //     return prev.filter((modal) => modal.id !== id);
        // });
        const index = modals.findIndex((modal) => modal.id === id);
        if (index === -1) return;
        const modal = modals[index];
        modal.open = false;
        setModals((prev) => {
            return prev.slice(0, index).concat(modal).concat(prev.slice(index + 1));
        })
        setTimeout(() => {
            setModals((prev) => {
                return prev.filter((m) => m.id !== id);
            });
        }, 300);
    }

    const value: ModalAPI = {
        openModal,
        closeModal
    }

    return <ModalContext.Provider value={value}>
        <div className={`modal-container ${modals.length > 0 ? "open" : ""}`}>
            {modals.map((modal) => {
                return <Modal 
                    modalId={modal.id}
                    key={modal.id} 
                    title={modal.title} 
                    showCloseButton={!modal.hideCloseButton}
                    style={modal.style}
                    contentStyle={modal.contentStyle}
                    show={modal.open ?? true}
                >
                    {modal.content}
                </Modal>
            })}
        </div>
        {children}
    </ModalContext.Provider>
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}