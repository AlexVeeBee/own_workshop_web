import { IUser } from "~/utils/types"
import { useModal } from "../contexts/modal/modalProvider"
import UserHeader from "./UserHeader"
import { WorkshopHeader } from "../workshop_page/WorkshopHeader"
import User from "./user"

interface userInfoCard {
    user: IUser | null
    className?: string
    style?: React.CSSProperties
}

export const UserInfoCard = ({
    user,
    className,
    style
}: userInfoCard) => {
    if (!user) return (
        <div>
            <h1>No user data</h1>
            <p>There is no user data to display</p>
        </div>
    )

    return (
        <div className={`user-info-card ${className || ""}`} style={style}>
            <WorkshopHeader
                textAlignment="right"
                title={`${user.username}'s profile`}
                description=""
                image={user.banner ? `http://localhost:8080/${user.banner}` : ""}
            />
            <UserHeader
                user={{
                    id: user.id,
                    username: user.username,
                    pfp: `http://localhost:8080/${user.pfp}`
                }} />
        </div>
    )
}