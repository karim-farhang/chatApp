import {Tooltip, TooltipProvider, TooltipTrigger} from "@radix-ui/react-tooltip";
import {TooltipContent} from "@/components/ui/tooltip.jsx";
import {FaPlus} from "react-icons/fa";
import {useEffect, useState} from "react";
import Cookies from 'js-cookie';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {apiClient} from "@/lib/api-client.js";
import {CREATE_CHANNEL_ROUTES, GET_ALL_CONTACT_ROUTES} from "@/utils/constants.js";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";
import {useAppStore} from "@/store/index.js";
import Button from "@/components/ui/button.jsx";
import Select from "react-select";

const CreateChannel = () => {


    const { setSelectedChatType, setSelectedChatData} = useAppStore();


    const { addChannel} = useAppStore();
    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");


    useEffect(() => {
        const getData = async () => {
            try {
                const token = Cookies.get('jwt'); // Get the token from cookies

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await apiClient.post(
                    GET_ALL_CONTACT_ROUTES,
                    {}, // Add payload here if needed
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Send the token in the headers
                        },
                        withCredentials: true, // Ensure cookies are sent
                    }
                );

                if (response.status === 200) {
                    setAllContacts(response.data.contacts);
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        getData();
    }, []);


    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(
                    CREATE_CHANNEL_ROUTES, {
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value),
                    },
                    {withCredentials: true},
                );
                if (response.status === 201) {
                    setChannelName('');
                    setSelectedContacts([]);
                    setNewChannelModel(false);
                    addChannel(response.data.channel);
                }

            }
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };


    const handleSelectChange = (selectedOptions) => {
        setSelectedContacts(selectedOptions);
    };

    const availableContacts = allContacts.filter(
        contact => !selectedContacts.some(selected => selected.value === contact.value)
    );


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModel(true)}/>
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

                    <div className="my-4">
                        <input
                            placeholder="Group Name"
                            className="rounded-lg p-4 bg-[#2c2e3b] text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border-none w-full"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>

                    <div className="my-4">

                        {/*<MultipleSelector*/}
                        {/*    className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'*/}
                        {/*    defaultOptions={allContacts}*/}
                        {/*    placeholder='Search Contacts'*/}
                        {/*    value={selectedContacts}*/}
                        {/*    onChange={setSelectedContacts}*/}
                        {/*    emptyIndicator={*/}
                        {/*        <p className='text-center text-lg leading-10 text-gray-600'>*/}
                        {/*            No results found.*/}
                        {/*        </p>*/}
                        {/*    }*/}
                        {/*/>*/}


                        <Select
                            className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
                            options={allContacts} // Pass all available contacts
                            isMulti // Enables multiple selection
                            placeholder='Search Contacts'
                            value={selectedContacts} // Controlled input state
                            onChange={setSelectedContacts} // Update state on change
                            noOptionsMessage={() => 'No results found.'} // Customize the "No results" message
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
                        <Button
                            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={createChannel}
                        >
                            Create Group
                        </Button>
                    </div>

                    <ScrollArea className="h-[250px]">
                        <div className="flex flex-col gap-4">{/* Additional content */}</div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannel;
