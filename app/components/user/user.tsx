import { IUser } from "~/utils/types"
import { useUser } from "../contexts/user/userProvider"
import { useEffect, useState } from "react"
import LoadingCircle from "../LoadingCircle"
import UserPFPIcon from "./user.pfpicon"
import { useModal } from "../contexts/modal/modalProvider"
import { UserInfoCard } from "./userInfoCard"
import "./user.css"
import InfoCard from "../UI/infoCard"
import Icon from "../icons"
import { serverHost } from "~/utils/vars"
import UserHeader from "./UserHeader"

interface ComponentUser {
    id?: string;
    showUsername?: boolean;
    onClick?: () => void;
    data: IUser;
    showUserModal?: boolean; 
    style?: React.CSSProperties;
}

export default function User({
    id,
    showUsername = true,
    onClick,
    data,
    showUserModal = false,
    style,
}: ComponentUser) {
    const userContext = useUser()
    const modal = useModal()
    const [user, setUser] = useState<IUser | null>(null)
    const [verified, setVerified] = useState(true)

    const verifyUser = async (id: string | number) => {
        const f = await fetch(`${serverHost}/v1/user/verify/${id}`)
        return await f.json()
    }

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

    useEffect(() => {
        verifyUser(data?.id).then((data) => {
            console.log("verified user", data.status)
            // check status
            if (data.status === 404) {
                setVerified(false);
                return
            }
            setVerified(true);
            setUser(data);
        });
    }, [data])

    const openUserModal = () => {
        modal.openModal({
            id: "user-modal",
            title: `${user?.username || "..."}`,
            content: () => verified ? (
                <>
                    {
                        !user?.nsfw ? (
                            <UserInfoCard user={user} />
                        ) : (
                            <div className="flex column" >
                                <UserHeader user={{
                                    ...user,
                                }} />
                                <InfoCard
                                    status="error"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "var(--global-page-gap-2)",
                                    }}
                                >
                                    <h1>Sensitive content</h1>
                                    <p>This user has been marked as NSFW, some content may not be suitable for all audiences</p>
                                </InfoCard>
                            </div>
                        )
                    }
                    <div className="flex justify-center" style={{marginTop: "20px"}}>
                        <a 
                            className="btn" 
                            href={`/user/${user?.id}`}
                        >View workshop</a>
                    </div>
                </>
            ) : (
                <div className="flex align-center column" style={{gap: "10px", width: "100%", height: "100%", padding: "20px 0"}}>
                    <h1>User not found</h1>
                    <p>The user you are looking for does not exist</p>
                </div>
            ),
            style: {
                width: "100%",
                height: "100%",
                maxWidth: "var(--page-width)",
            }
        })
    }

    return (
        <div className="UI-user flex align-center" style={{gap: "10px", ...style}}
            tabIndex={0}
            onClick={() => {
                if (onClick) onClick()
                if (showUserModal) {
                    openUserModal()
                }
            }}
        >
            {
                !user ? <LoadingCircle /> : null
            }
            {/* <h1>{id}</h1> */}
            {
                user?.pfp && <UserPFPIcon src={`${serverHost}/${user?.pfp}`} alt="User avatar" />
            }
            {
                showUsername && <> { user?.admin && <Icon title="ADMIN" name="security"/>} { user?.nsfw && <Icon title="NSFW" name="alert"/>} <p>{user?.username || "..."}</p></>
            }
        </div>
    )
}