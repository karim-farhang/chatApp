import { useAppStore } from "@/store/index.js";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { HOST } from "@/utils/constants.js";
import { getColor } from "@/lib/utils.js";

export const ContactList  = ({ contacts, isChannel = false }) => {
    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        selectedChatType,
        setSelectedChatMessages,
    } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) {
            setSelectedChatType("channel");
        } else {
            setSelectedChatType("contact");
        }

        // Reset messages if the selected contact changes
        if (!selectedChatData || selectedChatData._id !== contact._id) {
            setSelectedChatData(contact); // Set the newly selected contact
            setSelectedChatMessages([]); // Clear the message list for the new contact
        }
    };

    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                    ${selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#8417ff] hover:bg-[#8417ff]"
                        : "hover:bg-[#f1f1f111]"
                    }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {!isChannel && (
                            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {contact.image ? (
                                    <AvatarImage
                                        src={`${HOST}/${contact.image}`}
                                        alt="Profile"
                                        className="object-cover w-full h-full bg-black"
                                    />
                                ) : (
                                    <div
                                        className={`uppercase h-10 w-10 text-lg font-bold flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                                    >
                                        {contact.firstName ? contact.firstName[0] : contact?.email[0]}
                                    </div>
                                )}
                            </Avatar>
                        )}
                        <div>
                            {contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
