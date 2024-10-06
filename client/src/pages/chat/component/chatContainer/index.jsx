import ChatHeader from "./component/chatHeader/index.jsx";
import MessageBar from "./component/messageBar/index.jsx";
import MessageContainer from "@/pages/chat/component/chatContainer/component/messageContainer/index.jsx";

const ChatContainer = () => {
    return (
        <div className='flex top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1'>
            <ChatHeader/>
            <MessageContainer/>
            <MessageBar/>
        </div>
    );

};

export default ChatContainer;
