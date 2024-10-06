import ProfileInfo from "@/pages/chat/component/profileInfo/index.jsx";
import NewDm from "@/pages/chat/component/newDm/index.jsx";
import {useEffect} from "react";
import {apiClient} from "@/lib/api-client";
import {GET_DM_CONTACTS_ROUTES} from "@/utils/constants";
import {useAppStore} from "@/store/index.js";
import {ContactList} from '@/components/contact-list.jsx';
import CreateChannel from "@/pages/chat/component/chatContainer/component/createChannel/index.jsx";

const ContactsContainer = () => {
    const {directMessagesContacts, setDirectMessagesContacts, userInfo, channels} = useAppStore();

    useEffect(() => {
        const getContacts = async () => {
            if (!userInfo?.id) return;  // Ensure userId exists before making the request
            try {
                const response = await apiClient.post(GET_DM_CONTACTS_ROUTES, {id: userInfo.id}, {withCredentials: true});
                if (response.data.contacts) {
                    setDirectMessagesContacts(response.data.contacts);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        getContacts();
    }, [userInfo, setDirectMessagesContacts]);  // Add userInfo as a dependency to re-fetch if it changes

    return (
        <div
            className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#181a21] border-r border-gray-700 w-full h-screen'>
            <div className='pt-5 pl-5'>
                <Logo/>
            </div>

            {/* Direct Messages Section */}
            <div className='my-8'>
                <div className='flex items-center justify-between pr-8'>
                    <Title text='Direct Messages'/>
                    <NewDm/>
                </div>
                <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
                    <ContactList contacts={directMessagesContacts}/>
                </div>
            </div>

            <div className='my-8'>

                <div className='flex items-center justify-between pr-8'>
                    <Title text='Group Messages'/>
                    <CreateChannel/>
                </div>

                <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
                    <ContactList contacts={channels} isChannel={true}/>
                </div>

            </div>

            <ProfileInfo/>
        </div>
    );
};

export default ContactsContainer;

export const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <svg id="logo-38" width="50" height="32" viewBox="0 0 78 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="#6C63FF"/>
                <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="#7D7AFF"/>
                <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="#8583FF"/>
            </svg>
            <span className="text-2xl font-semi bold text-white">Chat System</span>
        </div>
    );
};

export const Title = ({text}) => {
    return (
        <h6 className='uppercase tracking-widest text-gray-400 pl-5 font-light text-sm'>
            {text}
        </h6>
    );
};

