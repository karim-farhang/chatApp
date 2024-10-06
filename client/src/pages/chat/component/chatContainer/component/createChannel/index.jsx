import { Tooltip, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "@/components/ui/tooltip.jsx";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { apiClient } from "@/lib/api-client.js";
import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACT_ROUTES } from "@/utils/constants.js";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { useAppStore } from "@/store/index.js";
import Button from "@/components/ui/button.jsx";
import Select from "react-select";

const CreateChannel = () => {


    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContacts, setAllContact] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);  // For selected contacts
    const [searchedContacts, setSearchedContacts] = useState([]);  // For searched contacts

    const [channelName, setChannelName] = useState('');




    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.post(GET_ALL_CONTACT_ROUTES, {
                withCredentials: true,
            });
            console.log(response.data.contact);  // Add this line to inspect the fetched contacts
            setAllContact(response.data.contact);  // Make sure the response is being set correctly
        };
        getData();
    }, []);



    const createChannel = async () => {

    }


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Create New Group
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Please fill up the details for new Group
                        </DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <input
                            placeholder="Group Name"
                            className="rounded-lg p-4 bg-[#2c2e3b] text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border-none w-full"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>

                        <Select
                            className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
                            options={allContacts}  // This must be an array of { label: "Name", value: "id" }
                            isMulti
                            placeholder='Search Contacts'
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            noOptionsMessage={() => 'No results found.'}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#1e1f2f',
                                    color: 'white',
                                    border: 'none',
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#3c3e4b',
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: 'white',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: 'gray',
                                }),
                            }}
                        />




                    </div>
                    <div>
                        <Button channelName='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
                            onClick={createChannel}
                        >Create Channel</Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannel;
