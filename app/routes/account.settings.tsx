import TextHeader from "~/components/UI/textHeader";

export const handle = {
    breadcrumb: () => {
        return "Settings";
    }
};
export default function AccountSettings() {
    return (
        <div className="account-settings">
            <TextHeader
                title="Account Settings"
                description="Update your account information"
            />
        </div>
    );
}