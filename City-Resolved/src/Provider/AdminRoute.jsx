import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import useRole from "../Hooks/useRole";
import { Navigate } from "react-router";
import Loader from "../Components/Shared/Loader";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [role, isRoleLoading] = useRole();

    if (loading || isRoleLoading) {
        return <Loader />;
    }
    if (user && role === 'admin') {
        return children;
    }
    return <Navigate to="/" replace></Navigate>;
};

export default AdminRoute;