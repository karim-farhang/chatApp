import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null); // Initialize socket as null
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            // Initialize the socket only if userInfo is available
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on('connect', () => {
                console.log('Connected to socket server');
            });

            // Attach the message listener after socket is initialized
            socket.current.on('receiveMessage', handleReceiveMessage);

            return () => {
                // Cleanup listeners and disconnect socket on unmount
                socket.current.off('receiveMessage', handleReceiveMessage);
                socket.current.disconnect();
            };
        }
    }, [userInfo]);

    const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        if (
            selectedChatType !== undefined &&
            (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
        ) {
            console.log('Message received', message);
            addMessage(message);
        }
    };

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
