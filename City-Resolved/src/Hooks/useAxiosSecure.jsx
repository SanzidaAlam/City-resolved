import axios from "axios";
import { useNavigate } from "react-router"; // Recommended to use react-router-dom
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

import { auth } from "../Firebase/Firebase.init";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  axiosSecure.interceptors.request.use(
    async function (config) {
      const token = auth.currentUser
        ? await auth.currentUser.getIdToken()
        : null;
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        await logout();
        navigate("/auth/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
