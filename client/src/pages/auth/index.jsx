import logo_white from "@/assets/images/logo_white.ico";
import {useNavigate} from 'react-router-dom';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import Button from "@/components/ui/button.jsx";
import {toast} from "sonner";
import {apiClient} from "@/lib/api-client";
import {LOGIN_ROUTE, SIGNUP_ROUTE} from "@/utils/constants.js";
import {useAppStore} from "@/store/index.js";

const Auth = () => {
    const navigate = useNavigate();
    const {setUserInfo} = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Validation for Signup
    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        return true;
    };

    // Validation for Login
    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required.");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required.");
            return false;
        }
        return true;
    };

    // Handle Login
    const handleLogin = async () => {
        if (validateLogin()) {
            setIsLoading(true);
            try {
                const response = await apiClient.post(
                    LOGIN_ROUTE,
                    {email, password},
                    {withCredentials: true}
                );
                if (response.data.user.id) {
                    setUserInfo(response.data.user);
                    if (response.data.user.profileSetup) navigate('/chat');
                    else navigate("/profile");

                }
            } catch (error) {
                toast.error("Login failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle Signup
    const handleSignup = async () => {
        if (validateSignup()) {
            setIsLoading(true);
            try {
                const response = await apiClient.post(
                    SIGNUP_ROUTE,
                    {email, password},
                    {withCredentials: true}
                );

                if (response.status === 201) {
                    setUserInfo(response.data.user);
                    navigate("/profile");
                }

            } catch (error) {
                toast.error("Signup failed. Please try again.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="h-[100vh] w-full flex items-center justify-center">
            <div
                className="h-[80vh] bg-white border-2 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">

                {/* Left Side - Logo Section */}
                <div className="flex items-center justify-center bg-purple-500 rounded-l-3xl p-10">
                    <img
                        src={logo_white}
                        alt="background logo"
                        className="w-full h-auto max-w-[250px]"
                    />
                </div>

                {/* Right Side - Form Section */}
                <div className="flex flex-col gap-10 items-center justify-center p-10">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center mb-4">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                        </div>

                        <div className="flex items-center justify-center w-full">

                            <Tabs className="w-3/4" defaultValue="login">

                                <TabsList className="bg-transparent rounded-none w-full">
                                    <TabsTrigger
                                        value="login"
                                        className="text-black text-opacity-90 border-b-2 rounded-none w-full font-semibold border-b-purple-500 p-3"
                                    >
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signup"
                                        className="text-black text-opacity-90 border-b-2 rounded-none w-full font-semibold border-b-purple-500 p-3"
                                    >
                                        Signup
                                    </TabsTrigger>
                                </TabsList>

                                {/* Login Form */}
                                <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="rounded-full p-6"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="rounded-full p-6"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <Button
                                        className="rounded-full p-6"
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Logging in..." : "Login"}
                                    </Button>
                                </TabsContent>

                                {/* Signup Form */}
                                <TabsContent
                                    value="signup"
                                    className="flex flex-col gap-5 mt-10"
                                >
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="rounded-full p-6"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="rounded-full p-6"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <Input
                                        placeholder="Confirm Password"
                                        type="password"
                                        className="rounded-full p-6"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />

                                    <Button
                                        className="rounded-full p-6"
                                        onClick={handleSignup}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing up..." : "Signup"}
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
