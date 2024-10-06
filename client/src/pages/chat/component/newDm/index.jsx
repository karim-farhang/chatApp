import {Tooltip, TooltipProvider, TooltipTrigger} from "@radix-ui/react-tooltip";
import {TooltipContent} from "@/components/ui/tooltip.jsx";
import {FaPlus} from "react-icons/fa";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import Lottie from "react-lottie";
import {animationDefaultOptions} from "@/lib/utils.js";
import {apiClient} from "@/lib/api-client.js";
import {HOST, SEARCH_CONTACTS_ROUTES} from "@/utils/constants.js";
import {toast} from "sonner";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {Avatar, AvatarImage} from "@/components/ui/avatar.jsx";
import {useAppStore} from "@/store/index.js";

const NewDm = () => {
    const {setSelectedChatType, setSelectedChatData} = useAppStore();
    const [openNewContactModal, setOpenNewContactModel] = useState(false);
    const [searchContacts, setSearchContacts] = useState([]);

    const searchContact = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    {searchTerm},
                    {withCredentials: true}
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchContacts(response.data.contacts);
                } else {
                    setSearchContacts([]);
                }
            }
        } catch (error) {
            toast.error('Error occurred' + error);
        }
    };

    const selectNewContact = (contact) => {
        setSelectedChatType('contact');
        setSelectedChatData(contact);
        setOpenNewContactModel(false);
        setSearchContacts([]);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className='text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300'
                            onClick={() => setOpenNewContactModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'
                    >
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModel}>
                <DialogContent
                    className='bg-[#1c1d25] border-none text-white w-[400px] h-[450px] rounded-lg shadow-lg'>

                    <DialogHeader>
                        <DialogTitle className='text-lg font-semibold'>Please Select a Contact</DialogTitle>
                        <DialogDescription className='text-sm text-gray-400'>Search for someone to chat
                            with</DialogDescription>
                    </DialogHeader>

                    <div className='my-4'>
                        <input
                            placeholder='Search Contacts'
                            className='rounded-lg p-4 bg-[#2c2e3b] text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border-none w-full'
                            onChange={(e) => searchContact(e.target.value)}
                        />
                    </div>


                    <ScrollArea className='h-[250px]'>
                        <div className='flex flex-col gap-4'>
                            {
                                searchContacts.length > 0 ? (
                                    searchContacts.map((contact) => (
                                        <div key={contact._id}
                                             className='flex gap-4 items-center p-3 hover:bg-[#32343f] rounded-md cursor-pointer transition-all'
                                             onClick={() => selectNewContact(contact)}>

                                            <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                                                {contact.image ? (
                                                    <AvatarImage
                                                        src={`${HOST}/${contact.image}`}
                                                        alt="Profile"
                                                        className='object-cover w-full h-full bg-black'/>
                                                ) : (
                                                    <div
                                                        className={`uppercase h-12 w-12 text-lg font-bold flex items-center justify-center rounded-full bg-purple-500`}>
                                                        {contact.firstName ? contact.firstName[0] : contact?.email[0]}
                                                    </div>
                                                )}
                                            </Avatar>

                                            <div className='flex flex-col'>
                                                <span className='font-medium text-sm'>
                                                    {contact.firstName || contact.lastName ? contact.firstName + ' ' + contact.lastName : contact?.email}
                                                </span>
                                                <span className='text-xs text-gray-400'>
                                                    {contact?.email}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex flex-col items-center justify-center h-full'>
                                        <Lottie
                                            isClickToPauseDisabled={true}
                                            height={150}
                                            width={150}
                                            options={animationDefaultOptions}
                                        />
                                        <div
                                            className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 text-xl'>
                                            <h3 className='poppins-medium'>
                                                <span className='text-purple-500'>Search</span> for a new contact
                                            </h3>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default NewDm;
