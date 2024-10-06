import {useAppStore} from "@/store/index.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {toast} from "sonner";
import ContactsContainer from "./component/contactsContainer/index.jsx";
import EmptyChatContainer from "./component/emptyChatContainer/index.jsx";
import ChatContainer from "./component/chatContainer/index.jsx";

const Chat = () => {

    const {
        userInfo,
        selectedChatType,
        isUploading,
        isDownloading,
        fileUploadProgress,
        fileDownloadProgress,
    } = useAppStore();


    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast('Please setup your profile');
            navigate('/profile');
        }
    }, [userInfo, navigate]);

    return (
        <div className='flex h-[100vh] text-white overflow-hidden'>


            {isUploading && (
                <div
                    className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
                    <h5 className='text-5xl animate-pulse'>Uploading File</h5>
                    {fileDownloadProgress}
                </div>
            )}


            {isDownloading && (
                <div
                    className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
                    <h5 className='text-5xl animate-pulse'>Downloading File</h5>
                    {fileDownloadProgress}
                </div>
            )}


            <div className='flex h-[100vh] text-white overflow-hidden'>
                <ContactsContainer/>
                { selectedChatType === undefined || selectedChatType === null ? ( <EmptyChatContainer /> ) : ( <ChatContainer /> )}
            </div>

        </div>

    );
};

export default Chat;
