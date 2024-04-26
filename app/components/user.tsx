import { useUser } from "./contexts/user/userProvider"

export default function User({
    id,
    showUsername
}: {
    id: string,
    showUsername: boolean | undefined
}) {
    const userContext = useUser()
    const user = userContext.getUser(id)

    return (
        <div className="flex align-center" style={{gap: "10px"}}>
            <h1>{id}</h1>
            {/* <p>{user.id}</p> */}
            {
                showUsername && <p>{user?.username}</p>
            }
        </div>
    )
}