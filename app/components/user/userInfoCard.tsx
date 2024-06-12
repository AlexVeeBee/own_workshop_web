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
        const f = await fetch(`${serverHost}/v1/user/verify/${id}`)
        return await f.json()
    }

    const [httpError, setHttpError] = useState<string>("")
    const [userdata, setUserData] = useState<IUser | null>(user || null)
    const [veryfying, setVeryfying] = useState(false)

    if (!user) return (
        <div>
            <h1>No user data</h1>
            <p>There is no user data to display</p>
        </div>
    )

    useEffect(() => {
        setUserData(user)
        setVeryfying(true);
        
        verifyUser(user?.id).then((data) => {
            setVeryfying(false);
            console.log(data)
            // check status
            if (data.status === 404) {
                setHttpError("User not found");
                return
            }
            setUserData(data);
        }).catch((e) => {
            setVeryfying(false);
            setHttpError("Error verifying user");
            console.error(e)
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
            {   
                httpError !== "" ? (
                    <InfoCard
                        status="error"
                    >
                        <p>{httpError}</p>
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
                    pfp: `${userdata.pfp}`,
                    banner: `${serverHost}/${userdata.banner}`,
                    nsfw: userdata?.nsfw || false,
                    admin: userdata?.admin || false,
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