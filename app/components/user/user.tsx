import { IUser } from "~/utils/types"
import { useUser } from "../contexts/user/userProvider"
import { useEffect, useState } from "react"
import LoadingCircle from "../LoadingCircle"
import UserPFPIcon from "./user.pfpicon"

export default function User({
    id,
    onClick,
    showUsername = true,
    data,
}: {
    id?: string,
    onClick?: () => void,
    showUsername?: boolean
    data?: IUser
}) {
    const userContext = useUser()
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        if (data) {
            setUser(data)
            return
        };
        console.log("fetching user")
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
            onClick={onClick}
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