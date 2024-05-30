import { IUser } from "~/utils/types"
import UserHeader from "./UserHeader"
import { WorkshopHeader } from "../workshop_page/WorkshopHeader"
import { useEffect, useState } from "react"
import InfoCard from "../UI/infoCard"
import Button, { Buttons } from "../UI/buttons"
import { serverHost } from "~/utils/vars"

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
    const verifyUser = async (id: string | number) => {
        const f = await fetch(`${serverHost}/api/user/verify/${id}`)
        return await f.json()
    }

    const [existsUser, setExistsUser] = useState(false)
    const [userdata, setUserData] = useState<IUser | null>(user || null)
    const [veryfying, setVeryfying] = useState(true)

    if (!user) return (
        <div>
            <h1>No user data</h1>
            <p>There is no user data to display</p>
        </div>
    )

    useEffect(() => {
        setUserData(user)
        
        verifyUser(user?.id).then((data) => {
            setVeryfying(false);
            // check status
            if (data.status === 404) {
                setExistsUser(false);
                return
            }
            setExistsUser(true);
            setUserData(data);
        });
    }, [])

    if (!userdata) return (
        <InfoCard
                status="info"
            >
            <p>Waiting for user data...</p>
        </InfoCard>
    )

    return (
        <div className={`user-info-card ${className || ""}`} style={style}>
            {
                veryfying ? ( 
                    <InfoCard
                        status="info"
                    >
                        <p>Veryfying user...</p>
                    </InfoCard>
                ) : null
            }
            <WorkshopHeader
                textAlignment="right"
                title={`${userdata?.username}'s profile`}
                description=""
                image={userdata?.banner ? `${serverHost}/${user.banner}` : ""}
            />
            <UserHeader
                user={{
                    id: userdata?.id,
                    username: userdata?.username,
                    pfp: `${serverHost}/${userdata.pfp}`,
                    banner: `${serverHost}/${userdata.banner}`,
                    nsfw: userdata?.nsfw || false,
                }}
                suffix={(
                    <div className="flex align-center"
                        style={{
                            marginRight: "20px"
                        }}
                    >
                        <Button
                            onClick={() => {
                                console.log("Followed user")
                            }}
                            btnType={"PRIMARY"}
                        >
                            Follow
                        </Button>
                    </div>
                )}
            />
        </div>
    )
}