import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../Hooks/useAxiosSecure";

const useRole = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: [user?.email, "role"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data?.role;
    },
  });

  return [role, isRoleLoading];
};

export default useRole;