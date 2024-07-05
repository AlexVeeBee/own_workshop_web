import { Buttons } from "~/components/UI/buttons";
import Card from "~/components/UI/card";
import TextHeader from "~/components/UI/textHeader";
import UserPFPIcon from "~/components/user/user.pfpicon";
import { WorkshopHeader } from "~/components/workshop_page/WorkshopHeader";
import { useAppSelector } from "~/utils/hooks";
import { serverHost } from "~/utils/vars";

export const handle = {
    breadcrumb: () => {
        return "Overview";
    }
};

export default function AccountOverview() {
    const userstore = useAppSelector(state => state.user)

    return (
        <>
        <TextHeader
            title="Account Overview"
            description="View your account information"
        />
        <div className="account-overview flex column" style={{ gap: "var(--global-page-gap)" }}>
            <Card className="user-pfp" style={{alignItems:"center", flexDirection:"row", gap: "var(--global-page-gap)"}}>
                <div className="pfp-container">
                    <UserPFPIcon 
                        size={64} 
                        alt="pfp" 
                        src={`${serverHost}/${userstore.pfp}`}
                    />
                </div>
                <div className="user-info flex column">
                    <h3>Profile Picture</h3>
                    <Buttons.Button
                        onClick={() => console.log("edit pfp")}
                        btnType="PRIMARY"
                    >Update Profile Picture</Buttons.Button>
                </div>
            </Card>
            <WorkshopHeader 
                image={`${serverHost}/${userstore.banner}`}
                title={userstore.username}
                textAlignment="right"
                description=""
            >
                <Buttons.Button
                    onClick={() => console.log("edit banner")}
                    btnType="PRIMARY"
                >Update Banner</Buttons.Button>
            </WorkshopHeader>
            {/* <pre>
                {JSON.stringify(userstore, null, 2)}
            </pre> */}
        </div>
        </>
    );
}