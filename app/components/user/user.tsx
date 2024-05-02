import { IUser } from "~/utils/types"
import { useUser } from "../contexts/user/userProvider"
import { useEffect, useState } from "react"
import LoadingCircle from "../LoadingCircle"
import UserPFPIcon from "./user.pfpicon"
import { useModal } from "../contexts/modal/modalProvider"
import { UserInfoCard } from "./userInfoCard"

interface ComponentUser {
    id?: string;
    showUsername?: boolean;
    onClick?: () => void;
    data: IUser;
    showUserModal?: boolean; 
}

export default function User({
    id,
    showUsername = true,
    onClick,
    data,
    showUserModal = false,
}: ComponentUser) {
    const userContext = useUser()
    const modal = useModal()
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        if (data) {
            setUser(data)
            return
        };
        if (!id) return
        userContext.getUser(id).then((u) => {
            setTimeout(() => {
                console.log("fetched user", u)
                setUser(u)
            }, 1000);
        })
    }, [])

    return (
        <div className="flex align-center" style={{gap: "10px"}}
            onClick={() => {
                if (onClick) onClick()
                if (showUserModal) {
                    // open user modal
                    modal.openModal({
                        id: "user-modal",
                        title: `${user?.username || "..."}`,
                        content: (
                            <UserInfoCard user={user} />
                        ),
                        style: {
                            width: "100%",
                            height: "100%",
                            maxWidth: "var(--page-width)",
                        }
                    })
                }
            }}
        >
            {
                !user ? <LoadingCircle /> : null
            }
            {/* <h1>{id}</h1> */}
            {
                user?.pfp && <UserPFPIcon src={`http://localhost:8080/${user?.pfp}`} alt="User avatar" />
            }
            {
                showUsername && <p>{user?.username || "..."}</p>
            }
        </div>
    )
}