export const handle = {
    breadcrumb: () => {
        return "Dashboard";
    }
};

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p>Admin dashboard content goes here</p>
        </div>
    );
}