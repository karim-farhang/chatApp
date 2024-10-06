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

    // If user profile is not set up, redirect them to the profile setup page
    useEffect(() => {
        if (!userInfo?.profileSetup) {
            toast.error('Please setup your profile before proceeding.');
            navigate('/profile');
        }
    }, [userInfo, navigate]);

    return (
        <div className='flex h-screen text-white overflow-hidden'>
            {/* Uploading file overlay */}
            {isUploading && (
                <div className='fixed inset-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
                    <h5 className='text-5xl animate-pulse'>Uploading File</h5>
                    <p className='text-lg'>{fileUploadProgress}% completed</p>
                </div>
            )}

            {/* Downloading file overlay */}
            {isDownloading && (
                <div className='fixed inset-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg'>
                    <h5 className='text-5xl animate-pulse'>Downloading File</h5>
                    <p className='text-lg'>{fileDownloadProgress}% completed</p>
                </div>
            )}

            {/* Main chat layout */}
            <div className='flex h-full w-full overflow-hidden'>
                {/* Contacts container */}
                <ContactsContainer />

                {/* Chat container or empty state */}
                {selectedChatType === undefined || selectedChatType === null ? (
                    <EmptyChatContainer message="Please select a chat to start messaging." />
                ) : (
                    <ChatContainer />
                )}
            </div>
        </div>
    );
};

export default Chat;
