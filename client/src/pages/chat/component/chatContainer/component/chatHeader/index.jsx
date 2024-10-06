import {RiCloseFill} from "react-icons/ri";
import {useAppStore} from "@/store";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {HOST} from "@/utils/constants.js";
import {getColor} from "@/lib/utils.js";

const ChatHeader = () => {
    const {selectedChatData,closeChat,selectedChatType} = useAppStore();

    return (<div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
        <div className='flex gap-5 items-center'>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
                <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                    {selectedChatData.image ? (<AvatarImage
                        src={`${HOST}/${selectedChatData.image}`}
                        alt="Profile"
                        className='object-cover w-full h-full bg-black'/>) : (<div
                        className={`uppercase h-12 w-12 text-lg font-bold flex items-center justify-center rounded-full ${getColor((selectedChatData.color))}`}>

                        {selectedChatData.firstName ? selectedChatData.firstName[0] : selectedChatData?.email[0]}

                        </div>)}
                </Avatar>
            </div>

            <div>
                {selectedChatType === "contact" && `${selectedChatData.firstName} ${selectedChatData.lastName}`}
            </div>

            <div className='flex items-center justify-center gap-5'>
                <button
                    onClick={closeChat}
                    className='text-natural-500
                           focus:border-none
                           focus:outline-none
                           focus:text-white
                           duration-300
                           transition-all'>
                    <RiCloseFill className='text-3xl'/>
                </button>
            </div>
        </div>
    </div>);
};

export default ChatHeader;
