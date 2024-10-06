import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Auth from "@/pages/auth/index.jsx";
import Chat from "@/pages/chat/index.jsx";
import Profile from "@/pages/profile/index.jsx";
import { useAppStore } from "@/store/index.js";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_USER_INFO } from "@/utils/constants.js";
import { toast } from "sonner";

const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? <Navigate to="/chat" /> : children;
};

export default function Home() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getUserData = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });

                if (response.status === 200 && response.data) {
                    setUserInfo(response.data);
                } else {
                    setUserInfo(undefined);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || `Error fetching user info you not logged in: ${error}`;
                toast.error(errorMessage);
                setUserInfo(undefined);
            } finally {
                setLoading(false);
            }
        };

        getUserData();  // Always fetch user data on component mount
    }, [setUserInfo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthRoute> <Auth /> </AuthRoute>} />
                <Route path="/chat" element={<PrivateRoute> <Chat /> </PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        </BrowserRouter>
    );
};
