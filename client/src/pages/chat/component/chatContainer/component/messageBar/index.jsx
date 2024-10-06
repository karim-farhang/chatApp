import {useEffect, useRef, useState} from "react";
import {GrAttachment} from "react-icons/gr";
import {RiEmojiStickerLine} from "react-icons/ri";
import {IoSend} from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import {useAppStore} from "@/store/index.js";
import {useSocket} from "@/context/SocketContext.jsx";
import {apiClient} from "@/lib/api-client.js";
import {UPLOAD_FILE_ROUTE} from "@/utils/constants.js";

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef(null);

    const {selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress} = useAppStore();
    const socket = useSocket(); // Now correctly accessing socket
    const [message, setMessage] = useState('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [emojiRef]);

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    const handelSendMessage = async () => {
        if (selectedChatType === 'contact' && message.trim() !== '') {  // Check if message is not empty
            socket.emit('sendMessage', {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: 'text',
                fileUrl: undefined,
            });
            setMessage(''); // Clear the input after sending the message
        }
    };

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();  // Trigger the file input click
        }
    };


    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                // Create a FormData object to send the file via Axios
                const formData = new FormData();
                formData.append('file', file);
                setIsUploading(true);

                // Send the file to the server
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true,
                    onUploadProgress: data => {
                        setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'  // Proper headers for file upload
                    }
                });

                // Check if the file upload was successful
                if (response.status === 200 && response.data) {
                    setIsUploading(false);
                    const {originalName, filePath} = response.data;

                    console.log(`File uploaded: ${originalName}, available at: ${filePath}`);

                    // Emit the file message to the recipient through socket.io
                    if (selectedChatType === 'contact') {
                        socket.emit('sendMessage', {
                            sender: userInfo.id,
                            content: undefined,  // No text content
                            recipient: selectedChatData._id,  // Recipient ID
                            messageType: 'file',  // Indicate that this is a file message
                            fileUrl: filePath  // Send the file path from the server response
                        });
                    }
                }
            }
        } catch (error) {
            setIsUploading(false);
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
            <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
                <input
                    type='text'
                    className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
                    placeholder='Enter Message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} // Properly update the message state
                />
                <button
                    className='text-natural-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                    onClick={handleAttachmentClick}>
                    <GrAttachment className='text-2xl'/>
                </button>
                <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange}/>

                <div className='relative'>
                    <button onClick={() => setEmojiPickerOpen(true)}
                            className='text-natural-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                        <RiEmojiStickerLine className='text-2xl'/>
                    </button>
                </div>

                <div className='absolute bottom-16 right-0' ref={emojiRef}>
                    <EmojiPicker
                        theme='dark'
                        open={emojiPickerOpen}
                        onEmojiClick={handleAddEmoji}
                        autoFocusSearch={false}
                    />
                </div>
            </div>

            <button
                onClick={handelSendMessage}
                className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                <IoSend className='text-2xl'/>
            </button>
        </div>
    );
};

export default MessageBar;
