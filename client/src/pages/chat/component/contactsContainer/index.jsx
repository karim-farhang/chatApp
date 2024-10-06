import ProfileInfo from "@/pages/chat/component/profileInfo/index.jsx";
import NewDm from "@/pages/chat/component/newDm/index.jsx";
import {useEffect} from "react";
import {apiClient} from "@/lib/api-client";
import {GET_DM_CONTACTS_ROUTES} from "@/utils/constants";
import {useAppStore} from "@/store/index.js";
import {ContactList} from '@/components/contact-list.jsx';
import CreateChannel from "@/pages/chat/component/chatContainer/component/createChannel/index.jsx";
import logo from "../../../../../src/assets/images/logo_no_backgound.png";

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
        <div className='relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#181a21] border-r border-gray-700 h-screen flex flex-col'>
            


            <div className='pt-5 pl-5 item-center justify-center'>
                <center>
                <img src={logo} alt="Logo" className="h-21 w-21" />
                </center>
                
            </div>



            <div className='flex-grow overflow-y-auto'>
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


            </div>
            
            
            <ProfileInfo/>
        </div>
    );
};

export default ContactsContainer;

export const Title = ({text}) => {
    return (
        <h6 className='uppercase tracking-widest text-gray-400 pl-5 font-light text-sm'>
            {text}
        </h6>
    );
};
